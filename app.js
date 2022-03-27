if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}




const express = require('express')
const path = require('path')
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const catchAsync = require('./utils/catchAsync');
const Perkemahan = require('./models/campground');
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError');
const session = require('express-session')
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/users');
const multer = require('multer');
const db_url = process.env.DB_URL || 'mongodb://localhost:27017/berkemahSkuy';
const MongoDBStore = require('connect-mongo');
const secret = process.env.SECRET || 'beybladegila';


const KemahRouter = require('./routes/perkemahan')
const ReviewRouter = require('./routes/reviews')
const UserRouter = require('./routes/users')



const app = express();
mongoose.connect(db_url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });

const db = mongoose.connection;
db.on('error', (err) => { console.log('ada yang error nih', err) });
db.once('open', () => { console.log('Database Connection Opened') })

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(flash());

const store = MongoDBStore.create({
    mongoUrl: db_url,
    secret,
    touchAfter: 60 * 60 * 24
})

store.on("error", () => {
    console.log('failed to connect session to database');
})



const sessionConfig = {
    store,
    name: 'session',
    resave: false,
    saveUninitialized: true,
    secret,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7

    }
};

app.use(session(sessionConfig))

app.use(passport.initialize());
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    next();
})


app.use('/perkemahan', KemahRouter);
app.use('/perkemahan/:id/reviews', ReviewRouter);
app.use('/', UserRouter)


app.get('/', (req, res) => {
    res.redirect('/perkemahan');
})


app.all('*', (req, res, next) => {
    next(new ExpressError('Page tidak ditemukan', 404))

})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "oh no, ada yang salah bro"
    res.status(statusCode).render('perkemahan/error', { err })
})

// if (process.env.NODE_ENV == "production") {
//     let port = process.env.PORT
// } else {
//     let port = 3000
// }
app.listen(port = process.env.NODE_ENV == "production" ? process.env.PORT : 3000, () => {
    console.log(`server sedang berjalan di port ${port}`)
})
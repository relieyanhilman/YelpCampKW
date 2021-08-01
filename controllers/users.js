const User = require('../models/users');

module.exports.formRegister = (req, res) => {
  res.render('users/register');
}

module.exports.postLogin = async (req, res) => {
  try {
    // console.log(req.user);
    const kembaliKe = req.session.kembaliKe || '/perkemahan';
    delete req.session.kembaliKe
    req.flash('success', 'selamat datang kembali');
    res.redirect(kembaliKe);
  } catch (err) {
    console.log(err);
  }
}

module.exports.formLogin = (req, res) => {
  res.render('users/login')
}

module.exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'goodbye');
  res.redirect('/login');
}

module.exports.postRegister = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({
      email,
      username
    })
    const newUser = await User.register(user, password)
    req.login(newUser, (err) => {
      if (err) {
        return next(err);
      }
    })
    req.flash('success', 'selamat datang di yelpCampKW');
    res.redirect('/perkemahan');
  } catch (err) {
    req.flash('error', 'username sudah digunakan');
    res.redirect('/register');
  }
}
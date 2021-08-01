const Perkemahan = require('./models/campground');
const { kemahSchema, reviewSchema } = require('./JoiSchemaValidate.js');
const ExpressError = require('./utils/ExpressError');
const Review = require('./models/review')


module.exports.isLoggedIn = (req,res,next) => {
  if(!req.isAuthenticated()){
    req.session.kembaliKe = req.originalUrl;
    req.flash('error', 'anda harus login dulu');
    return res.redirect('/login');
  }
  next();
}

module.exports.isAuthor = async (req, res, next) =>  {
const {id} = req.params;
const kemah = await Perkemahan.findById(id);
  if(!kemah.author.equals(req.user._id)){
    req.flash('error', 'kamu tidak diperbolehkan mengedit kemah ini');
    return res.redirect(`/perkemahan/${id}`);
  }
  next();
}

module.exports.validateKemah = (req, res, next) => {
  const { error } = kemahSchema.validate(req.body)
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}

module.exports.validateReview = (req, res, next) => {
  const{error} = reviewSchema.validate(req.body)
  if(error){
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400)
  }else{
    next();
  }
}

module.exports.isReviewAuthor = async (req, res, next) => {
  const {id, reviewsId} = req.params;
  const review = await Review.findById(reviewsId);
  if(!review){
    req.flash('error', 'page tidak ditemukan');
    return res.redirect(`/perkemahan/${id}`);
  } 
  if(!req.user || !review.author.equals(req.user._id)){
    req.flash('error', 'Anda tidak bisa menghapus review ini');
    return res.redirect(`/perkemahan/${id}`);
  }
  next();
}
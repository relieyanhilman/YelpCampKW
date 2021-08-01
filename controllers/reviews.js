const Review = require('../models/review')
const Perkemahan = require('../models/campground');

module.exports.deleteReview = async(req, res) => {
  const {id, reviewsId} = req.params
  const review = await Review.findById(reviewsId);
  
  await Review.findByIdAndDelete(reviewsId)
  await Perkemahan.findByIdAndUpdate(id, {$pull : {reviews: reviewsId }})
  res.redirect(`/perkemahan/${id}`);
}

module.exports.postReview = async(req, res)=>{
  // console.log(req.params);
  const perkemahan = await Perkemahan.findById(req.params.id);
  const review = new Review(req.body.review)
  review.author = req.user._id;
  perkemahan.reviews.push(review);
  
  await perkemahan.save();
  await review.save();
  res.redirect(`/perkemahan/${perkemahan._id}`);
}
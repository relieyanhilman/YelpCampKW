const express = require('express')
const router = express.Router({mergeParams : true});
const catchAsync = require('../utils/catchAsync');
const Review = require('../models/review')
const Perkemahan = require('../models/campground');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');
const reviews = require('../controllers/reviews');


router.delete('/:reviewsId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

router.post('/', isLoggedIn, validateReview,catchAsync(reviews.postReview));

module.exports = router;
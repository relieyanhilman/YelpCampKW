const express = require('express')
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Perkemahan = require('../models/campground');
const { isLoggedIn, isAuthor, validateKemah } = require('../middleware');
const perkemahan = require('../controllers/perkemahan')
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
      .get(catchAsync(perkemahan.indexPerkemahan))
      .post(isLoggedIn, upload.array('image'), validateKemah, catchAsync(perkemahan.postNewCamp))
      

router.get('/new', isLoggedIn, perkemahan.newRenderForm);


router.route('/:id')
      .get(catchAsync(perkemahan.getDetailsCamp))
      .put(isLoggedIn, isAuthor, upload.array('image'), validateKemah, catchAsync(perkemahan.editCamp))
      .delete(isLoggedIn, isAuthor, catchAsync(perkemahan.deleteCamp))



router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(perkemahan.editCampForm));


module.exports = router;

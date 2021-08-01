const Perkemahan = require('../models/campground');
const {cloudinary}= require('../cloudinary');

module.exports.indexPerkemahan = async (req, res) => {
  const findPerkemahan = await Perkemahan.find();
  res.render('perkemahan/index', { findPerkemahan });

}

module.exports.newRenderForm = (req, res) => {
  res.render('perkemahan/new');
}

module.exports.getDetailsCamp = async (req, res) => {
  const kemah = await Perkemahan.findById(req.params.id).populate({
    path: 'reviews',
    populate: {
      path: 'author'
    }
  }).populate('author');
  if (!kemah) {
    req.flash('error', 'page tidak ditemukan broh')
    return res.redirect('/perkemahan');
  }
  res.render('perkemahan/show', { kemah });
}

module.exports.postNewCamp = async (req, res, next) => {

  const kemahBaru = new Perkemahan(req.body.kemah);
  kemahBaru.gambar = req.files.map(files => ({ url: files.path, filename: files.filename }))
  kemahBaru.author = req.user._id;
  await kemahBaru.save();
  req.flash('success', 'yes berhasil nambah kemah');
  res.redirect(`/perkemahan/${kemahBaru._id}`);
  console.log(kemahBaru.gambar);
}

module.exports.editCampForm = async (req, res) => {
  const kemah = await Perkemahan.findById(req.params.id);
  if (!kemah) {
    req.flash('error', 'page tidak ditemukan broh')
    return res.redirect('/perkemahan');
  }
  res.render('perkemahan/edit', { kemah });
}

module.exports.editCamp = async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  const baruEdit = await Perkemahan.findByIdAndUpdate(id, { ...req.body.kemah });
  const imgs = req.files.map(files => ({ url: files.path, filename: files.filename }));
  baruEdit.gambar.push(...imgs);
  await baruEdit.save();
  if (req.body.deleteImages) {
    for(let filename of req.body.deleteImages){
      await cloudinary.uploader.destroy(filename);
    }
    await baruEdit.updateOne({ $pull: { gambar: { filename: { $in: req.body.deleteImages } } } });
    console.log(baruEdit);
  }
  req.flash('success', 'yes kemah berhasil diedit')
  res.redirect(`/perkemahan/${baruEdit.id}`);
}

module.exports.deleteCamp = async (req, res) => {
  const { id } = req.params;
  await Perkemahan.findByIdAndDelete(id)
  req.flash('success', 'yes, kemah berhasil di delete')
  res.redirect('/perkemahan');
}

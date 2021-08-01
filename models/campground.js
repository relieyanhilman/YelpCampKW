const mongoose = require('mongoose');
const Review = require('./review')





const Schema = mongoose.Schema;

const imageSchema = new Schema({
  url: String,
  filename: String
})

imageSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/w_200');
});

const PerkemahanSchema = new Schema({
  judul: String,
  gambar: [imageSchema],
  harga: Number,
  deskripsi: String,
  lokasi: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]
})

PerkemahanSchema.post('findOneAndDelete', async function (doc) {

  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews
      }
    })
  }
})

module.exports = mongoose.model('Perkemahan', PerkemahanSchema);
const mongoose = require('mongoose');
const cities = require('./cities');
const {descriptors, places} = require('./seedHelpers')

const Perkemahan = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/berkemahSkuy', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', (err) => {console.log('ada yang error nih', err)});
db.once('open', () => {console.log('Database Connection Opened')})

const randomArray = array => array[Math.floor(Math.random() * array.length)];

const resetdb = async() => {
  await Perkemahan.deleteMany({});
  for(let i =0; i< 50; i++){
    let random = Math.floor(Math.random() * 1000);
    const buatBaru = new Perkemahan({
      author: '610357de8c6ed50c246e9f51',
      lokasi: `${cities[random].city}, ${cities[random].state}`,
      judul: `${randomArray(descriptors)} ${randomArray(places)}`,
      harga: Math.floor(Math.random() * (Math.floor(2000000) - Math.ceil(1500000) + 1) + Math.ceil(1500000)),
      deskripsi: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus sodales sagittis purus, malesuada elementum augue eleifend in. Quisque efficitur egestas dui, mattis congue ligula ornare nec. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Cras varius, est id posuere ultrices, ipsum mi mollis nisi, ut vestib',
      gambar: [
        {
          url: 'https://res.cloudinary.com/suppertech/image/upload/v1627708870/YelpCampKW/duzcaobzfvwf8cvuqajs.jpg',
          filename: 'YelpCampKW/duzcaobzfvwf8cvuqajs'
        },
        {
          url: 'https://res.cloudinary.com/suppertech/image/upload/v1627708870/YelpCampKW/zoznqeehqjipjdktd66b.jpg',
          filename: 'YelpCampKW/zoznqeehqjipjdktd66b'
        }
      ]
    });
    await buatBaru.save();
    
  }
}

resetdb().then(() => {
  mongoose.connection.close()
});
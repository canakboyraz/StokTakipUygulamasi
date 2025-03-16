const mongoose = require('mongoose');
const Category = require('./models/Category');
require('dotenv').config();

// Varsayılan kategoriler
const defaultCategories = [
  "Et Ürünleri",
  "Bakliyat",
  "Baharat",
  "Sebze-Meyve",
  "Donuk Ürünler",
  "Tatlılar",
  "Diğer"
];

// MongoDB bağlantısı
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/stok-takip';

mongoose.connect(mongoURI)
  .then(() => {
    console.log('MongoDB connected');
    seedCategories();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Kategorileri ekle
const seedCategories = async () => {
  try {
    // Önce mevcut kategorileri temizle
    await Category.deleteMany({});
    console.log('Mevcut kategoriler temizlendi');

    // Yeni kategorileri ekle
    const categoryPromises = defaultCategories.map(name => {
      return new Category({ name }).save();
    });

    await Promise.all(categoryPromises);
    console.log('Varsayılan kategoriler başarıyla eklendi');
    process.exit(0);
  } catch (err) {
    console.error('Kategori ekleme hatası:', err);
    process.exit(1);
  }
}; 
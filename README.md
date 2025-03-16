# Gıda Ürünleri Stok Takip Uygulaması

Modern bir arayüze sahip, gıda ürünleri için stok takip uygulaması.

## Özellikler

- **Stok Giriş**: Yeni ürünleri stok sistemine ekleyin
  - Ürün Adı
  - Giriş Tarihi
  - Son Kullanma Tarihi (opsiyonel)
  - Marka
  - Miktar

- **Stok Görüntüle**: Mevcut stok durumunu görüntüleyin
  - Tüm ürünlerin detaylı listesi
  - Arama ve filtreleme özellikleri
  - Ürün silme ve düzenleme

- **Stok Çıkış**: Ürün çıkışlarını kaydedin
  - Stoktan çıkarılacak ürün miktarını belirleyin
  - Stok durumunu otomatik güncelleme

## Teknolojiler

- **Backend**: Node.js, Express, MongoDB
- **Frontend**: React, Material-UI
- **Veritabanı**: MongoDB

## Kurulum

### Gereksinimler

- Node.js (v14 veya üzeri)
- MongoDB (yerel veya uzak)

### Adımlar

1. Projeyi klonlayın:
```
git clone <repo-url>
cd stok-takip
```

2. Bağımlılıkları yükleyin:
```
npm install
cd client
npm install
cd ..
```

3. MongoDB bağlantısını ayarlayın:
`.env` dosyasında `MONGO_URI` değerini kendi MongoDB bağlantı adresinizle değiştirin.

4. Uygulamayı başlatın:
```
npm run dev:full
```

Bu komut hem backend sunucusunu (5000 portunda) hem de frontend geliştirme sunucusunu (3000 portunda) başlatacaktır.

## Kullanım

1. Tarayıcınızda `http://localhost:3000` adresine gidin
2. Ana sayfada üç seçenek göreceksiniz: Stok Giriş, Stok Görüntüle ve Stok Çıkış
3. Stok Giriş sayfasında yeni ürünler ekleyin
4. Stok Görüntüle sayfasında mevcut ürünleri görüntüleyin ve yönetin
5. Stok Çıkış sayfasında ürün çıkışlarını kaydedin

## Görseller

Bu görselleri README dosyanıza şu şekilde ekleyebilirsiniz:
markdownCopy# Stok Takip Uygulaması

## Ekran Görüntüleri

### Ana Ekran
![Ana Ekran](https://i.ibb.co/gFvjn5SN/AnaEkran.jpg)

### Stok Giriş
![Stok Giriş](https://i.ibb.co/MxNLJwGv/Stok-Giris.jpg)

### Stok Çıkış
![Stok Çıkış](https://i.ibb.co/sdyFfX87/Stok-C-k-s.jpg)

### Stok Fiyat
![Stok Fiyat](https://i.ibb.co/ZRwqd4NT/Stok-Fiyat.jpg)

### Stok Görüntüle
![Stok Görüntüle](https://i.ibb.co/3YM1tb9Q/Stok-Goruntule.jpg)



## Lisans

ISC 

# Dawn Auto Bot

Bot otomatis untuk **login ke Dawn**, melakukan **refresh token**, dan menjalankan **keep-alive** session agar tetap aktif.

## ✨ Fitur
- ✅ Login otomatis via refresh token
- 🔄 Refresh token otomatis (jika expired)
- 🟢 Keep-alive loop (setiap 60 detik)

## 🧠 Cara Pakai

1. **Clone repository** dan masuk ke folder:

   ```bash
   git clone https://github.com/masbad123/dawn-auto-bot
   cd dawn-auto-bot
Install dependencies:

bash
Salin
Edit
npm install
Masukkan akun ke dalam account.json dengan format seperti ini:

json
Salin
Edit
[
  {
    "email": "youremail@example.com",
    "refresh_token": "your_refresh_token"
  }
]
Jalankan bot:

bash
Salin
Edit
node index.js

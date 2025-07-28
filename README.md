# Dawn Auto Bot

Bot otomatis untuk **login ke Dawn**, melakukan **refresh token**, dan menjalankan **keep-alive** session setiap 60 detik.

## ✨ Fitur
- ✅ Login otomatis via email & password (`.env`)
- 🔄 Refresh token otomatis
- 🟢 Keep-alive session setiap menit
- 📦 Disimpan lokal ke `account.json`

---

## 📦 Cara Install

1. Clone repo ini:
   ```bash
   git clone https://github.com/masbad123/dawn-auto-bot
   cd dawn-auto-bot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Buat file `.env`:
   ```bash
   nano .env
   ```

   Isi dengan format berikut:
   ```
   EMAIL=youremail@example.com
   PASSWORD=yourpassword
   ```

4. Jalankan bot:
   ```bash
   node index.js
   ```

---


## ❤️ Credits
Made by [@masbad123](https://github.com/masbad123)

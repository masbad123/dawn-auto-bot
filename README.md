# dawn-auto-bot

Bot otomatis untuk login, refresh token, dan keep-alive ke API dawn.gg.

## Cara Install & Jalankan

1. **Clone repo ini.**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Buat file `.env` berdasarkan `.env.example`:**
   ```
   EMAIL=your@email.com
   PASSWORD=your_password
   ```
4. **Jalankan bot:**
   ```bash
   npm start
   ```
5. **Catatan:**  
   - Jangan commit file `.env` dan `account.json` ke repo publik.
   - Token otomatis di-refresh setiap 30 menit, keep-alive tiap 1 menit.

## Kebutuhan

- Node.js terbaru
- Akun aktif dawn.gg

## Lisensi

MIT

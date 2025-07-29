require("dotenv").config();
const axios = require("axios");
const fs = require("fs");

const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;

const KEEPALIVE_URL = "https://www.aeropres.in/chromeapi/dawn/v1/userreward/keepalive";
const GETPOINTS_URL = "https://www.aeropres.in/api/atom/v1/userreferral/getpoint";

// Login function (dummy, sesuaikan dengan kebutuhan endpoint sebenarnya)
async function login() {
  try {
    // Sesuaikan jika butuh endpoint login API
    const res = await axios.post("https://www.aeropres.in/api/login", {
      email: EMAIL,
      password: PASSWORD,
    });
    const token = res.data.token;
    fs.writeFileSync("account.json", JSON.stringify({ token }, null, 2));
    console.log("✅ Login berhasil");
    return token;
  } catch (err) {
    console.error("❌ Gagal login:", err.message);
    return null;
  }
}

async function keepAlive(token) {
  try {
    const res = await axios.post(
      KEEPALIVE_URL,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("✅ Keepalive success:", res.data);
  } catch (err) {
    console.error("❌ Keepalive error:", err.message);
  }
}

async function getPoints(token) {
  try {
    const res = await axios.get(GETPOINTS_URL, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("🎯 Points:", res.data);
  } catch (err) {
    console.error("❌ Get points error:", err.message);
  }
}

async function main() {
  let token = null;
  try {
    const saved = JSON.parse(fs.readFileSync("account.json", "utf8"));
    token = saved.token;
  } catch {
    token = await login();
  }

  if (!token) return;

  // Keepalive tiap 1 menit
  setInterval(() => keepAlive(token), 60 * 1000);

  // Get points tiap 10 menit
  setInterval(() => getPoints(token), 10 * 60 * 1000);

  // Jalankan pertama kali
  keepAlive(token);
  getPoints(token);
}

main();

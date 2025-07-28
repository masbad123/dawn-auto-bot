require("dotenv").config();
const axios = require("axios");
const fs = require("fs");

const ACCOUNT_FILE = "./account.json";

async function loginWithEmailPassword(email, password) {
  try {
    const res = await axios.post("https://api.dawn.gg/v1/auth/login", {
      email,
      password,
    });

    const { token, refresh_token, user } = res.data;

    fs.writeFileSync(
      ACCOUNT_FILE,
      JSON.stringify({ email: user.email, token, refresh_token }, null, 2)
    );

    console.log("✅ Login sukses untuk:", user.email);
    return { token, refresh_token };
  } catch (err) {
    console.error("❌ Gagal login:", err.response?.data || err.message);
    return null;
  }
}

async function refreshToken(email, refreshToken) {
  try {
    const res = await axios.post("https://api.dawn.gg/v1/auth/refresh", {
      refresh_token: refreshToken,
    });

    const newToken = res.data.token;
    const user = res.data.user;

    fs.writeFileSync(
      ACCOUNT_FILE,
      JSON.stringify({ email: user.email, token: newToken, refresh_token: refreshToken }, null, 2)
    );

    console.log("🔄 Token di-refresh untuk:", user.email);
    return newToken;
  } catch (err) {
    console.error("❌ Gagal refresh token:", err.response?.data || err.message);
    return null;
  }
}

async function keepAlive(token, email) {
  try {
    await axios.get("https://api.dawn.gg/v1/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("🟢 Keep-alive berhasil:", email);
  } catch (err) {
    console.error("❌ Gagal keep-alive:", err.response?.status || err.message);
  }
}

async function main() {
  const email = process.env.EMAIL;
  const password = process.env.PASSWORD;

  if (!email || !password) {
    console.error("❌ EMAIL dan PASSWORD belum diatur di .env");
    return;
  }

  if (!fs.existsSync(ACCOUNT_FILE)) {
    const login = await loginWithEmailPassword(email, password);
    if (!login) return;
  }

  const account = JSON.parse(fs.readFileSync(ACCOUNT_FILE, "utf8"));
  let { token, refresh_token } = account;

  const newToken = await refreshToken(email, refresh_token);
  if (!newToken) return;

  setInterval(() => {
    keepAlive(newToken, email);
  }, 60 * 1000);
}

main();

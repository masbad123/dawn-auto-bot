const axios = require("axios");
const fs = require("fs");

const ACCOUNT_FILE = "./account.json";

async function refreshToken(email, refreshToken) {
  try {
    const res = await axios.post("https://api.dawn.gg/v1/auth/refresh", {
      refresh_token: refreshToken,
    });

    const newToken = res.data.token;
    const user = res.data.user;

    console.log("✅ Token refreshed for:", user.email);

    fs.writeFileSync(
      ACCOUNT_FILE,
      JSON.stringify({ email: user.email, token: newToken }, null, 2)
    );

    return newToken;
  } catch (error) {
    console.error("❌ Failed to refresh token:", error.response?.data || error.message);
    return null;
  }
}

async function keepAlive(token, email) {
  try {
    await axios.get("https://api.dawn.gg/v1/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("🟢 Keep-alive success for:", email);
  } catch (error) {
    console.error("❌ Keep-alive failed for:", email, "-", error.response?.status || error.message);
  }
}

async function main() {
  if (!fs.existsSync(ACCOUNT_FILE)) {
    console.error("❌ account.json not found");
    return;
  }

  const account = JSON.parse(fs.readFileSync(ACCOUNT_FILE, "utf8"));
  let { email, token } = account;

  const newToken = await refreshToken(email, token);
  if (!newToken) return;

  setInterval(() => {
    keepAlive(newToken, email);
  }, 60 * 1000); // tiap 60 detik
}

main();

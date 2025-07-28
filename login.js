const axios = require("axios");
const fs = require("fs");
const path = require("path");

const login = async (email, password) => {
  try {
    const response = await axios.post("https://www.aeropres.in/api/atom/v1/user/signin", {
      email,
      password,
    });

    const { token, user } = response.data.data;
    const accounts = [{ email: user.email, token }];
    fs.writeFileSync(path.join(__dirname, "accounts.json"), JSON.stringify(accounts, null, 2));
    console.log(`✅ Login success: ${user.email}`);
    return token;
  } catch (err) {
    console.error("❌ Login failed:", err.response?.data || err.message);
    return null;
  }
};

module.exports = login;

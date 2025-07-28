const axios = require('axios');
const https = require('https');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const proxies = require('./proxy');
const config = require('./config');
const login = require('./login');

const apiEndpoints = {
  keepalive: "https://www.aeropres.in/chromeapi/dawn/v1/userreward/keepalive",
  getPoints: "https://www.aeropres.in/api/atom/v1/userreferral/getpoint"
};

const ignoreSslAgent = new https.Agent({ rejectUnauthorized: false });

const randomDelay = (min, max) =>
  new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * (max - min + 1) + min) * 1000));

const generateAppId = (token) => {
  const appIdPrefix = "6752b";
  const hash = crypto.createHash('md5').update(token).digest('hex');
  return `${appIdPrefix}${hash.slice(0, 19)}`;
};

const appIdFilePath = path.join(__dirname, 'appIds.json');

const loadAppIds = () => fs.existsSync(appIdFilePath)
  ? JSON.parse(fs.readFileSync(appIdFilePath, 'utf-8')) : {};

const saveAppIds = (appIds) =>
  fs.writeFileSync(appIdFilePath, JSON.stringify(appIds, null, 2));

const fetchPoints = async (headers, appId) => {
  try {
    const res = await axios.get(`${apiEndpoints.getPoints}?appid=${appId}`, {
      headers,
      httpsAgent: ignoreSslAgent,
    });

    if (res.status === 200 && res.data.status) {
      const r = res.data.data.rewardPoint || {};
      const ref = res.data.data.referralPoint || {};
      return (r.points || 0) + (r.registerpoints || 0) + (r.signinpoints || 0)
        + (r.twitter_x_id_points || 0) + (r.discordid_points || 0)
        + (r.telegramid_points || 0) + (r.bonus_points || 0) + (ref.commission || 0);
    }
  } catch (e) {
    console.error(`⚠️ Error fetching points:`, e.message);
  }
  return 0;
};

const keepAliveRequest = async (headers, email, appId) => {
  const payload = {
    username: email,
    extensionid: "fpdkjdnhkakefebpekbdhillbhonfjjp",
    numberoftabs: 0,
    _v: "1.1.2"
  };

  try {
    const res = await axios.post(`${apiEndpoints.keepalive}?appid=${appId}`, payload, {
      headers,
      httpsAgent: ignoreSslAgent
    });

    return res.status === 200;
  } catch (e) {
    console.error(`❌ Keep-alive failed for ${email}:`, e.message);
    return false;
  }
};

const countdown = async (seconds) => {
  for (let i = seconds; i > 0; i--) {
    process.stdout.write(`⏳ Restarting in ${i}s...\r`);
    await randomDelay(1, 1);
  }
  console.log("\n🔄 Restarting...\n");
};

const run = async () => {
  console.log("🌟 DAWN Auto Login + Keep Alive by @recitativonika 🌟");

  const appIds = loadAppIds();

  // Refresh login
  const token = await login(config.credentials.email, config.credentials.password);
  if (!token) return;

  const email = config.credentials.email;
  const proxy = config.useProxy ? proxies[0] : undefined;
  const extensionId = "fpdkjdnhkakefebpekbdhillbhonfjjp";

  let appId = appIds[email];
  if (!appId) {
    appId = generateAppId(token);
    appIds[email] = appId;
    saveAppIds(appIds);
  }

  const headers = {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
    "Accept": "*/*",
    "Origin": `chrome-extension://${extensionId}`,
    "User-Agent": "Mozilla/5.0",
  };

  const points = await fetchPoints(headers, appId);
  console.log(`🔍 Logged in as: ${email}, Points: ${points}`);

  const success = await keepAliveRequest(headers, email, appId);
  console.log(success
    ? `✅ Keep-Alive success for ${email}`
    : `❌ Keep-Alive failed for ${email}`);

  await countdown(config.restartDelay);
  run(); // restart
};

run();

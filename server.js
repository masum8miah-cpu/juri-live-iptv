const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("trust proxy", true);

// GitHub Pages M3U
const PLAYLIST =
  "https://masum8miah-cpu.github.io/my-ip-tv/%E0%A6%AC%E0%A7%8D%E0%A6%B0%E0%A6%BE%E0%A6%87%E0%A6%9F%E0%A6%BF%E0%A6%9C.m3u";

// Playlist Token
const TOKEN = "evnat2026";

// Stats Key (শুধু তুমি জানবে)
const ADMIN_KEY = "billaladmin2026";

// Stats
const stats = {
  totalViews: 0,
  ips: {},
  tokens: {}
};

app.get("/playlist.m3u", async (req, res) => {

  if (req.query.token !== TOKEN) {
    return res.status(403).send("Access Denied");
  }

  const ip = req.ip;
  const token = req.query.token;

  stats.totalViews++;

  stats.ips[ip] = (stats.ips[ip] || 0) + 1;
  stats.tokens[token] = (stats.tokens[token] || 0) + 1;

  console.log(`[${new Date().toISOString()}] ${ip} opened playlist`);

  try {
    const response = await fetch(PLAYLIST);

    if (!response.ok) {
      return res.status(500).send("Failed to load playlist");
    }

    const text = await response.text();

    res.setHeader("Content-Type", "application/x-mpegURL");
    res.send(text);

  } catch (err) {
    res.status(500).send("Failed to load playlist");
  }

});

// Stats Page
app.get("/stats", (req, res) => {

  if (req.query.key !== ADMIN_KEY) {
    return res.status(403).send("Access Denied");
  }

  res.json({
    total_views: stats.totalViews,
    unique_ips: Object.keys(stats.ips).length,
    ip_list: stats.ips,
    token_usage: stats.tokens
  });

});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
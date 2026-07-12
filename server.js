const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// আপনার GitHub Pages M3U
const PLAYLIST =
  "https://masum8miah-cpu.github.io/my-ip-tv/%E0%A6%AC%E0%A7%8D%E0%A6%B0%E0%A6%BE%E0%A6%87%E0%A6%9F%E0%A6%BF%E0%A6%9C.m3u";

// আপনার টোকেন
const TOKEN = "evnat2026";

app.get("/playlist.m3u", async (req, res) => {
  if (req.query.token !== TOKEN) {
    return res.status(403).send("Access Denied");
  }

  try {
    const response = await fetch(PLAYLIST);
    const text = await response.text();

    res.setHeader("Content-Type", "application/x-mpegURL");
    res.send(text);
  } catch (err) {
    res.status(500).send("Failed to load playlist");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

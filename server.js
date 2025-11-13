// server.js — Global Chat API v2.0.19 (Dual Container Clean Fix)
// Message and server info are sent as two clean embeds
// No "(image)" text bug, clean style, consistent color
// © 2025 Naqint

import express from "express";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json({ limit: "350kb" }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "data");
const DATA_PATH = path.join(DATA_DIR, "globalchat.json");
const HISTORY_PATH = path.join(DATA_DIR, "history.json");

const PORT = Number(process.env.PORT) || 3000;
const API_KEY = process.env.API_KEY || "supersecretapikey";

// Initialize data folder and files
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(DATA_PATH)) fs.writeFileSync(DATA_PATH, JSON.stringify({ guilds: [] }, null, 2));
if (!fs.existsSync(HISTORY_PATH)) fs.writeFileSync(HISTORY_PATH, JSON.stringify({ messages: [] }, null, 2));

function readData() {
  return JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
}
function writeData(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}
function readHistory() {
  return JSON.parse(fs.readFileSync(HISTORY_PATH, "utf8"));
}
function writeHistory(data) {
  fs.writeFileSync(HISTORY_PATH, JSON.stringify(data, null, 2));
}
function appendHistory(entry) {
  const history = readHistory();
  history.messages.unshift(entry);
  if (history.messages.length > 2000) history.messages = history.messages.slice(0, 2000);
  writeHistory(history);
}
function requireApiKey(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || auth !== `Bearer ${API_KEY}`)
    return res.status(401).json({ error: "Unauthorized" });
  next();
}

// Main chat relay
app.post("/chat", requireApiKey, async (req, res) => {
  try {
    const { message, guildName } = req.body;
    if (!message || !message.guildId)
      return res.status(400).json({ error: "Invalid message data" });

    const origin = guildName || message.guildName || "Unknown Server";
    const username = message.author?.globalName || message.author?.username || "Unknown";
    const avatar = message.author?.avatarURL || message.author?.avatar || "";

    // Detect image or sticker
    let imageUrl = null;
    if (Array.isArray(message.attachments) && message.attachments.length > 0) {
      const img = message.attachments.find(a => a.contentType?.startsWith("image/")) || message.attachments[0];
      if (img) imageUrl = img.url;
    }
    if (Array.isArray(message.stickerItems) && message.stickerItems.length > 0 && !imageUrl) {
      const s = message.stickerItems[0];
      imageUrl = `https://media.discordapp.net/stickers/${s.id}.png`;
    }

    // Reply simulation
    let replyLine = "";
    if (message.referencedMessage) {
      const ref = message.referencedMessage;
      const refAuthor = ref.author?.globalName || ref.author?.username || "Unknown";
      const refContent = ref.content
        ? ref.content.slice(0, 80).replace(/\n/g, " ")
        : "(no text)";
      replyLine = `Replying to ${refAuthor}: ${refContent}`;
    }

    const contentText = (message.content || "").trim();
    const mainContent = [replyLine, contentText].filter(Boolean).join("\n").trim();

    // Embed #1: message container
    const messageEmbed = {
      color: 0x2f3136,
      description: mainContent || null,
      timestamp: new Date().toISOString()
    };
    if (imageUrl) messageEmbed.image = { url: imageUrl };

    // Embed #2: server info container
    const serverEmbed = {
      color: 0x2f3136,
      description: `**Message from ${origin}**`,
      footer: { text: "Global Chat Network" },
      timestamp: new Date().toISOString()
    };

    // Log
    console.log("------------------------------------------------");
    console.log(`${username} @ ${origin}`);
    console.log(mainContent || "[image/sticker message]");
    if (imageUrl) console.log("🖼️ " + imageUrl);
    console.log("------------------------------------------------");

    appendHistory({
      id: message.id || Date.now(),
      timestamp: new Date().toISOString(),
      guildName: origin,
      username,
      avatar,
      content: mainContent,
      imageUrl
    });

    const data = readData();
    const targets = data.guilds.filter(g => g.guildId !== message.guildId);
    let success = 0;

    for (const t of targets) {
      const payload = {
        username,
        avatar_url: avatar,
        embeds: [messageEmbed, serverEmbed]
      };
      await fetch(t.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }).then(() => success++).catch(() => {});
    }

    res.json({ status: "ok", success, total: targets.length });
  } catch (err) {
    console.error("❌ /chat error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Server start
app.listen(PORT, () => {
  console.log("======================================");
  console.log("🌐 Global Chat API v2.0.19 (Dual Container Clean Fix)");
  console.log(`📡 Port: ${PORT}`);
  console.log(`🔑 API Key: ${API_KEY}`);
  console.log("======================================");
});

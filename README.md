# 🌍 Global Chat API v2.0.19

A modern **cross-server chat relay system for Discord**, built with **Node.js + Express**.  
This API allows multiple Discord servers to communicate in a **shared global chat**,  
even though they are completely separate guilds — using **webhooks**.

---

## ✨ Overview

**Global Chat API** provides a simple RESTful backend that connects Discord servers  
into a single, shared chat network. Messages sent in one server’s “global chat”  
are relayed in real-time to other connected servers — including text, replies,  
images, and stickers — while preserving sender identity and style.

---

## 🧩 Features

- 🔗 **Cross-server communication** using Discord webhooks  
- 💬 **Real message relay** (text, embeds, replies, images, stickers)  
- 🧱 **Dual-container message design**:
  - First container → message content  
  - Second container → clean origin server tag  
- 🧠 **Smart reply simulation** (shows who is being replied to)
- 🪶 **Minimalist & elegant embed style**
- 🧰 **Simple REST API** (add, remove, list, relay)
- 🪵 **JSON-based persistent storage**
- 🔒 **API key authentication** for secure message relay
- 🧾 **Automatic logging and history saving**

---

## ⚙️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/global-chat-api.git
cd global-chat-api
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file or use your hosting’s environment configuration.  
You can also set values directly in your control panel if you’re using Pterodactyl.

Example:
```env
PORT=3000
API_KEY=supersecretapikey
```

### 4. Run the server
```bash
node server.js
```

If successful, you’ll see:
```
======================================
🌐 Global Chat API v2.0.19 (Dual Container Clean Fix)
📡 Port: 3000
🔑 API Key: supersecretapikey
======================================
```

---

## 🧠 How It Works

1. Each Discord server uses a webhook created in its global chat channel.  
2. When someone sends a message, your Discord bot sends the message data  
   to the Global Chat API endpoint:
   ```
   POST /chat
   ```
3. The API relays that message to all other registered webhooks,  
   displaying the message and the origin server in two clean embeds.

---

## 🧾 API Reference

### `POST /add`
Register a new guild webhook.
```json
{
  "guildId": "123456789",
  "webhookId": "123456789012345678",
  "webhookToken": "abcDEFghiJKL123",
  "guildName": "Naqent Support"
}
```

### `DELETE /remove/:guildId`
Removes a guild from the relay network.

### `GET /list`
Lists all registered guilds.

### `POST /chat`
Relays a message to all connected servers.
Requires Authorization header:
```
Authorization: Bearer <API_KEY>
```

---

## 🖼️ Message Example (in Discord)

> **Naqint:** hello everyone 😄  
> *(image if attached)*  

> **Message from Naqent Support**  
> _Global Chat Network_

---

## 📁 File Structure

```
├── server.js               # Main API server
├── data/
│   ├── globalchat.json     # Registered guilds
│   └── history.json        # Message logs
├── package.json
└── README.md
```

---

## 🧱 Technology Stack

- **Node.js 18+**
- **Express.js**
- **Discord Webhooks**
- **JSON file persistence**
- **ES Modules (import/export)**

---

## 🧰 Example Usage (Node.js)

```js
import fetch from "node-fetch";

await fetch("https://your-api-url/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer supersecretapikey"
  },
  body: JSON.stringify({
    message: {
      id: "123",
      content: "Hello from Naqint!",
      author: {
        username: "Naqint",
        avatarURL: "https://cdn.discordapp.com/avatars/123/avatar.png"
      },
      guildId: "987654321"
    },
    guildName: "Naqent Support"
  })
});
```

---

## 🧩 Integration Notes

- Works perfectly with **Discord bots** built using:
  - Discord.js
  - Eris
  - Harmony
- You can safely host it on:
  - **Pterodactyl Panel**
  - **VPS / Dedicated Server**
  - **Render / Railway / Replit (Node environment)**

---

## 🤝 Contributing

Pull requests are welcome!  
If you’d like to improve features, fix bugs, or optimize message design,  
feel free to fork and submit a PR.

---

## 📜 License

MIT License © 2025 [Naqint](https://github.com/<your-username>)

---

## 💡 Credits

Created with ❤️ by **Naqint**  
Inspired by the idea of connecting communities beyond servers.

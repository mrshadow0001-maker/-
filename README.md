<p align="center">
  <img src="https://res.cloudinary.com/df2rnoijw/image/upload/v1752404824/shkqo3nbxkhhbyej2lxm.jpg" width="300" height="300" style="border-radius: 50%;">
</p>

<h1 align="center">Ｉｔｓme𝑳𝒖𝒄𝒊fvｅｒ ࿐ </h1>

<p align="center">
  <b>Advanced Multi-Device WhatsApp & Telegram User Bot</b><br>
  <i>Created by <b>CYBER KING SHADOW 👑</b></i>
</p>

<p align="center">
  <a href="https://whatsapp.com/channel/0029Vb8lct0HltY6qWZkFR1V"><img src="https://img.shields.io/badge/WhatsApp-Channel%201-25D366?style=for-the-badge&logo=whatsapp&logoColor=white" /></a>
  <a href="https://whatsapp.com/channel/0029Vb6uY0uCsU9R86NUsK2a"><img src="https://img.shields.io/badge/WhatsApp-Channel%202-25D366?style=for-the-badge&logo=whatsapp&logoColor=white" /></a>
  <a href="https://t.me/itsmeshadow0"><img src="https://img.shields.io/badge/Telegram-Channel-26A5E4?style=for-the-badge&logo=telegram&logoColor=white" /></a>
</p>

---

## ✨ Main Features

- 🛡️ **Group Moderation & Anti-Link:** 
  - Automatically deletes group links posted by non-admins.
  - 1st Warning message on first attempt.
  - Automatic kick/remove on 2nd attempt.
- 📥 **Media Downloader:**
  - YouTube Songs & Videos
  - Facebook Videos
  - TikTok Videos (No Watermark)
  - Instagram Reels & Photos
  - Google Media
- 🧠 **AI & Smart Tools:**
  - Gemini / GPT AI Chat
  - Text-to-Image (AI Photo Generation)
- 👥 **Group Controls:**
  - Add / Remove members
  - Tag All Members
  - Mute / Unmute Group
- 🔑 **Telegram Pairing Code System:**
  - Pair easily via Telegram Bot interface.

---

## 👑 Owner & Credit Details

| Detail | Information |
| :--- | :--- |
| **Bot Name** | Ｉｔｓme𝑳𝒖𝒄𝒊ｆｅｒ ࿐  |
| **Owner** | CYBER KING SHADOW 👑 |
| **Organization** | SHADOW KINGDOM |
| **WhatsApp Contact** | [+94763834416](https://wa.me/94763834416) |

---

## 🔗 Official Links

- 💬 **WhatsApp Group:** [Join Here](https://chat.whatsapp.com/Cwow4HHJ8zq4IpYMhMq8WI?s=cl&p=i&mlu=4&ilr=4&iam=0)
- 📢 **WhatsApp Channel 1:** [Follow Here](https://whatsapp.com/channel/0029Vb8lct0HltY6qWZkFR1V)
- 📢 **WhatsApp Channel 2:** [Follow Here](https://whatsapp.com/channel/0029Vb6uY0uCsU9R86NUsK2a)
- ✈️ **Telegram Channel:** [Join Here](https://t.me/itsmeshadow0)

---

## 🚀 Installation Setup

```bash
# 1. Clone the repository
git clone [https://github.com/YOUR_USERNAME/Lucifer-Bot.git](https://github.com/YOUR_USERNAME/Lucifer-Bot.git)

# 2. Change directory
cd Lucifer-Bot

# 3. Install dependencies
npm install

# 4. Start the bot
npm start


## Pairing bot setup (patched)

1. Copy `config.env.example` to `config.env`.
2. Create a **new** Telegram bot token with BotFather and set `TELEGRAM_API=...` in `config.env`.
3. Install dependencies with `npm install`.
4. Start with `npm start`, then open your Telegram bot privately and send `/pair`.
5. Send your WhatsApp number in international format using digits only (for example, `947XXXXXXXX`).

Keep `config.env` and the `auth/` folder private. Never upload your Telegram token or WhatsApp session files to GitHub. If an old token was exposed, revoke it with BotFather and use a new one.

The pairing handler has been connected to the active Baileys socket. JavaScript syntax checks pass, but a real WhatsApp pairing attempt still needs to be tested on your hosting environment.

### Important: existing command modules

`menu.js`, `group.js`, and `downloader.js` import `../command`, but this repository's `index.js` uses a separate inline command handler and does not load that framework. Those modules will not become active just by being present in this ZIP; they need to be ported into `index.js` or the missing command framework must be supplied.

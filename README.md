# 🛠️ BlogForge

BlogForge is a minimalist, powerful CLI-based blog management tool built entirely with **Node.js core modules** — no frameworks, no libraries.

It generates, watches, and serves Markdown-based blog posts as a static site, making it perfect for learning and mastering the Node.js ecosystem.

---

## 📦 Features

- 🧠 Write blog posts with AI content (optional via proxy mode)
- 🗂 Generate Markdown blogs via CLI
- 🔄 Live file watching and auto-updates
- 🌐 Local HTTP server with HTML rendering
- 📡 Proxy mode to route AI generation to external API (OpenAI, Hugging Face, etc.)
- 🧪 Built-in test runner for all phases
- 🔧 Uses only built-in Node.js modules

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/your-username/blogforge.git
cd blogforge

# Run CLI tool
node blogforge.js create "My First Blog"

# Start the dev server
node server.js

# View at
http://localhost:3000
```

---

## 📁 Project Structure

```
blogforge/
├── blogs/                # Generated Markdown files
├── server.js             # Static file server
├── blogforge.js          # CLI interface
├── watcher.js            # File watcher for blogs
├── proxy.js              # Proxy mode for AI
├── render.js             # Markdown to HTML renderer
├── test-runner.js        # Node.js test runner
└── README.md
```

---

## ⚙️ CLI Usage

```bash
node blogforge.js create "Post Title"
node blogforge.js list
node blogforge.js delete "Post Title"
```

---

## 🔌 Proxy Mode (AI Blog Generation)

Configure your `.env` or inject API key manually in `proxy.js` to allow AI-powered blog post generation via OpenAI or Hugging Face.

```js
node proxy.js --topic "How to learn Node.js"
```

---

## 🧪 Testing

```bash
node test-runner.js
```

Tests core modules: `fs`, `path`, `http`, `os`, `child_process`, etc.

---

## 🧠 Learning Goals

- Understand Node.js core modules
- Master CLI design with `process.argv`
- Practice filesystem operations and HTTP server
- Learn inter-process communication and proxying
- Build offline tools with real-world value

---

## 👨‍💻 Author

Created by Henry orji as a Node.js Mastery Project.

---

## 📄 License

MIT

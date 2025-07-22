# 🛠️ BlogForge

**BlogForge** is a local-first content generation toolkit that includes:

- A powerful command-line tool (CLI) for generating AI-powered blog content
- A lightweight server for previewing blogs in the browser

---

## 📁 Project Structure

This repository contains two tools:

### 1. 🖥️ `cli.ts` — Command Line Interface (Published to npm)

- Installs globally via `npm`
- Saves blogs to the user's `Downloads/BlogForge/` folder
- Offers helpful commands like `os`, `ai`, `create`, and `list`
- Designed for offline, local-first content generation
- only need internet connention for generating ai blog

### 2. 🌐 `server.ts` — Local Preview Server (Not on npm)

- Serves generated blog posts as json 
- Useful for local development or deploying a static blog viewer
- Optional component you can run or host separately
- Available on `githum`

---

## 🚀 CLI Installation

Install BlogForge CLI globally:

```bash
npm install -g blogforge      
yarn add -D blogforge
```

---

## ⚙️ CLI Usage

```bash
blogforge ai "The Rise of AI Writing" "Author" 
```

This command generates a new blog post with:

- Clean Markdown (`post.md`)
- Metadata (`meta.json`)

All saved in your local `~/Downloads/BlogForge/` directory.

### 🧰 Available CLI Commands

| Command                                         | Description                              |
| ----------------------------------------------- | ---------------------------------------- |
| `blogforge create <author> <title> <body>`      | Create a new blog with your inputs       |
| `blogforge ai <title> <author>`                 | Create a new blog with generated ai body |
| `blogforge edit <slug> <author> <title> <body>` | Updated existing blog                    |
| `blogforge list`                                | List all created blogs                   |
| `blogforge delete`                              | Delete all blogs and blogforge folder    |
| `blogforge -help`                               | Show help menu                           |

---

## 🌐 Server Usage (Optional)

The `server.ts` file is **not part of the npm package**. It lets you preview your generated blogs in the browser.

### 🔧 To Run Locally:

```bash
git clone https://github.com/henrygad/BlogForge.git
yarn build
yarn start
```

It the browser version of cli. It create and serves blog content on the web that is ideal for:

- Testing how it work on browser
- Hosting locally on LAN or deploying on your own server

---

## 💻 Local Development

```bash
yarn install
yarn dev:server   # Run Server in dev mode
yarn dev:blogforge    # Run CLI in dev mode
yarn build       # Build CLI and server
```

---

## 📄 License

MIT © [Henry Orji](https://github.com/henrygad)

---

## 🔗 Links

- 🔸 [GitHub Repository](https://github.com/henrygad/BlogForge)
- 🔸 [npm Package](https://www.npmjs.com/package/@henry0rji/blogforge)

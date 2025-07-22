// start http server hosting on post 3000
import http from "http";
import blogRoutes from "./routes/blog.route";
import getLocalIP from "./utils/getLocalIP";
import fs from "fs";
import path from "path";
import { blogs } from "./types/post.types";

// Set the port for the server
// You can change this to any port you want
const PORT = 3000;

// Create the server
const server = http.createServer((req: http.IncomingMessage,
    res: http.ServerResponse<http.IncomingMessage>) => {

    if (req.url?.startsWith("/api/blog")) {
        blogRoutes(req, res);
    } else {

        const dbPath = path.resolve("public/data/posts/posts.json");
        if (!fs.existsSync(dbPath)) {
            res.writeHead(404, { "Content-Type": "application/json" });
            return res.write(JSON.stringify({ message: "Empty db file" }));
        }
        const db = fs.readFileSync(dbPath, "utf-8");
        const blogs = JSON.parse(db) as blogs;


        const blog_html_template = path.resolve("src/blog-template.html");

        fs.readFile(blog_html_template, "utf-8", (err, data) => {
            if (err) {
                res.writeHead(404, { "Content-Type": "application/json" });
                return res.write(JSON.stringify({ message: "blog html template file not found" }));
            }

            let body = "";

            blogs.map(blog =>
                body += `
                <article style="width: 100%;">
                    <p>${blog.author}</p>
                    <div>
                        <h3>${blog.title}</h3>
                        <p>last updated ${blog.date}</p>
                    </div>
                    <p>${blog.body}</p>
                    <span style="display: block;">${blog.slug}</span>
                </article>
                <hr>
                </br>
                `
            );

            const amend_blog_hmtl_template = data.replace("{{body}}", body);

            res.writeHead(200, { "Content-Type": "text/html" });

            res.end(amend_blog_hmtl_template);
        });
    }
});

// Get the local IP address
// This will be used to host the server on the local network
const LAN_IP = getLocalIP();

// If the LAN IP is not found, fallback to localhost
if (!LAN_IP) {
    console.warn("Local IP not found, falling back to localhost");
}
// Start the server and listen on the specified port and LAN IP
// This will allow the server to be accessible on the local network
server.listen(PORT, LAN_IP, () => {
    console.log(`🚀 Server running at http://${LAN_IP}:${PORT}/`);
});

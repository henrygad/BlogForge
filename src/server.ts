// start http server hosting on post 3000
import http from "http";
import blogRoutes from "./routes/blog.route";
import getLocalIP from "./utils/getLocalIP";

const PORT = 3000;

const server = http.createServer((req: http.IncomingMessage,
    res: http.ServerResponse<http.IncomingMessage>) => {

    if (req.url?.startsWith("/api/blog")) {
        blogRoutes(req, res);
    }else {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end(JSON.stringify({ message: "Hello from BlogForge Server", }));
    }
});

const LAN_IP = getLocalIP();

server.listen(PORT, LAN_IP, () => {
    console.log(`🚀 Server running at http://${LAN_IP}:${PORT}/`);
});

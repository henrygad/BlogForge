// Create blog crud route
import http from "http";
import { createBlog, proxyToGenerateAiBlog, readBlog, streamChangesMadeOnBlogs } from "../controllers/blog.controller";

const blogRoutes = (req: http.IncomingMessage,
    res: http.ServerResponse<http.IncomingMessage>) => {
    
    if (req.url === "/api/blog/ai" &&
        req.method === "POST"
    ) {

        proxyToGenerateAiBlog(req, res);
        return;
    }

    if (req.url === "/api/blog/event" &&
        req.method === "GET"
    ) {
        streamChangesMadeOnBlogs(req, res);
        return;
    }

    if (req.method === "POST") {
        createBlog(req, res);
    }
    else if (req.method === "GET") { 
        readBlog(req, res);
    }
    else if (req.method === "PATCH") {  
        
    }
    else if (req.method === "DELETE") {         
    }
    else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "This blog route is not found" }));
    }
};

export default blogRoutes;


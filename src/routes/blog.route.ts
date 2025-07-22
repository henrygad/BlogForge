// Create blog crud route
import http from "http";
import { createBlog, proxyToGenerateAiBlog, readBlog, streamChangesMadeOnBlogs } from "../controllers/blog.controller";

const blogRoutes = (req: http.IncomingMessage,
    res: http.ServerResponse<http.IncomingMessage>) => {
    
    // If the request is for the ai blog generation
    // then proxy the request to the ai blog generation function
    if (req.url === "/api/blog/ai" &&
        req.method === "POST"
    ) {

        proxyToGenerateAiBlog(req, res);
        return;
    }

    // If the request is for the event stream of blogs
    // then stream the changes made on blogs
    if (req.url === "/api/blog/event" &&
        req.method === "GET"
    ) {
        streamChangesMadeOnBlogs(req, res);
        return;
    }

    // If the request is for creating a blog
    // then call the createBlog function
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
    // If the request is not for any of the above route
    else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: "This blog route is not found" }));
    }
};

export default blogRoutes;


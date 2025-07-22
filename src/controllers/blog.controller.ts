import http from "http";
import { saveBlogToFile, getBlogFromFile } from "../utils/saveBlogToDB.utils";
import reqUrlQueries from "src/utils/reqUrlQueries";
import proxyGenerateAiBlog from "src/utils/proxyGenerateAiBlog";
import watchDB from "../utils/watchDB";


// Create new blog controller
const createBlog = (
    req: http.IncomingMessage,
    res: http.ServerResponse<http.IncomingMessage>
) => {
    let reqBody = "";

    req.on("data", (chunk) => {
        reqBody += chunk.toString();
    });

    req.on("end", () => {
        try {

            if (!reqBody) {
                throw new Error("❌ Invalid input request");
            }

            const { author, title, body } = ((value) => {
                try {
                    return JSON.parse(value);
                } catch {
                    throw new Error("❌ Invalid JSON input");
                }

            })(reqBody);

            if (!title) {
                throw new Error("❌ The title field is empty");
            } else if (!author) {
                throw new Error("❌ The author field is empty");
            }

            const blog = saveBlogToFile({ author, title, body });

            if (!blog) {
                throw new Error("❌ Failed to create blog");
            }

            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Blog created", blog }));

        } catch (err) {

            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(
                JSON.stringify({
                    error: err instanceof Error ? err.message : String(err)
                })
            );
        }
    });
};

// Read single blog or multitple blog controller
const readBlog = (
    req: http.IncomingMessage,
    res: http.ServerResponse<http.IncomingMessage>
) => {
    const url = reqUrlQueries(req);

    try {

        // Get single blog by id
        if (url.pathname.split("/")[3]) {
            const id = url.pathname.split("/")[3];
            const post = getBlogFromFile(id);

            if (!post) {
                throw new Error("❌ Blog post not found by this id: " + " " + id);
            }
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(post));
        }
        // Get blogs by author
        else if (url.searchParams.has("author")) {
            const author = url.searchParams.get("author") || "";

            const posts = getBlogFromFile(null, ["author", author]);

            if (!posts.length) {
                throw new Error("❌ Blog post not found by this author=" + " " + author);
            }

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(posts));
        }
        // Get all blogs
        else {
            const posts = getBlogFromFile();

            if (!posts.length) {
                throw new Error("❌ Blog post not found");
            }

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(posts));
        }

    } catch (err) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(
            JSON.stringify({
                error: err instanceof Error ? err.message : String(err)
            })
        );
    }

};

// Create update old blog controller
const updateBlog = () => { };

// Create delete old blog controller
const deleteBlog = () => { };

// Proxy request that help generate ai blog for users
const proxyToGenerateAiBlog = (
    req: http.IncomingMessage,
    res: http.ServerResponse<http.IncomingMessage>
) => {
    let reqBody = "";

    req.on("data", (chunk) => {
        reqBody += chunk.toString();
    });

    req.on("end", () => {
        try {

            if (!reqBody) {
                throw new Error("❌ Invalid input request");
            }

            const { topic } = ((value) => {
                try {
                    return JSON.parse(value);
                } catch {
                    throw new Error("❌ Invalid JSON input");
                }

            })(reqBody);

            if (!topic) {
                throw new Error("❌ The topic field is empty");
            }

            proxyGenerateAiBlog({ topic }, (req) => {
                const data = JSON.parse(req);
                const blog = data.choices[0].message.content;

                if (!blog) {
                    throw new Error("❌ Failed to create blog");
                }

                res.writeHead(201, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Blog created", blog }));

            });

        } catch (err) {

            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(
                JSON.stringify({
                    error: err instanceof Error ? err.message : String(err)
                })
            );
        }
    });
};

const streamChangesMadeOnBlogs = (
    req: http.IncomingMessage,
    res: http.ServerResponse<http.IncomingMessage>
) => {
    res.writeHead(200, {
        "content-type": "text/event-stream",
        "connection": "keep-alive",
        "cache-control": "no-cache"
    });

    const changes = watchDB();

    // Send a welocome message to client
    res.write("data: Hello Welcome! to event \n\n");

    changes((change, data) => {
        res.write(`data: ${JSON.stringify({ change, data })} \n\n`);
    });

    req.on("close", () => {
        console.log("Client disconnected");
    });
};

export { createBlog, readBlog, updateBlog, deleteBlog, proxyToGenerateAiBlog, streamChangesMadeOnBlogs };


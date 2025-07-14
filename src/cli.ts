// cli to create, read, update, and delete blog offline 
// using the node.js process argument vector. 
"#!/usr/bin / env node";
import proxyGenerateAiBlog from "./utils/proxyGenerateAiBlog";
import { readBlogsLocally, storeBlogsLocally } from "./utils/storeBlogsLocally";
import systemInfo from "./utils/systemInfo";

const args = process.argv.slice(2);
const [command, ...rest] = args;

// Command that tells system details
if (command === "system") {
    systemInfo();    
}
// Proxy to generate ai blog
else if (command === "generate-ai-blog") {
    const topic = rest[2];
    proxyGenerateAiBlog({ topic }, (req) => {
        const data = JSON.parse(req);
        const blog = data.choices[0].message.content;

        if (!blog) {
            throw new Error("❌ Failed to create blog");
        }
        console.log(`📝 Blog generated: ${blog}`);
    });
}
// Command to create new blog and save on local system downloads
else if (command === "create") {
    const body = rest[2];
    const title = rest[1];
    const author = rest[0];

    if (!title) {
        console.error("❌ The title field is empty");
        process.exit(1);
    } else if (!author) {
        console.error("❌ The author field is empty");
    }

    storeBlogsLocally({author, title, body});    
}
// Command to read out all blogs address
else if (command === "read") {
    readBlogsLocally();
}
// Command to update old blog
else if (command === "update") {
}
// Command to delete blog    
else if (command === "delete") {
}
// Fall back for unknow command    
else {
    console.error("❌ Unknown command. Use: yarn blog create to input \"title\" \"body\"");
    console.error("❌ Unknown command. Use: yarn blog create to read \"blog\"");
    process.exit(1);
}

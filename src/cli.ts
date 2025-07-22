// cli to create, read, update, and delete blog offline 
// using the node.js process argument vector. 
"#!/usr/bin / env node";
import extractTitleAndContent from "./utils/extractTitleAndBody";
import proxyGenerateAiBlog from "./utils/proxyGenerateAiBlog";
import { deleteBlogsLocally, readBlogsLocally, storeBlogsLocally } from "./utils/storeBlogsLocally";
import systemInfo from "./utils/systemInfo";
import readLine from "readline";

const args = process.argv.slice(2);
const [command, ...rest] = args;

// Command that tells system details
if (command === "os") {
    systemInfo();
}
// Proxy to generate ai blog
else if (command === "ai") {
    const topic = rest[0];
    const author = rest[1];

    const rl = readLine.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    if (topic && author) {
        proxyGenerateAiBlog({ topic }, (res) => {
            const data = JSON.parse(res);
            const error = data?.error;

            if (error) {
                console.log(" ❌ Failed to generate blog: ", error.message, ", with code: ", error.code);
                process.exit(1);
            }

            const blog = data.choices[0].message.content;
            if (!blog) {
                console.error("❌ Failed to generate blog. No content received.");
            }
            const { title, body } = extractTitleAndContent(data.choices[0].message.content);
            storeBlogsLocally({ slug: topic, author, title, body, rl });
        });
    } else {
        rl.question("Please enter the topic: ", (topic) => {
            rl.question("Please enter the author name: ", (author) => {
                proxyGenerateAiBlog({ topic }, (res) => {
                    const data = JSON.parse(res);
                    const error = data?.error;

                    if (error) {
                        console.log(" ❌ Failed to generate blog: ", error.message, ", with code: ", error.code);
                        process.exit(1);
                    }

                    const blog = data.choices[0].message.content;
                    if (!blog) {
                        console.error("❌ Failed to generate blog. No content received.");
                    }
                    const { title, body } = extractTitleAndContent(data.choices[0].message.content);
                    storeBlogsLocally({ slug: topic, author, title, body, rl });
                });

            });
        });
    }

    proxyGenerateAiBlog({ topic }, (res) => {
        const data = JSON.parse(res);
        const error = data?.error;

        if (error) {
            console.log(" ❌ Failed to generate blog: ", error.message, ", with code: ", error.code);
            process.exit(1);
        }


        const blog = data.choices[0].message.content;
        if (!blog) {
            console.error("❌ Failed to generate blog. No content received.");
        }
        const { title, body } = extractTitleAndContent(data.choices[0].message.content);
        storeBlogsLocally({ slug: topic, author, title, body, rl });

    });

}
// Command to  manual create new blog
else if (command === "create") {
    const author = rest[0];
    const body = rest[2];
    const title = rest[1];

    const rl = readLine.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // If the author, body, and title are provided in the command line arguments
    // then store the blog locally
    if (author && body && title) {
        storeBlogsLocally({ author, title, body, rl });
    }

    // If the author, body, and title are not provided in the command line arguments
    // then prompt the user to input them
    else {

        rl.question("Please enter the author name: ", (author) => {
            rl.question("Please enter the blog title: ", (title) => {
                rl.question("Please enter the blog body: ", (body) => {
                    storeBlogsLocally({ author, title, body, rl });
                });
            });
        });
    }
}
// Command to edit blog
else if (command === "edit") {
    const slug = rest[0];
    const author = rest[1];
    const title = rest[2];
    const body = rest[3];

    const rl = readLine.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    // If the slug, author, body, and title are provided in the command line arguments
    // then store the blog locally
    if (slug && author && body && title) {
        storeBlogsLocally({ slug, author, title, body, rl });
    }

    // If the slug, author, body, and title are not provided in the command line arguments
    // then prompt the user to input them
    else {

        rl.question("Please enter the blog slug name: ", (slug) => {
            rl.question("Please enter the author name: ", (author) => {
                rl.question("Please enter the blog title: ", (title) => {
                    rl.question("Please enter the blog body: ", (body) => {
                        storeBlogsLocally({ slug, author, title, body, rl });
                    });
                });
            });
        });
    }


}
// Command to read out all blogs address
else if (command === "list") {
    readBlogsLocally();
}
// Command to delete all blogs
else if (command === "delete") {
    deleteBlogsLocally();
}
// Command to show help message
else if (command === "-help" || command === "help") {
    console.log(`    
    Usage: blogforge <command> [options]
    Commands:
        os             Show system information
        ai <author> <topic> Generate a blog using Ai
        create <author> <title> <body> Create a new blog with your inputs
        edit <slug> <author> <title> <body> Update an existing blog
        list           list all blogs folder paths
        delete         Delete all blogs and blogforge folder
    `);
    process.exit(0);
}
// If the command is not recognized, show help message
else {
    console.log("Command unrecognized. Please use one of the following commands:");
    console.log(`    
    Usage: blogforge <command> [options]
    Commands:
        os             Show system information
        ai <author> <topic> Generate a blog using Ai
        create <author> <title> <body> Create a new blog with your inputs
        edit <slug> <author> <title> <body> Update an existing blog
        list           list all blogs folder paths
        delete         Delete all blogs and blogforge folder
        -help or help  Show this help message  
     `);
    process.exit(1);
};



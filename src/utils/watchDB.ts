import fs from "fs";
import path from "path";
import __dirname from "./_dirname";
import { blogs } from "../types/post.types";
import diffBlogs from "./diffData";

const filePath = path.join(__dirname, "../../public/data/posts/posts.json");

const streamChangesMadeOnFile = () => {
    if (!fs.existsSync(filePath)) {
        console.error("❌ File path not found: " + filePath);
        process.exit(1);
    }

    console.log("Wathcing file: " + filePath);

    let previousData: blogs = [];

    const content = fs.readFileSync(filePath, "utf8");

    try {
        previousData = JSON.parse(content);
    } catch {
        console.error("❌ Invalid JSON in posts.json");
        process.exit(1);
    }

    return (cb: (change: string, data: blogs) => void) => {
        fs.watch(filePath, (eventType, filename) => {

            if (eventType === "change") {
                console.log(`📈 [File Watcher]: Changes Detected: → ${filename}`);

                const clear = setTimeout(() => {
                    fs.readFile(filePath, "utf8", (err, data) => {

                        if (err) {
                            console.error("❌ Error reading file:", err);
                            process.exit(1);
                        };

                        try {
                            const newData: blogs = JSON.parse(data);

                            const diff = diffBlogs(previousData, newData);

                            if (diff.added.length) {
                                cb("ADDED", diff.added);
                            }
                            else if (diff.updated.length) {
                                cb("UPDATED", diff.updated);
                            }
                            else if (diff.deleted.length) {
                                cb("DELETE", diff.deleted);
                            }

                            previousData = newData;

                            console.log("Wathcing file: " + filePath);

                        } catch {
                            console.error("❌ Invalid JSON after file change");
                            process.exit(1);
                        }
                    });

                    clearTimeout(clear);
                }, 100);
            }
        });
    };
};

export default streamChangesMadeOnFile;

import path from "path";
import fs from "fs";
import readline from "readline";
import os from "os";
import { saveBlogToFileProps } from "src/types/func.types";

interface designBlogProps extends saveBlogToFileProps {
    slug: string
}

const designBlog = ({
    author,
    title,
    body,
    slug,
}: designBlogProps): string => {
    return `#Author ${author}\n\n#Title ${title}\n\n#Updated ${new Date().toISOString()}\n\n${body}\n\n#Slug ${slug}`;
};

const storeBlogsLocally = ({
    author,
    title,
    body,
}: saveBlogToFileProps) => {

    const documentsPath = path.join(os.homedir(), "/Downloads");
    const blogsFolder = path.join(documentsPath, "blogforge");

    if (!fs.existsSync(blogsFolder)) {

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question("📂 Do you want to create a 'blogs' folder in your Downloads? (y/n): ",
            (answer) => {

                if (answer.toLowerCase() === "y") {

                    fs.mkdirSync(blogsFolder);
                    console.log(`✅ Created folder at: ${blogsFolder}`);

                    const slug = title.toLowerCase().replace(/\s+/g, "-");

                    const filePath = path.join(blogsFolder, slug + ".txt");

                    const blog = designBlog({ author, slug, title, body });

                    fs.writeFileSync(filePath, blog, "utf-8");
                    console.log(`📝 Blog saved to: ${filePath}`);
                }
                else {
                    console.error("❌ Permission denied. Folder not created.");
                }

                rl.close();
            });

    } else {

        console.log("📁 'blogs' folder already exists.");

        const slug = title.toLowerCase().replace(/\s+/g, "-");

        const filePath = path.join(blogsFolder, slug + ".txt");

        const blog = designBlog({ author, slug, title, body });

        fs.writeFileSync(filePath, blog, "utf-8");
        console.log(`📝 Blog saved to: ${filePath}`);
    }

};

const readBlogsLocally = () => {
    const documentsPath = path.join(os.homedir(), "/Downloads");
    const blogsFolder = path.join(documentsPath, "blogforge");

    fs.readdir(blogsFolder, (err, files) => {
        if (err) {
            console.error("❌" + " " + err.message);
            process.exit(1);
        }

        console.log(`📝 List og blog post found in: ${blogsFolder}`);
        files.map(file => {
            console.log(file);
        });
    });
};

const updateBlogsLocally = () => { };

const deleteBlogsLocally = () => { };

export {
    storeBlogsLocally,
    readBlogsLocally
};



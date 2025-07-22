import path from "path";
import fs from "fs";
import os from "os";
import { saveBlogToFileProps } from "src/types/func.types";

interface formatBlogProps extends saveBlogToFileProps {
    slug: string
}

interface createBlogFolderProps extends saveBlogToFileProps {
    blogForgePath: string
}

interface createBlogFilesProps extends saveBlogToFileProps {
    blogsFolder: string
}

// Function to format blog content to Markdown file format
const formatBlogToMdFile = ({
    author,
    title,
    body,
    slug,
}: formatBlogProps): string => {
    return `#Author ${author}\n\n#Title ${title}\n\n#Updated ${new Date().toISOString()}\n\n${body}\n\n#Slug ${slug}`;
};

// Function to format blog in json file format
const formatBlogToJsonFile = ({
    author,
    title,
    body,
    slug,
}: formatBlogProps): string => {
    return JSON.stringify({
        author,
        title,
        body,
        slug,
        updatedAt: new Date().toISOString(),
    });
};

// Function to create and store each blog files (txt, json)
const createBlogFiles = ({
    slug,
    author,
    title,
    body,
    blogsFolder,
}: createBlogFilesProps) => {

    // Create a md file for the blog
    const mdBlog = formatBlogToMdFile({ author, slug: slug || "", title, body });
    const mdBlogFilePath = path.join(blogsFolder, "post" + ".txt");

    // Create a json file for the blog
    const jsonBlog = formatBlogToJsonFile({ author, slug: slug || "", title, body });
    const jsonBlogFilePath = path.join(blogsFolder, "meta" + ".json");

    // Write the blog content to the file
    fs.writeFileSync(mdBlogFilePath, mdBlog, "utf-8");
    fs.writeFileSync(jsonBlogFilePath, jsonBlog, "utf-8");

    console.log(`📝 Blog saved to: ${blogsFolder}`);
};

// Function to create each blog folder
const createBlogFolder = ({
    slug,
    author,
    title,
    body,
    blogForgePath,
    rl
}: createBlogFolderProps) => {

    // If slug does exist
    if (slug?.trim()) {
        // Check if slug is already formatted with dashes and without spaces
        if (!slug.includes(" ") &&  slug.includes("-")) {
           // Slug is already formatted
        } else {
            // If slug is not formatted, format it to lowercase and replace spaces with dashes
            slug = slug.toLowerCase().replace(/\s+/g, "-");
            console.log(`Formatted slug: ${slug}`);
        }
    }
    // If slug do not exist
    else {
        // Format title to slug
        slug = title.toLowerCase().replace(/\s+/g, "-");
    }

    // Create a folder for each blog
    const blogsFolder = path.join(blogForgePath, slug);

    // Check if the blogs folder exists
    if (!fs.existsSync(blogsFolder)) {
        fs.mkdirSync(blogsFolder);
        console.log(`✅ Created folder for blog at: ${blogsFolder}`);

        createBlogFiles({ slug, author, title, body, blogsFolder });

        // Close the readline interface
        if (rl) rl.close();
    }

    // If the blogForge folder exists, ask if the user wants to overwrite it
    else {

        console.log(`📁 Blog folder ${blogsFolder} already exists.`);
        rl?.question("Do you want to overwrite the existing blog? (y/n): ", (overwrite) => {
            if (overwrite.toLowerCase() === "y") {
                console.log(`✅ Overwriting existing blog folder at: ${blogsFolder}`);
            } else {
                console.log("❌ Blog folder not overwritten.");
            }

            createBlogFiles({ slug, author, title, body, blogsFolder });

            // Close the readline interface
            rl.close();

        });
    }


};

// Function to create ForgeFolder folder to store blogs
const createBlogForgeFolder = ({
    slug,
    author,
    title,
    body,
    rl
}: saveBlogToFileProps) => {

    const documentsPath = path.join(os.homedir(), "/Downloads");
    const blogForgePath = path.join(documentsPath, "blogForge");

    // Check if the blogForge folder exists
    if (!fs.existsSync(blogForgePath)) {

        console.log("📂 'blogForge' folder does not exist in your Downloads. Creating it...");

        // If the blogForge folder does not exist, ask the user if they want to create it
        rl?.question("📂 Do you want to create a 'blogForge' folder in your Downloads? (y/n): ",
            (answer) => {

                // If the user wants to create the folder, create it
                if (answer.toLowerCase() === "y") {
                    fs.mkdirSync(blogForgePath);
                    console.log(`✅ Created 'blogForge' folder at: ${blogForgePath}`);

                    createBlogFolder({ slug, author, title, body, blogForgePath, rl });
                }
                // If the user does not want to create the folder, exit the process
                else {
                    console.error("❌ Permission denied. Folder not created.");
                    process.exit(0);
                }
            });

    }
    // If the blogForge folder exists, create a new blog in it
    else {
        console.log("📁 'blogblogForge' folder already exists.");
        createBlogFolder({ slug, author, title, body, blogForgePath, rl });
    }

};

// Function to store blogs locally
// This function will create a blogForge folder in the user's Downloads folder
const storeBlogsLocally = ({
    slug,
    author,
    title,
    body,
    rl
}: saveBlogToFileProps) => {
    createBlogForgeFolder({ slug, author, title, body, rl });
};

// Function to read blogs locally
// This function will read the blogForge folder in the user's Downloads folder
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

// Function to delete blogs locally
// This function will delete the blogForge folder in the user's Downloads folder
const deleteBlogsLocally = () => {
    const documentsPath = path.join(os.homedir(), "/Downloads");
    const blogsFolder = path.join(documentsPath, "blogforge");

    fs.rm(blogsFolder, { recursive: true, force: true }, (err) => {
        if (err) {
            console.error("❌" + " " + err.message);
            process.exit(1);
        }

        console.log(`✅ Deleted 'blogForge' folder at: ${blogsFolder}`);
    });
};

export {
    storeBlogsLocally,
    readBlogsLocally,
    deleteBlogsLocally
};



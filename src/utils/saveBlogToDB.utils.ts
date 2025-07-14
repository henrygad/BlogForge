// utill that help to create a blogpost file as a .md file inside data/post folder
import fs from "fs"; // fd crud a file itself
import path from "path"; // path is like the local url that link to a folder or file
import { randomUUID } from "crypto"; // to generate random unique id
import __dirname from "./_dirname"; // to get file or folder directory
import { blog, blogs } from "src/types/post.types";
import { saveBlogToFileProps } from "src/types/func.types";


const saveBlogToFile = ({
    author,
    title,
    body,
}: saveBlogToFileProps): blog => {
    const slug = title.toLowerCase().replace(/\s+/g, "-");

    const newPost: blog = {
        id: randomUUID(),
        author,
        slug,
        title,
        body,
        date: new Date().toISOString(),
    };

    const filePath = path.join(__dirname, "../../public/data/posts/posts.json");

    let posts = [];

    if (fs.existsSync(filePath)) {
        const existingPosts = fs.readFileSync(filePath, "utf-8");
        posts = JSON.parse(existingPosts);
    }

    posts.push(newPost);

    fs.writeFileSync(filePath, JSON.stringify(posts, null, 2), "utf-8");

    return newPost;
};

function getBlogFromFile(id: string | null, query?: string[]): blog | undefined
function getBlogFromFile(id: null, query: string[]): blogs;
function getBlogFromFile(): blogs;

function getBlogFromFile(id?: string | null, query?: string[]): blogs | blog | undefined {    
    
    const filePath = path.join(__dirname, "../../public/data/posts/posts.json");

    let Blogs: blogs = [];

    if (!fs.existsSync(filePath)) {
        Blogs = [];
    } else {
        const fileData = fs.readFileSync(filePath, "utf-8");
        Blogs = JSON.parse(fileData);
    }


    // Get single blog by id
    if (id) {
        const post = Blogs.find((post) => post.id === id);
        return post;
    }

    // Get blogs by author
    else if (query?.[0]) {        
        const posts = Blogs.filter((post) => post[query[0] as keyof blog] === query[1]);
        return posts;
    }

    // Get all blogs
    else {
        return Blogs;
    }

};


export { saveBlogToFile, getBlogFromFile };

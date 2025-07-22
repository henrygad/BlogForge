import ReadLine  from "readline";

export type saveBlogToFileProps = {
    slug?: string;
    author: string;
    title: string;
    body: string;
    rl?: ReadLine.Interface
};
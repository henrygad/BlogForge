export type blog = {
    id: `${string}-${string}-${string}-${string}-${string}`;
    author: string;
    slug: string;
    title: string;
    body: string;
    date: string;
};

export type blogs = blog[]
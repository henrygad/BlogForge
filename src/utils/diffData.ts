import { blogs } from "src/types/post.types";


type changesProps = {
    added: blogs;
    updated: blogs;
    deleted: blogs;
}

const diffBlogs = (oldPosts: blogs, newPosts: blogs) => {

    const changes: changesProps = {
        added: [],
        updated: [],
        deleted: [],
    };

    const oldMap = new Map(oldPosts.map((post) => [post.id, post]));
    const newMap = new Map(newPosts.map((post) => [post.id, post]));

    for (const [id, newPost] of newMap) {

        if (!oldMap.has(id)) {
            changes.added.push(newPost);
        } else {
            const oldPost = oldMap.get(id);

            if (JSON.stringify(oldPost) !== JSON.stringify(newPost)) {
                changes.updated.push(newPost);
            }
        }
    }

    for (const [id, oldPost] of oldMap) {
        if (!newMap.has(id)) {
            changes.deleted.push(oldPost);
        }
    }

    return changes;
};

export default diffBlogs;


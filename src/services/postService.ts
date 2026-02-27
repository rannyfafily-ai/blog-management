import Backendless from "./backendless";
import type { Post } from "../types/Post";

const POSTS_TABLE = "Posts";
const postStore = Backendless.Data.of(POSTS_TABLE);

export const postService = {
  async getAll(): Promise<Post[]> {
    return await postStore.find({
      sortBy: ["publishedDate DESC"],
    });
  },

  async getById(id: string): Promise<Post> {
    return await postStore.findById(id);
  },

  async create(post: Post): Promise<Post> {
    return await postStore.save(post);
  },

  async update(id: string, post: Partial<Post>): Promise<Post> {
    return await postStore.save({
      ...post,
      objectId: id,
    });
  },

  async delete(id: string): Promise<void> {
    await postStore.remove(id);
  },
};

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { postService } from "../services/postService";
import type { Post } from "../types/Post";

const Feeds = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await postService.getAll();
      setPosts(data);
    };

    fetchPosts();
  }, []);

  const getPreview = (text: string, limit: number = 120) => {
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Blog Feeds</h1>

      {posts.map((post) => (
        <div
          key={post.objectId}
          className="border p-5 rounded mb-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold">{post.title}</h2>

          <p className="text-sm text-gray-500">
            By {post.author} •{" "}
            {new Date(post.publishedDate).toLocaleDateString("id-ID")}
          </p>

          <p className="mt-3 text-gray-700">
            {getPreview(post.content)}
          </p>

          <Link
            to={`/feeds/${post.objectId}`}
            className="text-blue-600 mt-3 inline-block hover:underline"
          >
            Read More →
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Feeds;
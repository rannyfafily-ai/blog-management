import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Post } from "../types/Post";
import { postService } from "../services/postService";

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchPost = async () => {
    console.log("PARAM ID:", id); 

    if (id) {
      try {
        const data = await postService.getById(id);
        console.log("DATA FROM BACKEND:", data); 
        setPost(data);
      } catch (error) {
        console.error("ERROR DETAIL:", error);
      }
    }

    setLoading(false);
  };

  fetchPost();
}, [id]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!post) return <p className="p-6">Post not found</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <p className="text-gray-500 mt-2">
        By {post.author}
      </p>
      <p className="text-gray-400 text-sm">
        {new Date(post.publishedDate).toLocaleDateString()}
      </p>

      <div className="mt-6">
        {post.content}
      </div>
    </div>
  );
};

export default BlogDetail;

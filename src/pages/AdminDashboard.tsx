import { useEffect, useState } from "react";
import { postService } from "../services/postService";
import type { Post } from "../types/Post";

const AdminDashboard = () => {
  const today = new Date().toISOString().split("T")[0];

  const [posts, setPosts] = useState<Post[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    content: "",
    publishedDate: today,
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ================= FETCH POSTS =================
  const fetchPosts = async () => {
    try {
      const data = await postService.getAll();
      setPosts(data);
    } catch (error) {
      console.error("FETCH ERROR:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // ================= HANDLE INPUT =================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= HANDLE SUBMIT =================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Title is required");
      return;
    }

    if (!formData.content.trim()) {
      alert("Content is required");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title: formData.title.trim(),
        author: formData.author.trim(),
        content: formData.content.trim(),
        publishedDate: new Date(formData.publishedDate),
      };

      if (editingId) {
        await postService.update(editingId, payload);
      } else {
        await postService.create(payload as Post);
      }

      resetForm();
      await fetchPosts();
    } catch (error) {
      console.error("SAVE ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  // ================= HANDLE EDIT =================
  const handleEdit = (post: Post) => {
    if (!post.objectId) return;

    setEditingId(post.objectId);

    setFormData({
      title: post.title,
      author: post.author,
      content: post.content,
      publishedDate: post.publishedDate
        ? new Date(post.publishedDate).toISOString().split("T")[0]
        : today,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ================= HANDLE DELETE =================
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      await postService.delete(id);
      await fetchPosts();
    } catch (error) {
      console.error("DELETE ERROR:", error);
    }
  };

  // ================= RESET FORM =================
  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      content: "",
      publishedDate: today,
    });
    setEditingId(null);
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Admin Dashboard
      </h1>

      {/* ================= FORM ================= */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 mb-10"
      >
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "Edit Post" : "Create New Post"}
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block mb-1 font-medium">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Author</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block mb-1 font-medium">
            Published Date
          </label>
          <input
            type="date"
            name="publishedDate"
            value={formData.publishedDate}
            onChange={handleChange}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mt-4">
          <label className="block mb-1 font-medium">Content *</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={5}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex flex-wrap gap-3 mt-6">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
          >
            {loading
              ? "Saving..."
              : editingId
              ? "Update Post"
              : "Create Post"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 text-white px-5 py-2 rounded hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* ================= POSTS LIST ================= */}
      <div>
        <h2 className="text-xl font-semibold mb-4">All Posts</h2>

        {posts.length === 0 ? (
          <p>No posts available</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <div
                key={post.objectId}
                className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                  {post.title}

                  {/* 🔥 Badge Edited */}
                  {post.created &&
                    post.updated &&
                    post.created !== post.updated && (
                      <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
                        Edited
                      </span>
                    )}
                </h3>

                <p className="text-gray-600 text-sm">
                  By {post.author || "Unknown"}
                </p>

                <p className="text-gray-400 text-xs">
                  Published:{" "}
                  {post.publishedDate &&
                    new Date(post.publishedDate).toLocaleDateString("id-ID")}
                </p>

                <p className="text-gray-400 text-xs">
                  Created:{" "}
                  {post.created &&
                    new Date(post.created).toLocaleString("id-ID")}
                </p>

                <p className="text-gray-400 text-xs mb-3">
                  Updated:{" "}
                  {post.updated &&
                    new Date(post.updated).toLocaleString("id-ID")}
                </p>

                <div className="flex justify-between mt-3">
                  <button
                    onClick={() => handleEdit(post)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(post.objectId!)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { deleteBlog, getAllBlogs } from "../api/blogApi"; // adjust path
import { Calendar, Pencil, Play, PlusIcon, Trash2 } from "lucide-react";
import CreateBlogModal from "../components/CreateBlogModal";
import { useNavigate } from "react-router";

const HomePage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateBlog, setShowCreateBlog] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);

      try {
        const data = await getAllBlogs();

        // If backend returns { blogs: [...] }
        setBlogs(data);

        // If backend returns just an array:
        // setBlogs(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        toast.error("Error fetching blogs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);
  const handleEdit = (blog) => {
  setEditingBlog(blog);
  setShowCreateBlog(true);
};
const handleDelete = async (id) => {
  try {
    await deleteBlog(id);
    toast.success("Blog deleted");

    setBlogs((prev) => prev.filter((b) => b._id !== id));
  } catch (err) {
    toast.error("Failed to delete blog");
  }
};
  if (loading) {
    return (
      <div className="flex justify-center py-10">
        Loading blogs...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold mb-6">Latest Blogs</h1>
        <button
          onClick={() => setShowCreateBlog(true)}
          className="flex items-center px-12 py-2 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-800 transition-colors duration-300"
        >
          <PlusIcon/>
        </button>
      </div>

      {blogs.length === 0 ? (
        <p>No blogs found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              onClick={() => navigate(`/blogs/${blog._id}`)}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <div className="relative h-56 overflow-hidden">
  {blog.image ? (
    <img
      src={blog.image}
      alt={blog.title}
      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
    />
  ) : blog.video ? (
    <>
      <video
        src={blog.video}
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
          <Play size={24} />
        </div>
      </div>
    </>
  ) : (
    <div className="h-full bg-linear-to-br from-indigo-500 to-purple-600" />
  )}
</div>

              <div className="p-5">
                <h2 className="font-bold text-xl line-clamp-2 text-slate-900">
                  {blog.title}
                </h2>

                <p className="mt-3 text-slate-600 line-clamp-3">
                  {blog.content}
                </p>

                <div  className="flex items-center gap-2 mt-4 text-sm text-slate-500">
                  <Calendar size={14}/>
                  {new Date(blog.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center justify-between mt-5">
  <div className="flex items-center gap-3">
    {blog.user?.profilePic ? (
      <img
        src={blog.user.profilePic}
        alt={blog.user.name}
        className="w-9 h-9 rounded-full object-cover"
      />
    ) : (
      <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold">
        {blog.user?.name?.charAt(0)}
      </div>
    )}

    <div>
      <p className="text-sm font-medium">
        {blog.user?.name}
      </p>
    </div>
  </div>

  <div
    className="flex gap-2"
    onClick={(e) => e.stopPropagation()}
  >
    <button
      onClick={() => handleEdit(blog)}
      className="p-2 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
    >
      <Pencil size={18} />
    </button>

    <button
      onClick={() => handleDelete(blog._id)}
      className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100"
    >
      <Trash2 size={18} />
    </button>
  </div>
</div>
              </div>
            </div>
          ))}
        </div>
      )}
          {/* Create Blog Modal */}
      {showCreateBlog && (
        <CreateBlogModal
          blog={editingBlog}
          onClose={() => {
            setShowCreateBlog(false)
            setEditingBlog(null);
          }}
          onBlogCreated={(newBlog) =>
            setBlogs((prev) => [newBlog, ...prev])
          }
          onBlogUpdated={(updatedBlog) =>
            setBlogs((prev) =>
              prev.map((b) =>
                b._id === updatedBlog._id ? updatedBlog : b
              )
            )
         }
      />
    )}
    </div>
  );
};

export default HomePage;
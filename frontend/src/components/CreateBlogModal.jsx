import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { addBlog, updateBlog, uploadBlogMedia } from "../api/blogApi";
import { XIcon } from "lucide-react";

const CreateBlogModal = ({ blog, onClose, onBlogCreated, onBlogUpdated }) => {
  const [title, setTitle] = useState(blog?.title || "");
  const [content, setContent] = useState(blog?.content || "");
  const [image, setImage] = useState(blog?.image || "");
  const [video, setVideo] = useState(blog?.video || "");
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [mediaType, setMediaType] = useState(null);

  const fileRef = useRef(null);

  const handleMediaUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setUploading(true);

    try {
      const res = await uploadBlogMedia(file);

      if (file.type.startsWith("image")) {
       setImage(res.url);
       setVideo("");
       setPreview(res.url);
       setMediaType("image");
      } else {
       setVideo(res.url);
       setImage("");
       setPreview(res.url);
       setMediaType("video");
     }

     toast.success("Media uploaded successfully");
    } catch (error) {
     toast.error("Failed to upload media");
    } finally {
     setUploading(false);
    }
  };
  const removeMedia = () => {
    setImage("");
    setVideo("");
    setPreview("");
    setMediaType(null);

    if (fileRef.current) {
       fileRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      return toast.error("Title and content are required");
    }

    setCreating(true);

    try {
  if (blog) {
    const res = await updateBlog(blog._id, {
      title,
      content,
      image,
      video,
    });

    toast.success("Blog updated successfully");

    onBlogUpdated?.(res.blog);
  } else {
    const res = await addBlog({
      title,
      content,
      image,
      video,
    });

    toast.success("Blog created successfully");

    onBlogCreated?.(res.blog);
  }

  onClose();
} catch (error) {
  toast.error(
    error?.response?.data?.message ||
      "Something went wrong"
  );
}finally {
      setCreating(false);
    }
  };

  return (
    <div 
       onClick={onClose}
       className="fixed inset-0 min-h-screen z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300"
    >
        <div 
           onClick={(e) => e.stopPropagation()}
           className="bg-white rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.15)] w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]"
        >
            <div className="flex flex-col px-8 py-4 border-b border-indigo-400 bg-indigo-600">
                <h3 className="text-2xl font-bold text-white">{blog ? "Edit Blog" : "Create Blog"}</h3>
                <p className="text-indigo-100 text-sm mt-1">
                   Share your thoughts with the world
                </p>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Title
                    </label>

                    <input
                        type="text"
                        value={title}
                        onChange={(e) =>
                           setTitle(e.target.value)
                        }
                        placeholder="Enter blog title"
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Content
            </label>

            <textarea
              rows={4}
              value={content}
              onChange={(e) =>
                setContent(e.target.value)
              }
              placeholder="Write your blog content..."
              className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-slate-50 resize-none focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

   <div>
  <label className="block text-sm font-semibold text-slate-700 mb-3">
    Media
  </label>

  {!preview ? (
    <button
      type="button"
      disabled={uploading}
      onClick={() => fileRef.current?.click()}
      className="w-full h-56 border-2 border-dashed border-indigo-200 rounded-2xl bg-gradient-to-br from-indigo-50 to-white hover:border-indigo-500 transition flex flex-col items-center justify-center gap-3"
    >
      {uploading ? (
        <>
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          <p className="text-indigo-600 font-medium">
            Uploading...
          </p>
        </>
      ) : (
        <>
          <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center">
            📸
          </div>

          <div>
            <p className="font-semibold text-slate-800">
              Upload image or video
            </p>

            <p className="text-sm text-slate-500">
              JPG, PNG, MP4 supported
            </p>
          </div>
        </>
      )}
    </button>
  ) : (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200">
      <button
        onClick={removeMedia}
        className="absolute top-3 flex justify-center items-center right-3 z-10 w-9 h-9 rounded-full bg-black/60 text-white hover:bg-red-500 transition"
      >
        <XIcon className="size-6"/>
      </button>

      {mediaType === "image" ? (
        <img
          src={preview}
          alt="Preview"
          className="w-full h-64 object-cover"
        />
      ) : (
        <video
          src={preview}
          controls
          className="w-full h-64 object-cover bg-black"
        />
      )}
    </div>
  )}

  <input
    ref={fileRef}
    type="file"
    accept="image/*,video/*"
    className="hidden"
    onChange={handleMediaUpload}
  />
</div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t bg-slate-50">
              <button
                onClick={onClose}
                disabled={creating}
                className="px-5 py-2.5 rounded-xl border border-slate-300 font-medium hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
    onClick={handleSubmit}
    disabled={
      creating ||
      !title.trim() ||
      !content.trim()
    }
    className="min-w-[140px] px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition"
  >
    {creating ? "Saving..." : blog ? "Update" : "Create Blog"}
  </button>
            </div>
        </div>
    </div>
  );
};

export default CreateBlogModal;
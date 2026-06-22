import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { getBlogById } from '../api/blogApi';

const BlogDetails = () => {
     const { id } = useParams();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await getBlogById(id);
        setBlog(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) return <div>Loading...</div>;

  if (!blog) return <div>Blog not found</div>;
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="flex items-center gap-4 mb-8">
  <img
    src={blog.user.profilePic}
    className="w-14 h-14 rounded-full object-cover"
  />

  <div>
    <h4 className="font-semibold">
      {blog.user.name}
    </h4>

    <p className="text-slate-500">
      {new Date(
        blog.createdAt
      ).toLocaleDateString()}
    </p>
  </div>
</div>
{blog.image && (
  <img
    src={blog.image}
    className="w-full rounded-3xl mb-8"
  />
)}

{blog.video && (
  <video
    controls
    src={blog.video}
    className="w-full rounded-3xl mb-8"
  />
)}
<h1 className="text-5xl font-bold mb-6">
  {blog.title}
</h1>

<div className="prose prose-lg max-w-none">
  {blog.content}
</div>
    </div>
  )
}

export default BlogDetails
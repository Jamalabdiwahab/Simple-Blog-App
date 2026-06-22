import { api } from "./axios"


export const getAllBlogs = async () => {
    
    const res = await api.get("/blogs/");
    return res.data;
}

export const addBlog = async (data) => {
  const res = await api.post("/blogs/add", data);
  return res.data;
};
export const updateBlog = async (id, data) => {
  const res = await api.put(`/blogs/${id}`, data);
  return res.data;
};
export const getBlogById = async (id) => {
  const res = await api.get(`/blogs/${id}`);
  return res.data;
};
export const deleteBlog = async (id) => {
  const res = await api.delete(`/blogs/${id}`);
  return res.data;
};
export const uploadBlogMedia = async (file) => {
  const formData = new FormData();

  formData.append("media", file);

  const res = await api.post(
    "/blogs/upload-media",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};
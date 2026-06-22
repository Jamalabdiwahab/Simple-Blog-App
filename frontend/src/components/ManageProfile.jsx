import { useState, useRef } from "react";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import { updatePassword, updateProfile, updateProfilePic } from "../api/authApi";


const ManageProfile = ({ onClose }) => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("profile");
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [preview, setPreview] = useState(user?.profilePicture || null);
  const fileRef = useRef(null);
  const setAuth = useAuthStore((state) => state.setAuth);

  const initials =
    (user?.name || "U")
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);


const handleAvatarChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (ev) => setPreview(ev.target.result);
  reader.readAsDataURL(file);

  try {
    const res = await updateProfilePic(file);

    setAuth({
      user: res.user,
      accessToken: useAuthStore.getState().accessToken,
    });

    toast.success("Profile picture updated");
  } catch (err) {
    toast.error("Upload failed");
  }
};

  const handleSaveProfile = async () => {
  if (!name.trim() || !email.trim()) {
    toast.error("Please fill in all fields");
    return;
  }

  try {
    const res = await updateProfile({ name, email });

    setAuth({
      user: res.user,
      accessToken: useAuthStore.getState().accessToken,
    });

    toast.success("Profile updated successfully");
  } catch (err) {
    toast.error(err?.response?.data?.message || "Update failed");
  }
};

 const handleSavePassword = async () => {
  if (!currentPw || !newPw) {
    toast.error("Please fill in both fields");
    return;
  }

  try {
    await updatePassword({
      currentPassword: currentPw,
      newPassword: newPw,
    });

    setCurrentPw("");
    setNewPw("");

    toast.success("Password updated successfully");
  } catch (err) {
    toast.error(err?.response?.data?.message || "Update failed");
  }
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="w-[380px] rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm"  onClick={(e) => e.stopPropagation()}>
        {/* Indigo header with avatar */}
        <div className="relative h-[110px] bg-indigo-600 flex justify-center">
          <div
            className="absolute -bottom-11 cursor-pointer group"
            onClick={() => fileRef.current?.click()}
          >
            {preview ? (
              <img
                src={preview}
                alt={user?.name}
                className="w-[88px] h-[88px] rounded-full border-4 border-white object-cover"
              />
            ) : (
              <div className="w-[88px] h-[88px] rounded-full border-4 border-white bg-indigo-600 flex items-center justify-center text-white text-2xl font-medium">
                { user?.profilePic ? (

                  <img
                    src={user.profilePic}
                    alt={user?.name}
                    className="w-[88px] h-[88px] rounded-full border-4 border-white object-cover"
                  />
                ):(
                  <span className="text-white text-2xl font-medium">
                    {initials}
                  </span>
                )
                }
              </div>
            )}
            <div className="absolute inset-[4px] rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>

        {/* Body */}
        <div className="pt-14 pb-6 px-6 text-center">
          <p className="text-lg font-medium text-slate-800">{user?.name}</p>
          <p className="text-sm text-slate-500 mb-5">{user?.email}</p>

          {/* Tabs */}
          <div className="flex border-b border-gray-100 mb-5">
            {["profile", "password"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 pb-2.5 pt-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? "text-indigo-600 border-indigo-600"
                    : "text-slate-400 border-transparent hover:text-slate-600"
                }`}
              >
                {tab === "profile" ? "Edit profile" : "Change password"}
              </button>
            ))}
          </div>

          {/* Edit profile form */}
          {activeTab === "profile" && (
            <div className="text-left space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Full name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div className="flex justify-end pt-1">
                <button
                  onClick={handleSaveProfile}
                  className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-medium px-5 py-2 rounded-lg transition"
                >
                  Save changes
                </button>
              </div>
            </div>
          )}

          {/* Change password form */}
          {activeTab === "password" && (
            <div className="text-left space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Current password</label>
                <input
                  type="password"
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">New password</label>
                <input
                  type="password"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div className="flex justify-end pt-1">
                <button
                  onClick={handleSavePassword}
                  className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-medium px-5 py-2 rounded-lg transition"
                >
                  Save password
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageProfile;

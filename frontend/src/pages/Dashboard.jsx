import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { logoutUser } from "../api/authApi";
import { useLogout } from "../hooks/useAuth";
import { Link } from "react-router";
import ManageProfile from "./ManageProfile";

const Dashboard = () => {
  const { user } = useAuthStore();
  console.log(user.profilePic);
  const { mutate: logoutUser } = useLogout();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [showProfile, setShowProfile] = useState(false);

  const initial = user?.name?.charAt(0)?.toUpperCase() || "U";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const handleLogout = () => {
    logoutUser();
  };

  return (
    <div className="p-4 md:p-8">
      <header className="bg-white shadow-sm border border-gray-100 rounded-2xl px-4 py-3 md:px-6 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to={'/dashboard'} className="flex items-center gap-3">
            <img
              src="/logo.svg"
              alt="Planora"
              className="h-10 w-10"
            />

            <h1 className="text-xl md:text-3xl font-bold text-slate-800">
              Planora
            </h1>
          </Link>

          {/* User Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-3 rounded-full hover:bg-gray-100 px-2 py-1 transition"
            >
              <span className="hidden sm:block text-sm font-medium text-slate-700">
                Hi, {user?.name?.split(" ")[0]}
              </span>

              {user?.profilePic ? (
                <img
                  src={user.profilePic}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500"
                />
              ) : (
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white font-semibold">
                  {initial}
                </div>
              )}
            </button>

            {/* Dropdown */}
            {isOpen && (
              <div className="absolute right-0 top-14 w-52 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                <div className="px-4 py-3 border-b">
                  <p className="font-medium text-slate-800">
                    {user?.name}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>

                <button
                    onClick={() => {
                       setShowProfile(true);
                        setIsOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition" 
                >
                    Manage Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Page Content */}
      <div className="mt-8">
        Dashboard Content
      </div>
       {showProfile && (
         <ManageProfile onClose={() => setShowProfile(false)} />
       )}
    </div>
  );
};

export default Dashboard;
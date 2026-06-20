import { useState } from "react";
import QuoteCard from "../components/QuoteCard";
import { User, Mail, Lock } from "lucide-react";
import { useRegister } from "../hooks/useAuth";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);

    const registerMutation = useRegister();

    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    };
    const handleSubmit = (e) => {
       e.preventDefault();
       registerMutation.mutate(formData);
    };

  return (
    <section className="bg-slate-100 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden flex w-full max-w-5xl">

        {/* Image */}
        <QuoteCard/>

        {/* Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h2 className="text-4xl font-bold text-slate-800">
            Create Account
          </h2>

          <p className="text-slate-500 mt-3">
            Join us and start your journey today.
          </p>
          {registerMutation.isError && (
  <div className="rounded-xl border border-red-200 bg-red-50 mt-3 text-center p-3 text-sm text-red-600">
    {registerMutation.error?.response?.data?.message ||
      "Something went wrong"}
  </div>
)}
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="relative">
               <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
               <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="full Name"
                  className="w-full px-10 p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>
            <div className="relative">
               <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
               <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="w-full px-10 p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-10 p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
            >
               {registerMutation.isPending
                ? "Creating..."
                : "Create Account"}
            </button>
          </form>
{/* 
          <div className="flex items-center gap-4 my-6">
            <div className="h-px bg-slate-300 flex-1"></div>
            <span className="text-slate-400 text-sm">OR</span>
            <div className="h-px bg-slate-300 flex-1"></div>
          </div>

          <button
            className="w-full border border-slate-300 py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-50 transition"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Sign up with Google
          </button> */}

          <p className="mt-4 text-center text-sm text-slate-500 ">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-semibold text-indigo-600 hover:underline"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Register;
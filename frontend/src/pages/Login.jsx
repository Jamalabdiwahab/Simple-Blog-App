import { useState } from "react";
import QuoteCard from "../components/QuoteCard";
import { Mail, Lock } from "lucide-react";
import { useLogin } from "../hooks/useAuth";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
   });

   const loginMutation = useLogin();

   const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    };

   const handleSubmit = (e) => {
       e.preventDefault();

       loginMutation.mutate(formData);
    };


  return (
    <section className="bg-slate-100 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden flex w-full max-w-5xl">
        {/* Image Section */}
        <QuoteCard/>
        
        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h2 className="text-4xl font-bold text-slate-800">Welcome Back</h2>
          <p className="text-slate-500 mt-3">
            Sign in to access your account.
          </p>

{loginMutation.isError && (
  <div className="rounded-xl border border-red-200 bg-red-50 p-3 mt-3 text-center text-sm text-red-600">
    {loginMutation.error?.response?.data?.message ||
      "Something went wrong"}
  </div>
)}
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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
                className="w-full p-3 px-10 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              disabled={loginMutation.isPending}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
            >
              {loginMutation.isPending
               ? "Signing In..."
               : "Login"}
            </button>
          </form>

          {/* <div className="flex items-center gap-4 my-6">
            <div className="h-px bg-slate-300 flex-1"></div>
            <span className="text-slate-400 text-sm">OR</span>
            <div className="h-px bg-slate-300 flex-1"></div>
          </div> */}

          {/* <button
            className="w-full border border-slate-300 py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-slate-50 transition"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button> */}

           <div className="flex items-end justify-end">
            <button className="text-indigo-600 hover:underline">
              Forgot Password?
            </button>
           </div>
          <div className="flex justify-center items-center mt-4 text-sm">
            <p className="text-slate-500">
              Don't have an account?{" "}
              <a
                href="/register"
                className="font-semibold text-indigo-600 hover:underline"
              >
                Register
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
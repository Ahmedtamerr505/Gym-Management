import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { decodeJwt } from "../utils/decodeToken";
import { Eye, EyeOff, Mail, Lock, Dumbbell } from "lucide-react";
import axiosInstance from "../api/axiosInstance";

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await axiosInstance.post("/api/Auth/login", {
        username: formData.username,
        password: formData.password,
      });

      // console.log("LOGIN RESPONSE:", response.data);

      const token = response.data.token;

      const decoded = decodeJwt(token);

      const user = {
        username: response.data.username,
        role:
          decoded[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ] || "Member",
        expiresAt: response.data.expiresAt,
      };

      login({
        token,
        user,
      });

      // Redirect to dashboard
      navigate("/dashboard/admin");
    } catch (err) {
      console.error("Login Error:", err);

      setError(err.message || "Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 lg:p-8">
      <div className="w-full max-w-7xl overflow-hidden rounded-[32px] border border-white/10 bg-[#020817] shadow-2xl">
        <div className="grid min-h-[750px] lg:grid-cols-2">
          {/* LEFT SIDE */}
          <div className="relative hidden lg:flex">
            {/* Background Image */}
            <img
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1974&auto=format&fit=crop"
              alt="Gym"
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />

            {/* Content */}
            <div className="relative z-10 flex h-full flex-col justify-between p-12">
              {/* Logo */}
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-500/30">
                    <Dumbbell size={28} />
                  </div>

                  <div>
                    <h1 className="text-5xl text-white font-bold tracking-tight">
                      Gym Master
                    </h1>

                    <p className="mt-2 text-lg text-blue-200">
                      Precision Management Suite
                    </p>
                  </div>
                </div>
              </div>

              {/* Quote Card */}
              <div className="max-w-md rounded-3xl border border-white/10 bg-black/40 p-8 backdrop-blur-xl">
                <p className="text-lg leading-relaxed text-slate-200 italic">
                  “Transform your gym management experience with a modern system
                  built for performance, growth, and simplicity.”
                </p>

                <div className="mt-8 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600">
                    <Dumbbell size={20} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-white">
                      Gym Master System
                    </h3>

                    <p className="text-sm text-slate-400">
                      Built for modern fitness clubs
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center justify-center p-6 sm:p-10 lg:p-16">
            <div className="w-full max-w-md">
              {/* Mobile Logo */}
              <div className="mb-10 flex items-center gap-3 lg:hidden">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600">
                  <Dumbbell size={24} />
                </div>

                <div>
                  <h1 className="text-2xl text-white font-bold">Gym Master</h1>

                  <p className="text-sm text-slate-400">Management Suite</p>
                </div>
              </div>

              {/* Header */}
              <div>
                <h2 className="text-4xl font-bold tracking-tight text-white">
                  Welcome Back
                </h2>

                <p className="mt-3 text-slate-400">
                  Enter your credentials to access the management dashboard.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleLogin} className="mt-10 space-y-6">
                {/* Username */}
                <div>
                  <label className="mb-3 block text-sm font-semibold uppercase tracking-wide text-slate-300">
                    Username
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Enter your username"
                      required
                      className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-12 pr-4 text-white placeholder:text-slate-500 outline-none transition-all duration-200 focus:border-blue-500/50 focus:bg-white/[0.06]"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <label className="text-sm font-semibold uppercase tracking-wide text-slate-300">
                      Password
                    </label>
                  </div>

                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                      className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-12 pr-14 text-white placeholder:text-slate-500 outline-none transition-all duration-200 focus:border-blue-500/50 focus:bg-white/[0.06]"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {error}
                  </div>
                )}

                <br/>

                {/* Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-14 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-lg font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-200 hover:scale-[1.01] hover:from-blue-600 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  ) : (
                    "SIGN IN"
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="mt-10 text-center">
                <p className="text-sm text-slate-500">
                  Gym Management System © 2026
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

import {
  Landmark,
  ShieldCheck,
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  ArrowRight,
  Sparkles,
  Wallet,
  CircleCheck,
} from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const data = await loginUser(email.trim(), password);

      console.log("Login successful:", {
        userId: data.userId,
        email: data.email,
        role: data.role,
      });

      setMessage("Login successful! Welcome to SmartBank.");

      setTimeout(() => {
        if (data.role === "ADMIN") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }, 500);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fbf9] via-[#eff6f1] to-[#e5f0e9]">
      {/* Header */}
      <header className="flex items-center justify-between px-6 md:px-14 py-6">
        <div className="flex items-center gap-3">
          <div className="bg-[#12372a] text-white p-2.5 rounded-xl">
            <Landmark size={25} />
          </div>

          <span className="text-2xl font-bold tracking-tight text-[#12372a]">
            Smart<span className="text-emerald-600">Bank</span>
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-sm text-[#426456]">
          <ShieldCheck size={18} className="text-emerald-600" />
          Secure Digital Banking
        </div>
      </header>

      {/* Main Section */}
      <main className="max-w-7xl mx-auto px-6 md:px-14 py-8 md:py-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Section */}
          <section className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-white/80 border border-emerald-100 px-4 py-2 rounded-full text-sm text-emerald-800 shadow-sm">
              <Sparkles size={16} />
              Banking made smarter for you
            </div>

            <div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight text-[#12372a]">
                Your money.
                <br />
                Your future.
                <br />
                <span className="text-emerald-600">Your control.</span>
              </h1>

              <p className="mt-6 text-base md:text-lg leading-8 text-slate-600 max-w-lg">
                Experience a simpler way to manage your money. Access your
                accounts, transfer funds and stay in control with SmartBank.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white/80 border border-white rounded-2xl p-5 shadow-sm">
                <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-700">
                  <ShieldCheck size={23} />
                </div>

                <h3 className="font-semibold text-[#12372a] mt-4">
                  Secure Banking
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Your account security matters to us.
                </p>
              </div>

              <div className="bg-white/80 border border-white rounded-2xl p-5 shadow-sm">
                <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-700">
                  <Wallet size={23} />
                </div>

                <h3 className="font-semibold text-[#12372a] mt-4">
                  Easy Transactions
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Manage your money with ease.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm text-slate-500">
              <CircleCheck size={19} className="text-emerald-600" />
              Simple. Secure. Smart.
            </div>
          </section>

          {/* Right Login Card */}
          <section className="w-full max-w-md mx-auto lg:ml-auto">
            <div className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(18,55,42,0.10)] border border-white p-7 sm:p-10">
              <div className="mb-8">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-700 mb-5">
                  <Landmark size={27} />
                </div>

                <h2 className="text-3xl font-bold text-[#12372a]">
                  Welcome back!
                </h2>

                <p className="text-slate-500 mt-2">
                  Sign in to continue to your account.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/70 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-slate-200 bg-slate-50/70 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 focus:bg-white"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-700"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                    </button>
                  </div>
                </div>

                {/* Remember / Forgot */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      className="accent-emerald-600 w-4 h-4"
                    />
                    Remember me
                  </label>

                  <button
                    type="button"
                    className="font-semibold text-emerald-700 hover:text-emerald-900"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Success Message */}
                {message && (
                  <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 p-3 rounded-lg">
                    {message}
                  </p>
                )}

                {/* Error Message */}
                {error && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-100 p-3 rounded-lg">
                    {error}
                  </p>
                )}

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 bg-[#12372a] hover:bg-emerald-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl shadow-lg shadow-emerald-900/10 transition duration-300 hover:-translate-y-0.5"
                >
                  {loading ? "Signing In..." : "Sign In"}
                  {!loading && <ArrowRight size={19} />}
                </button>
              </form>

              <div className="relative my-7">
                <div className="border-t border-slate-100"></div>
                <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-white px-3 text-xs text-slate-400">
                  WELCOME TO SMARTBANK
                </span>
              </div>

              <p className="text-center text-sm text-slate-500">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-bold text-emerald-700 hover:text-emerald-900"
                >
                  Create account
                </Link>
              </p>
            </div>

            <p className="text-center text-xs text-slate-400 mt-6">
              © 2026 SmartBank. All rights reserved.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Login;

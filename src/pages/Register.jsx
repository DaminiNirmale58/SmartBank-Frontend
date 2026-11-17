import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Landmark,
  User,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

function Register() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "https://smartbank-backend-a26c.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Registration failed");
      }

      setMessage("Account created successfully! Please sign in.");

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fbf9] via-[#eff6f1] to-[#e5f0e9]">
      {/* Header */}
      <header className="flex items-center justify-between px-6 md:px-14 py-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="bg-[#12372a] text-white p-2.5 rounded-xl">
            <Landmark size={25} />
          </div>

          <span className="text-2xl font-bold text-[#12372a]">
            Smart<span className="text-emerald-600">Bank</span>
          </span>
        </Link>

        <div className="hidden sm:flex items-center gap-2 text-sm text-[#426456]">
          <ShieldCheck size={18} className="text-emerald-600" />
          Secure Digital Banking
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-14 py-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Section */}
          <section className="space-y-7">
            <div className="inline-flex items-center gap-2 bg-white/80 border border-emerald-100 px-4 py-2 rounded-full text-sm text-emerald-800 shadow-sm">
              <Sparkles size={16} />
              Start your smarter banking journey
            </div>

            <div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight text-[#12372a]">
                Banking
                <br />
                begins with
                <br />
                <span className="text-emerald-600">trust.</span>
              </h1>

              <p className="mt-6 text-base md:text-lg leading-8 text-slate-600 max-w-lg">
                Create your SmartBank account and experience secure, simple and
                smarter digital banking.
              </p>
            </div>

            <div className="bg-white/80 border border-white rounded-2xl p-5 shadow-sm max-w-sm">
              <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-700">
                <ShieldCheck size={23} />
              </div>
              <h3 className="font-semibold text-[#12372a] mt-4">
                Your security comes first
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Your banking journey starts with a secure account.
              </p>
            </div>
          </section>

          {/* Register Card */}
          <section className="w-full max-w-md mx-auto lg:ml-auto">
            <div className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(18,55,42,0.10)] border border-white p-7 sm:p-9">
              <div className="mb-7">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-700 mb-5">
                  <Landmark size={27} />
                </div>

                <h2 className="text-3xl font-bold text-[#12372a]">
                  Create account
                </h2>

                <p className="text-slate-500 mt-2">
                  Join SmartBank and take control of your money.
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Full Name
                  </label>

                  <div className="relative">
                    <User
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      name="fullName"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      autoComplete="name"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/70 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 focus:bg-white"
                    />
                  </div>
                </div>

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
                      name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      autoComplete="email"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/70 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 focus:bg-white"
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
                      name="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      className="w-full pl-12 pr-12 py-3 rounded-xl border border-slate-200 bg-slate-50/70 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 focus:bg-white"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Confirm Password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      className="w-full pl-12 pr-12 py-3 rounded-xl border border-slate-200 bg-slate-50/70 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 focus:bg-white"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={19} />
                      ) : (
                        <Eye size={19} />
                      )}
                    </button>
                  </div>
                </div>

                {message && (
                  <p className="text-sm text-emerald-700 bg-emerald-50 p-3 rounded-lg">
                    {message}
                  </p>
                )}

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 bg-[#12372a] hover:bg-emerald-800 disabled:opacity-60 text-white font-semibold py-4 rounded-xl shadow-lg transition duration-300"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                  {!loading && <ArrowRight size={19} />}
                </button>
              </form>

              <div className="relative my-6">
                <div className="border-t border-slate-100"></div>
                <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-white px-3 text-xs text-slate-400">
                  WELCOME TO SMARTBANK
                </span>
              </div>

              <p className="text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link
                  to="/"
                  className="font-bold text-emerald-700 hover:text-emerald-900"
                >
                  Sign In
                </Link>
              </p>
            </div>

            <p className="text-center text-xs text-slate-400 mt-5">
              © 2026 SmartBank. All rights reserved.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Register;

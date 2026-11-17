import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  UserRound,
  Mail,
  ShieldCheck,
  Fingerprint,
  ArrowLeft,
  RefreshCw,
  CalendarDays,
  CheckCircle2,
  Landmark,
} from "lucide-react";

import { getMyProfile } from "../services/userService";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProfile = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getMyProfile();
      setProfile(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const initials = profile?.fullName
    ? profile.fullName
        .split(" ")
        .filter(Boolean)
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <div className="min-h-screen bg-[#f3f8f5] px-5 py-8 sm:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-700 mb-4"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </Link>

          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#12372a]">My Profile</h1>

              <p className="text-slate-500 mt-2">
                View your personal and account information.
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-2 bg-white border border-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm">
              <ShieldCheck size={17} />
              Secure Profile
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <RefreshCw
              size={30}
              className="animate-spin mx-auto text-emerald-600"
            />
            <p className="text-slate-500 mt-4">Loading your profile...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl p-6">
            <p>{error}</p>

            <button
              onClick={loadProfile}
              className="mt-4 inline-flex items-center gap-2 font-semibold"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        )}

        {/* Profile Content */}
        {!loading && !error && profile && (
          <>
            {/* Profile Banner */}
            <section className="bg-gradient-to-r from-[#12372a] to-emerald-700 rounded-3xl p-7 sm:p-10 text-white shadow-lg">
              <div className="flex flex-col sm:flex-row items-center sm:items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-white text-emerald-700 flex items-center justify-center text-3xl font-bold shadow-md">
                  {initials}
                </div>

                <div className="text-center sm:text-left">
                  <p className="text-emerald-100 text-sm">
                    Welcome to SmartBank
                  </p>

                  <h2 className="text-3xl font-bold mt-1">
                    {profile.fullName}
                  </h2>

                  <p className="text-emerald-100 mt-2">{profile.email}</p>

                  <span className="inline-flex items-center gap-2 mt-4 bg-white/15 px-4 py-2 rounded-full text-sm">
                    <CheckCircle2 size={16} />
                    {profile.role}
                  </span>
                </div>
              </div>
            </section>

            {/* Personal Information */}
            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 mt-7">
              <div className="flex items-center gap-3 mb-7">
                <div className="w-11 h-11 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center">
                  <UserRound size={22} />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#12372a]">
                    Personal Information
                  </h3>

                  <p className="text-sm text-slate-500">
                    Your registered information
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="flex items-start gap-3">
                  <UserRound className="text-emerald-600 mt-1" size={20} />

                  <div>
                    <p className="text-sm text-slate-400">Full Name</p>
                    <p className="font-semibold text-slate-800 mt-1">
                      {profile.fullName}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <Mail className="text-emerald-600 mt-1" size={20} />

                  <div>
                    <p className="text-sm text-slate-400">Email Address</p>
                    <p className="font-semibold text-slate-800 mt-1 break-all">
                      {profile.email}
                    </p>
                  </div>
                </div>

                {/* User ID */}
                <div className="flex items-start gap-3">
                  <Fingerprint className="text-emerald-600 mt-1" size={20} />

                  <div>
                    <p className="text-sm text-slate-400">Customer ID</p>
                    <p className="font-semibold text-slate-800 mt-1">
                      SB-{profile.id}
                    </p>
                  </div>
                </div>

                {/* Role */}
                <div className="flex items-start gap-3">
                  <ShieldCheck className="text-emerald-600 mt-1" size={20} />

                  <div>
                    <p className="text-sm text-slate-400">Account Role</p>
                    <p className="font-semibold text-slate-800 mt-1">
                      {profile.role}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Security Information */}
            <section className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6 mt-7">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center">
                  <Landmark size={22} />
                </div>

                <div>
                  <h3 className="font-bold text-[#12372a]">
                    Banking with Confidence
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    Your profile information is fetched securely using JWT
                    authentication.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-emerald-700 mt-5">
                <CheckCircle2 size={17} />
                Your account is connected securely.
              </div>
            </section>
          </>
        )}

        <p className="text-center text-xs text-slate-400 mt-8">
          © 2026 SmartBank. Banking made simple and secure.
        </p>
      </div>
    </div>
  );
}

export default Profile;

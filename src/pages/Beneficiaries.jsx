import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  UserPlus,
  ArrowLeft,
  Pencil,
  Trash2,
  X,
  Check,
  RefreshCw,
  ShieldCheck,
  Landmark,
} from "lucide-react";

import {
  addBeneficiary,
  getBeneficiaries,
  updateBeneficiary,
  deleteBeneficiary,
} from "../services/beneficiaryService";

function Beneficiaries() {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [accountNumber, setAccountNumber] = useState("");
  const [nickname, setNickname] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editNickname, setEditNickname] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadBeneficiaries = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getBeneficiaries();
      setBeneficiaries(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBeneficiaries();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);

    try {
      await addBeneficiary(accountNumber.trim(), nickname.trim());

      setMessage("Beneficiary added successfully!");
      setAccountNumber("");
      setNickname("");

      await loadBeneficiaries();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const startEditing = (beneficiary) => {
    setEditingId(beneficiary.id);
    setEditNickname(beneficiary.nickname);
    setError("");
    setMessage("");
  };

  const handleUpdate = async (id) => {
    if (!editNickname.trim()) {
      setError("Nickname cannot be empty.");
      return;
    }

    setError("");
    setMessage("");

    try {
      await updateBeneficiary(id, editNickname.trim());

      setMessage("Beneficiary updated successfully!");
      setEditingId(null);
      setEditNickname("");

      await loadBeneficiaries();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this beneficiary?",
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      await deleteBeneficiary(id);

      setMessage("Beneficiary deleted successfully!");
      await loadBeneficiaries();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f8f5] px-5 py-8 sm:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-700 mb-4"
            >
              <ArrowLeft size={17} />
              Back to Dashboard
            </Link>

            <h1 className="text-3xl font-bold text-[#12372a]">Beneficiaries</h1>

            <p className="text-slate-500 mt-2">
              Manage your saved bank beneficiaries.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-white border border-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm">
            <ShieldCheck size={17} />
            Secure Banking
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-5 bg-red-50 border border-red-100 text-red-600 rounded-xl p-4 text-sm">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl p-4 text-sm">
            {message}
          </div>
        )}

        {/* Add Beneficiary */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center">
              <UserPlus size={23} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#12372a]">
                Add New Beneficiary
              </h2>
              <p className="text-sm text-slate-500">
                Save another SmartBank account for future transfers.
              </p>
            </div>
          </div>

          <form onSubmit={handleAdd} className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Account Number
              </label>

              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Enter 12-digit account number"
                required
                maxLength={12}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Nickname
              </label>

              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="e.g. Rahul, Brother"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 bg-[#12372a] hover:bg-emerald-800 disabled:opacity-60 text-white font-semibold px-7 py-3 rounded-xl transition"
              >
                <UserPlus size={18} />
                {submitting ? "Adding..." : "Add Beneficiary"}
              </button>
            </div>
          </form>
        </section>

        {/* Beneficiary List */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-[#12372a]">
                Saved Beneficiaries
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                {beneficiaries.length} beneficiary(ies) found
              </p>
            </div>

            <button
              onClick={loadBeneficiaries}
              disabled={loading}
              className="flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-900"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-12 text-slate-500">
                Loading beneficiaries...
              </div>
            ) : beneficiaries.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                  <Users size={30} />
                </div>

                <h3 className="font-semibold text-[#12372a]">
                  No beneficiaries found
                </h3>

                <p className="text-sm text-slate-500 mt-2">
                  Add your first beneficiary using the form above.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {beneficiaries.map((beneficiary) => (
                  <div
                    key={beneficiary.id}
                    className="border border-slate-200 rounded-2xl p-5 hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center">
                          <Landmark size={23} />
                        </div>

                        <div>
                          {editingId === beneficiary.id ? (
                            <input
                              type="text"
                              value={editNickname}
                              onChange={(e) => setEditNickname(e.target.value)}
                              className="w-full border border-emerald-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-100"
                            />
                          ) : (
                            <h3 className="font-bold text-[#12372a]">
                              {beneficiary.nickname}
                            </h3>
                          )}

                          <p className="text-xs text-slate-500 mt-1">
                            {beneficiary.beneficiaryName}
                          </p>
                        </div>
                      </div>

                      <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">
                        {beneficiary.accountType}
                      </span>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100">
                      <p className="text-xs text-slate-400">Account Number</p>

                      <p className="font-semibold text-slate-700 mt-1">
                        {beneficiary.accountNumber}
                      </p>
                    </div>

                    <div className="flex items-center justify-end gap-2 mt-5">
                      {editingId === beneficiary.id ? (
                        <>
                          <button
                            onClick={() => handleUpdate(beneficiary.id)}
                            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm"
                          >
                            <Check size={16} />
                            Save
                          </button>

                          <button
                            onClick={() => setEditingId(null)}
                            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-100 text-slate-600 text-sm"
                          >
                            <X size={16} />
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditing(beneficiary)}
                            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 text-sm hover:bg-emerald-100"
                          >
                            <Pencil size={15} />
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(beneficiary.id)}
                            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-red-50 text-red-600 text-sm hover:bg-red-100"
                          >
                            <Trash2 size={15} />
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <p className="text-center text-xs text-slate-400 mt-8">
          © 2026 SmartBank. Banking made simple and secure.
        </p>
      </div>
    </div>
  );
}

export default Beneficiaries;

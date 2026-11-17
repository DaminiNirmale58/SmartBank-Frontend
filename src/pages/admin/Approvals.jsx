import { useEffect, useState } from "react";
import {
  ClipboardCheck,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

import {
  getPendingAccounts,
  approveAccount,
} from "../../services/adminService";

function Approvals() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchPendingAccounts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getPendingAccounts();
      setAccounts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load pending accounts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingAccounts();
  }, []);

  const handleApprove = async (account) => {
    const confirmed = window.confirm(
      `Are you sure you want to approve account ${account.accountNumber}?`,
    );

    if (!confirmed) return;

    try {
      setApprovingId(account.id);
      setError("");
      setMessage("");

      await approveAccount(account.id);

      setMessage(`Account ${account.accountNumber} approved successfully!`);

      await fetchPendingAccounts();
    } catch (err) {
      setError(err.message || "Unable to approve account.");
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Account Approvals
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Review and approve new bank account requests.
          </p>
        </div>

        <button
          onClick={fetchPendingAccounts}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#12372a] text-white hover:bg-[#1b4d3b] disabled:opacity-60 transition"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Pending Count */}
      <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-5 flex items-center gap-4">
        <div className="p-3 rounded-xl bg-orange-100 text-orange-600">
          <Clock size={26} />
        </div>

        <div>
          <p className="text-sm text-gray-500">Pending Requests</p>
          <h2 className="text-2xl font-bold text-gray-800">
            {loading ? "..." : accounts.length}
          </h2>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 text-red-700 border border-red-200">
          <AlertCircle size={20} />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {message && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-green-50 text-green-700 border border-green-200">
          <CheckCircle size={20} />
          <p className="text-sm">{message}</p>
        </div>
      )}

      {/* Approval Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
              <ClipboardCheck size={22} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Pending Account Requests
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Accounts waiting for administrator approval.
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading pending requests...
          </div>
        ) : accounts.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
              <CheckCircle size={28} />
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mt-4">
              All Caught Up!
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              There are no pending account requests.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-5 py-4 font-semibold">Account ID</th>
                  <th className="px-5 py-4 font-semibold">Account Number</th>
                  <th className="px-5 py-4 font-semibold">Account Type</th>
                  <th className="px-5 py-4 font-semibold">Balance</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {accounts.map((account) => (
                  <tr key={account.id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-4 font-medium text-gray-700">
                      {account.id}
                    </td>

                    <td className="px-5 py-4 font-semibold text-gray-800">
                      {account.accountNumber}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {account.accountType}
                    </td>

                    <td className="px-5 py-4 font-semibold text-gray-800">
                      {Number(account.balance || 0).toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </td>

                    <td className="px-5 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700">
                        {account.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleApprove(account)}
                        disabled={approvingId === account.id}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 transition"
                      >
                        <CheckCircle size={16} />

                        {approvingId === account.id
                          ? "Approving..."
                          : "Approve"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Approvals;

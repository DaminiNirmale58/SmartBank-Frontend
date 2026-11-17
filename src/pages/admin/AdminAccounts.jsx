import { useEffect, useState } from "react";
import {
  CreditCard,
  RefreshCw,
  Search,
  Power,
  AlertCircle,
} from "lucide-react";

import {
  getAllAccounts,
  deactivateAccount,
  reactivateAccount,
} from "../../services/adminService";

function AdminAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const data = await getAllAccounts();
      setAccounts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load accounts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleStatusChange = async (account) => {
    const isActive = account.status === "ACTIVE";

    const confirmed = window.confirm(
      `Are you sure you want to ${
        isActive ? "deactivate" : "reactivate"
      } account ${account.accountNumber}?`,
    );

    if (!confirmed) return;

    try {
      setActionLoading(account.id);
      setError("");
      setMessage("");

      if (isActive) {
        await deactivateAccount(account.id);
        setMessage("Account deactivated successfully.");
      } else {
        await reactivateAccount(account.id);
        setMessage("Account reactivated successfully.");
      }

      await fetchAccounts();
    } catch (err) {
      setError(err.message || "Unable to update account status.");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredAccounts = accounts.filter((account) => {
    const value = search.toLowerCase().trim();

    return [
      account.accountNumber,
      account.accountType,
      account.status,
      account.id,
    ].some((field) =>
      String(field ?? "")
        .toLowerCase()
        .includes(value),
    );
  });

  const formatAmount = (amount) =>
    Number(amount || 0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });

  const getStatusStyle = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-50 text-green-700";
      case "PENDING":
        return "bg-orange-50 text-orange-700";
      case "INACTIVE":
      case "DEACTIVATED":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">All Accounts</h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor and manage all SmartBank accounts.
          </p>
        </div>

        <button
          onClick={fetchAccounts}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#12372a] text-white hover:bg-[#1b4d3b] disabled:opacity-60 transition"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Account Count */}
      <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-5 flex items-center gap-4">
        <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
          <CreditCard size={26} />
        </div>

        <div>
          <p className="text-sm text-gray-500">Total Accounts</p>
          <h2 className="text-2xl font-bold text-gray-800">
            {loading ? "..." : accounts.length}
          </h2>
        </div>
      </div>

      {/* Feedback */}
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 text-red-700 border border-red-200">
          <AlertCircle size={20} />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {message && (
        <div className="p-4 rounded-lg bg-green-50 text-green-700 border border-green-200 text-sm">
          {message}
        </div>
      )}

      {/* Accounts Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Account List</h2>
            <p className="text-sm text-gray-500 mt-1">
              All registered bank accounts.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search account number, type or status..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading accounts...
          </div>
        ) : filteredAccounts.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No accounts found.
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
                {filteredAccounts.map((account) => {
                  const isActive = account.status === "ACTIVE";

                  return (
                    <tr
                      key={account.id}
                      className="hover:bg-gray-50 transition"
                    >
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
                        {formatAmount(account.balance)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(account.status)}`}
                        >
                          {account.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        {account.status === "PENDING" ? (
                          <span className="text-xs text-gray-400">
                            Awaiting approval
                          </span>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(account)}
                            disabled={actionLoading === account.id}
                            className={`flex items-center gap-2 font-medium disabled:opacity-50 ${
                              isActive
                                ? "text-red-600 hover:text-red-800"
                                : "text-green-700 hover:text-green-900"
                            }`}
                          >
                            <Power size={16} />
                            {actionLoading === account.id
                              ? "Updating..."
                              : isActive
                                ? "Deactivate"
                                : "Reactivate"}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!loading && (
          <div className="px-5 py-4 border-t border-gray-100 text-sm text-gray-500">
            Showing {filteredAccounts.length} of {accounts.length} accounts
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminAccounts;

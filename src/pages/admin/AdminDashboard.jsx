import { useEffect, useState } from "react";
import {
  Users,
  CreditCard,
  Clock,
  ArrowLeftRight,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import {
  getAllCustomers,
  getAllAccounts,
  getPendingAccounts,
  getAllTransactions,
} from "../../services/adminService";

function AdminDashboard() {
  const [stats, setStats] = useState({
    customers: 0,
    accounts: 0,
    pendingApprovals: 0,
    transactions: 0,
  });

  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [customersData, accountsData, pendingData, transactionsData] =
        await Promise.all([
          getAllCustomers(),
          getAllAccounts(),
          getPendingAccounts(),
          getAllTransactions(0, 5),
        ]);

      setStats({
        customers: Array.isArray(customersData) ? customersData.length : 0,

        accounts: Array.isArray(accountsData) ? accountsData.length : 0,

        pendingApprovals: Array.isArray(pendingData) ? pendingData.length : 0,

        transactions: transactionsData?.totalElements ?? 0,
      });

      setRecentTransactions(
        Array.isArray(transactionsData?.content)
          ? transactionsData.content
          : [],
      );
    } catch (err) {
      setError(err.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const cards = [
    {
      title: "Total Customers",
      value: stats.customers,
      icon: Users,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Total Accounts",
      value: stats.accounts,
      icon: CreditCard,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Pending Approvals",
      value: stats.pendingApprovals,
      icon: Clock,
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "Total Transactions",
      value: stats.transactions,
      icon: ArrowLeftRight,
      color: "bg-green-100 text-green-600",
    },
  ];

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Overview of your SmartBank operations.
          </p>
        </div>

        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#12372a] text-white hover:bg-[#1b4d3b] disabled:opacity-60 transition"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 text-red-700 border border-red-200">
          <AlertCircle size={20} />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    {card.title}
                  </p>

                  <h2 className="text-3xl font-bold text-gray-800 mt-3">
                    {loading ? "..." : card.value}
                  </h2>
                </div>

                <div className={`p-3 rounded-xl ${card.color}`}>
                  <Icon size={25} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">
            Recent Transactions
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Latest banking transactions across all accounts.
          </p>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading transactions...
          </div>
        ) : recentTransactions.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No transactions available yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-5 py-4 font-semibold">Reference</th>
                  <th className="px-5 py-4 font-semibold">Type</th>
                  <th className="px-5 py-4 font-semibold">Account</th>
                  <th className="px-5 py-4 font-semibold">Amount</th>
                  <th className="px-5 py-4 font-semibold">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {recentTransactions.map((transaction, index) => (
                  <tr
                    key={transaction.id ?? index}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-5 py-4 font-medium text-gray-800">
                      {transaction.transactionReference || "N/A"}
                    </td>

                    <td className="px-5 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {transaction.transactionType || "N/A"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {transaction.accountNumber ||
                        transaction.account?.accountNumber ||
                        transaction.accountId ||
                        "N/A"}
                    </td>

                    <td className="px-5 py-4 font-semibold text-gray-800">
                      {formatAmount(transaction.amount)}
                    </td>

                    <td className="px-5 py-4 text-gray-500 whitespace-nowrap">
                      {formatDate(transaction.createdAt)}
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

export default AdminDashboard;

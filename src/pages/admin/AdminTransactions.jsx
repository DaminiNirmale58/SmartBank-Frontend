import { useEffect, useState } from "react";
import {
  ArrowLeftRight,
  RefreshCw,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

import {
  getAllTransactions,
  filterAllTransactions,
} from "../../services/adminService";

function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [type, setType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [filtersApplied, setFiltersApplied] = useState(false);

  const fetchTransactions = async (pageNumber = 0, filters = null) => {
    try {
      setLoading(true);
      setError("");

      const data = filters
        ? await filterAllTransactions({
            ...filters,
            page: pageNumber,
            size: pageSize,
          })
        : await getAllTransactions(pageNumber, pageSize);

      setTransactions(Array.isArray(data?.content) ? data.content : []);

      setTotalPages(data?.totalPages ?? 0);
      setTotalElements(data?.totalElements ?? 0);
      setPage(data?.number ?? pageNumber);
    } catch (err) {
      setError(err.message || "Failed to load transactions.");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(0);
  }, []);

  const handleApplyFilters = () => {
    if (fromDate && toDate && fromDate > toDate) {
      setError("From date cannot be later than To date.");
      return;
    }

    if (
      minAmount !== "" &&
      maxAmount !== "" &&
      Number(minAmount) > Number(maxAmount)
    ) {
      setError("Minimum amount cannot exceed maximum amount.");
      return;
    }

    const filters = {
      type,
      fromDate,
      toDate,
      minAmount,
      maxAmount,
    };

    const hasFilters = Object.values(filters).some((value) => value !== "");

    setFiltersApplied(hasFilters);
    fetchTransactions(0, hasFilters ? filters : null);
  };

  const handleResetFilters = () => {
    setType("");
    setFromDate("");
    setToDate("");
    setMinAmount("");
    setMaxAmount("");
    setFiltersApplied(false);
    fetchTransactions(0);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 0 || newPage >= totalPages) return;

    const filters = {
      type,
      fromDate,
      toDate,
      minAmount,
      maxAmount,
    };

    fetchTransactions(newPage, filtersApplied ? filters : null);
  };

  const formatAmount = (amount) =>
    Number(amount || 0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const getTypeStyle = (transactionType) => {
    if (transactionType === "DEPOSIT") {
      return "bg-green-50 text-green-700";
    }

    if (transactionType === "WITHDRAWAL") {
      return "bg-red-50 text-red-700";
    }

    if (transactionType === "TRANSFER_CREDIT") {
      return "bg-blue-50 text-blue-700";
    }

    if (transactionType === "TRANSFER_DEBIT") {
      return "bg-orange-50 text-orange-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">All Transactions</h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor and filter all SmartBank transactions.
          </p>
        </div>

        <button
          onClick={() =>
            fetchTransactions(
              page,
              filtersApplied
                ? { type, fromDate, toDate, minAmount, maxAmount }
                : null,
            )
          }
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#12372a] text-white hover:bg-[#1b4d3b] disabled:opacity-60 transition"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Total Transactions */}
      <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-5 flex items-center gap-4">
        <div className="p-3 rounded-xl bg-green-100 text-green-600">
          <ArrowLeftRight size={26} />
        </div>

        <div>
          <p className="text-sm text-gray-500">Total Transactions</p>
          <h2 className="text-2xl font-bold text-gray-800">
            {loading ? "..." : totalElements}
          </h2>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-lg bg-red-50 text-red-700 border border-red-200">
          <AlertCircle size={20} />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-5">
          <Filter size={20} className="text-green-700" />
          <h2 className="text-lg font-bold text-gray-800">
            Filter Transactions
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Transaction Type
            </label>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-600"
            >
              <option value="">All Types</option>
              <option value="DEPOSIT">Deposit</option>
              <option value="WITHDRAWAL">Withdrawal</option>
              <option value="TRANSFER_CREDIT">Transfer Credit</option>
              <option value="TRANSFER_DEBIT">Transfer Debit</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              From Date
            </label>

            <input
              type="datetime-local"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              To Date
            </label>

            <input
              type="datetime-local"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Minimum Amount (₹)
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              placeholder="Minimum amount"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Maximum Amount (₹)
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              placeholder="Maximum amount"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-5">
          <button
            onClick={handleApplyFilters}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#12372a] text-white hover:bg-[#1b4d3b] disabled:opacity-60 transition"
          >
            <Search size={16} />
            Apply Filters
          </button>

          <button
            onClick={handleResetFilters}
            disabled={loading}
            className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-60 transition"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">
            Transaction History
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            All banking transactions across customer accounts.
          </p>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading transactions...
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No transactions found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-5 py-4 font-semibold">Reference</th>
                  <th className="px-5 py-4 font-semibold">Account ID</th>
                  <th className="px-5 py-4 font-semibold">Type</th>
                  <th className="px-5 py-4 font-semibold">Amount</th>
                  <th className="px-5 py-4 font-semibold">Balance After</th>
                  <th className="px-5 py-4 font-semibold">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {transactions.map((transaction, index) => (
                  <tr
                    key={transaction.id ?? index}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-5 py-4 font-medium text-gray-800">
                      {transaction.transactionReference || "N/A"}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {transaction.accountId ??
                        transaction.account?.id ??
                        "N/A"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getTypeStyle(transaction.transactionType)}`}
                      >
                        {transaction.transactionType || "N/A"}
                      </span>
                    </td>

                    <td className="px-5 py-4 font-semibold text-gray-800 whitespace-nowrap">
                      {formatAmount(transaction.amount)}
                    </td>

                    <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                      {formatAmount(transaction.balanceAfter)}
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

        {/* Pagination */}
        {!loading && totalPages > 0 && (
          <div className="px-5 py-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-sm text-gray-500">
              Showing {page * pageSize + 1}–
              {Math.min((page + 1) * pageSize, totalElements)} of{" "}
              {totalElements} transactions
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 0}
                className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <span className="text-sm text-gray-600">
                Page {page + 1} of {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages - 1}
                className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminTransactions;

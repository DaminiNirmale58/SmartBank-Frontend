import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  History,
  RefreshCw,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Wallet,
  ShieldCheck,
} from "lucide-react";

import {
  getMyAccounts,
  filterTransactions,
} from "../services/transactionService";

function Transactions() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [accountsLoading, setAccountsLoading] = useState(true);

  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [filters, setFilters] = useState({
    type: "",
    fromDate: "",
    toDate: "",
    minAmount: "",
    maxAmount: "",
  });

  const [appliedFilters, setAppliedFilters] = useState({
    type: "",
    fromDate: "",
    toDate: "",
    minAmount: "",
    maxAmount: "",
  });

  const pageSize = 10;

  // Load user's accounts
  const loadAccounts = async () => {
    try {
      setAccountsLoading(true);
      setError("");

      const data = await getMyAccounts();
      setAccounts(data || []);

      const activeAccounts = (data || []).filter(
        (account) => account.status === "ACTIVE",
      );

      if (activeAccounts.length > 0) {
        setSelectedAccount(String(activeAccounts[0].id));
      } else {
        setSelectedAccount("");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setAccountsLoading(false);
    }
  };

  // Load transaction history
  const loadTransactions = async () => {
    if (!selectedAccount) {
      setTransactions([]);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await filterTransactions(selectedAccount, {
        ...appliedFilters,
        page,
        size: pageSize,
      });

      setTransactions(data?.content || []);
      setTotalPages(data?.totalPages || 0);
      setTotalElements(data?.totalElements || 0);
    } catch (err) {
      setError(err.message);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [selectedAccount, page, appliedFilters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleApplyFilters = (e) => {
    e.preventDefault();

    if (
      filters.fromDate &&
      filters.toDate &&
      filters.fromDate > filters.toDate
    ) {
      setError("From date cannot be later than To date.");
      return;
    }

    if (
      filters.minAmount &&
      filters.maxAmount &&
      Number(filters.minAmount) > Number(filters.maxAmount)
    ) {
      setError("Minimum amount cannot exceed maximum amount.");
      return;
    }

    setError("");
    setPage(0);
    setAppliedFilters({ ...filters });
  };

  const handleResetFilters = () => {
    const emptyFilters = {
      type: "",
      fromDate: "",
      toDate: "",
      minAmount: "",
      maxAmount: "",
    };

    setFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setPage(0);
    setError("");
  };

  const handleAccountChange = (e) => {
    setSelectedAccount(e.target.value);
    setPage(0);
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case "DEPOSIT":
      case "TRANSFER_CREDIT":
        return <ArrowDownLeft size={20} />;

      case "WITHDRAWAL":
      case "TRANSFER_DEBIT":
        return <ArrowUpRight size={20} />;

      default:
        return <ArrowLeftRight size={20} />;
    }
  };

  const isCredit = (type) => {
    return type === "DEPOSIT" || type === "TRANSFER_CREDIT";
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const selectedAccountDetails = accounts.find(
    (account) => String(account.id) === String(selectedAccount),
  );

  return (
    <div className="min-h-screen bg-[#f2f7f4] p-5 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-700 mb-4"
            >
              <ArrowLeft size={17} />
              Back to Dashboard
            </Link>

            <h1 className="text-3xl font-bold text-[#12372a]">Transactions</h1>

            <p className="text-slate-500 mt-2">
              View and manage your banking activity.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 bg-white border border-emerald-100 rounded-full px-4 py-2 text-sm text-emerald-700 shadow-sm">
            <ShieldCheck size={17} />
            Secure Transactions
          </div>
        </div>

        {/* Account Selection */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Wallet size={21} />
            </div>

            <div>
              <h2 className="font-bold text-[#12372a]">Select Account</h2>
              <p className="text-sm text-slate-500">
                Choose an account to view its transactions.
              </p>
            </div>
          </div>

          {accountsLoading ? (
            <p className="text-slate-500 text-sm">Loading accounts...</p>
          ) : (
            <select
              value={selectedAccount}
              onChange={handleAccountChange}
              className="w-full md:max-w-md px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-emerald-500"
            >
              <option value="">Select an active account</option>

              {accounts
                .filter((account) => account.status === "ACTIVE")
                .map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.accountType} - {account.accountNumber}
                  </option>
                ))}
            </select>
          )}

          {selectedAccountDetails && (
            <p className="text-sm text-slate-500 mt-3">
              Available Balance:{" "}
              <span className="font-bold text-emerald-700">
                ₹{formatAmount(selectedAccountDetails.balance)}
              </span>
            </p>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-100 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <Filter size={20} className="text-emerald-700" />
            <h2 className="font-bold text-[#12372a] text-lg">
              Filter Transactions
            </h2>
          </div>

          <form onSubmit={handleApplyFilters}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Transaction Type
                </label>

                <select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-emerald-500"
                >
                  <option value="">All Transactions</option>
                  <option value="DEPOSIT">Deposit</option>
                  <option value="WITHDRAWAL">Withdrawal</option>
                  <option value="TRANSFER_DEBIT">Transfer Sent</option>
                  <option value="TRANSFER_CREDIT">Transfer Received</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  From Date
                </label>

                <input
                  type="datetime-local"
                  name="fromDate"
                  value={filters.fromDate}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  To Date
                </label>

                <input
                  type="datetime-local"
                  name="toDate"
                  value={filters.toDate}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Minimum Amount (₹)
                </label>

                <input
                  type="number"
                  name="minAmount"
                  min="0"
                  step="0.01"
                  placeholder="Minimum amount"
                  value={filters.minAmount}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Maximum Amount (₹)
                </label>

                <input
                  type="number"
                  name="maxAmount"
                  min="0"
                  step="0.01"
                  placeholder="Maximum amount"
                  value={filters.maxAmount}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-5">
              <button
                type="submit"
                disabled={!selectedAccount || loading}
                className="inline-flex items-center justify-center gap-2 bg-[#12372a] hover:bg-emerald-800 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition"
              >
                <Search size={18} />
                Apply Filters
              </button>

              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-600 px-6 py-3 rounded-xl font-semibold transition"
              >
                <RefreshCw size={17} />
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Transaction History */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-5 md:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <History size={22} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-[#12372a]">
                  Transaction History
                </h2>

                <p className="text-sm text-slate-500">
                  {totalElements} transaction(s) found
                </p>
              </div>
            </div>

            <button
              onClick={loadTransactions}
              disabled={!selectedAccount || loading}
              className="inline-flex items-center justify-center gap-2 text-emerald-700 hover:bg-emerald-50 px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <RefreshCw
                size={28}
                className="animate-spin text-emerald-600 mx-auto mb-3"
              />
              <p className="text-slate-500">Loading transactions...</p>
            </div>
          ) : !selectedAccount ? (
            <div className="py-20 text-center">
              <Wallet size={35} className="text-slate-300 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-700">
                No active account found
              </h3>
              <p className="text-sm text-slate-500 mt-2">
                Please create an account and get it approved first.
              </p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="py-20 text-center">
              <History size={38} className="text-slate-300 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-700">
                No transactions found
              </h3>
              <p className="text-sm text-slate-500 mt-2">
                Your transaction history will appear here.
              </p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-slate-100">
                {transactions.map((transaction) => {
                  const credit = isCredit(transaction.transactionType);

                  return (
                    <div
                      key={transaction.id}
                      className="p-5 md:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            credit
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-orange-50 text-orange-600"
                          }`}
                        >
                          {getTransactionIcon(transaction.transactionType)}
                        </div>

                        <div>
                          <h3 className="font-bold text-[#12372a]">
                            {transaction.transactionType?.replaceAll("_", " ")}
                          </h3>

                          <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                            <CalendarDays size={14} />
                            {formatDate(transaction.createdAt)}
                          </p>

                          <p className="text-xs text-slate-400 mt-1 break-all">
                            Ref: {transaction.transactionReference}
                          </p>
                        </div>
                      </div>

                      <div className="sm:text-right">
                        <p
                          className={`font-bold text-lg ${
                            credit ? "text-emerald-600" : "text-orange-600"
                          }`}
                        >
                          {credit ? "+" : "-"}₹
                          {formatAmount(transaction.amount)}
                        </p>

                        <p className="text-xs text-slate-400 mt-1">
                          Balance: ₹{formatAmount(transaction.balanceAfter)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              <div className="p-5 md:px-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-slate-500">
                  Page {page + 1} of {Math.max(totalPages, 1)}
                </p>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setPage((previous) => previous - 1)}
                    disabled={page === 0 || loading}
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                  >
                    <ChevronLeft size={17} />
                    Previous
                  </button>

                  <button
                    onClick={() => setPage((previous) => previous + 1)}
                    disabled={page + 1 >= totalPages || loading}
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                  >
                    Next
                    <ChevronRight size={17} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-8">
          © 2026 SmartBank. Banking made simple and secure.
        </p>
      </div>
    </div>
  );
}

export default Transactions;

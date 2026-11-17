import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyAccounts } from "../services/accountService";
import {
  Landmark,
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  History,
  Users,
  UserRound,
  Bell,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  ShieldCheck,
  LogOut,
  RefreshCw,
  Menu,
  Clock,
} from "lucide-react";

const API_URL = "https://smartbank-backend-a26c.onrender.com/api/transactions";

function Dashboard() {
  const navigate = useNavigate();

  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [error, setError] = useState("");
  const [transactionError, setTransactionError] = useState("");

  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchAccounts();
  }, []);

  // Fetch accounts and their latest transactions
  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyAccounts();
      const accountList = Array.isArray(data) ? data : [];

      setAccounts(accountList);

      await fetchRecentTransactions(accountList);
    } catch (err) {
      setError(err.message || "Unable to load accounts.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch mini statement for every active account
  const fetchRecentTransactions = async (accountList) => {
    try {
      setTransactionLoading(true);
      setTransactionError("");

      const token = sessionStorage.getItem("token");

      if (!token) {
        throw new Error("Session expired. Please sign in again.");
      }

      const activeAccounts = accountList.filter(
        (account) => account.status === "ACTIVE",
      );

      if (activeAccounts.length === 0) {
        setTransactions([]);
        return;
      }

      const results = await Promise.allSettled(
        activeAccounts.map(async (account) => {
          const response = await fetch(
            `${API_URL}/${account.id}/mini-statement`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            },
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(
              data.message || "Unable to fetch transaction history.",
            );
          }

          return Array.isArray(data) ? data : [];
        }),
      );

      const successfulResults = results
        .filter((result) => result.status === "fulfilled")
        .flatMap((result) => result.value);

      const failedResults = results.filter(
        (result) => result.status === "rejected",
      );

      const sortedTransactions = successfulResults
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 5);

      setTransactions(sortedTransactions);

      if (failedResults.length > 0) {
        setTransactionError("Some account transactions could not be loaded.");
      }
    } catch (err) {
      setTransactionError(err.message || "Unable to load recent transactions.");
      setTransactions([]);
    } finally {
      setTransactionLoading(false);
    }
  };

  const totalBalance = accounts
    .filter((account) => account.status === "ACTIVE")
    .reduce((total, account) => total + Number(account.balance || 0), 0);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isDebit = (type) =>
    ["WITHDRAWAL", "TRANSFER_DEBIT"].includes(type?.toUpperCase());

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/");
  };

  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { label: "My Accounts", icon: Wallet, path: "/accounts" },
    { label: "Transactions", icon: History, path: "/transactions" },
    { label: "Transfer Money", icon: ArrowLeftRight, path: "/transfer" },
    { label: "Beneficiaries", icon: Users, path: "/beneficiaries" },
    { label: "My Profile", icon: UserRound, path: "/profile" },
  ];

  const quickActions = [
    {
      label: "Deposit",
      icon: ArrowDownLeft,
      color: "bg-emerald-50 text-emerald-700",
      path: "/deposit",
    },
    {
      label: "Withdraw",
      icon: ArrowUpRight,
      color: "bg-orange-50 text-orange-600",
      path: "/withdraw",
    },
    {
      label: "Transfer",
      icon: ArrowLeftRight,
      color: "bg-blue-50 text-blue-700",
      path: "/transfer",
    },
    {
      label: "My Accounts",
      icon: CreditCard,
      color: "bg-purple-50 text-purple-700",
      path: "/accounts",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f4f8f5] text-[#173c2e]">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-72 bg-[#12372a] text-white flex-col px-6 py-7">
          <div className="flex items-center gap-3 mb-12">
            <div className="bg-white/10 p-3 rounded-xl">
              <Landmark size={25} />
            </div>
            <span className="text-2xl font-bold">
              Smart<span className="text-emerald-400">Bank</span>
            </span>
          </div>

          <p className="text-xs uppercase tracking-[2px] text-emerald-200/60 mb-4">
            Main Menu
          </p>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = window.location.pathname === item.path;

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition ${
                    active
                      ? "bg-emerald-500 text-white"
                      : "text-emerald-50/70 hover:bg-white/10"
                  }`}
                >
                  <Icon size={19} />
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-auto bg-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-emerald-300 mb-2">
              <ShieldCheck size={18} />
              <span className="text-sm font-semibold">Secure Banking</span>
            </div>
            <p className="text-xs text-emerald-50/70 leading-5">
              Your security is our priority. Bank with confidence.
            </p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Topbar */}
          <header className="bg-white border-b border-slate-100 px-5 md:px-8 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="lg:hidden p-2 rounded-lg bg-slate-50">
                <Menu size={21} />
              </button>

              <div>
                <h1 className="text-xl font-bold">Dashboard</h1>
                <p className="text-xs text-slate-500 mt-1">
                  Your financial overview
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2.5 rounded-xl bg-slate-50 text-slate-600">
                <Search size={19} />
              </button>

              <button className="p-2.5 rounded-xl bg-slate-50 text-slate-600">
                <Bell size={19} />
              </button>

              <div className="hidden sm:flex items-center gap-3 border-l pl-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-800">
                  {user.fullName?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    {user.fullName || "User"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {user.role || "CUSTOMER"}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2.5 rounded-xl text-red-600 bg-red-50 hover:bg-red-100"
              >
                <LogOut size={19} />
              </button>
            </div>
          </header>

          <div className="p-5 md:p-8 max-w-7xl mx-auto">
            {/* Welcome */}
            <section className="mb-8">
              <p className="text-sm text-emerald-700 font-medium">
                Welcome to SmartBank
              </p>

              <h2 className="text-3xl md:text-4xl font-bold mt-2">
                Hello, {user.fullName?.split(" ")[0] || "there"}! 👋
              </h2>

              <p className="text-slate-500 mt-2">
                Here's what's happening with your money today.
              </p>
            </section>

            {/* Balance Card */}
            <section className="bg-gradient-to-r from-[#12372a] to-[#087f5b] rounded-3xl p-7 md:p-9 text-white shadow-xl relative overflow-hidden">
              <div className="absolute -right-12 -top-20 w-64 h-64 rounded-full border-[35px] border-white/5" />

              <div className="relative z-10">
                <div className="flex items-center gap-2 text-emerald-100 text-sm">
                  <Wallet size={18} />
                  Total Active Account Balance
                </div>

                <h3 className="text-4xl md:text-5xl font-bold mt-5">
                  {loading ? "Loading..." : formatCurrency(totalBalance)}
                </h3>

                <p className="text-emerald-100/80 text-sm mt-3">
                  {accounts.filter((a) => a.status === "ACTIVE").length} active
                  account(s) found
                </p>

                <button
                  onClick={fetchAccounts}
                  disabled={loading}
                  className="mt-7 bg-white/15 border border-white/20 px-5 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-white/25 disabled:opacity-50"
                >
                  <RefreshCw
                    size={17}
                    className={loading ? "animate-spin" : ""}
                  />
                  Refresh Balance
                </button>
              </div>
            </section>

            {/* Account loading / error */}
            {loading && (
              <p className="mt-6 text-sm text-slate-500">
                Loading your accounts...
              </p>
            )}

            {error && (
              <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">
                {error}
                <button
                  onClick={fetchAccounts}
                  className="ml-3 underline font-semibold"
                >
                  Try again
                </button>
              </div>
            )}

            {/* My Accounts */}
            {!loading && !error && (
              <section className="mt-9">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-lg font-bold">My Accounts</h3>
                    <p className="text-sm text-slate-500 mt-1">
                      Your registered bank accounts
                    </p>
                  </div>
                  <CreditCard className="text-emerald-600" size={23} />
                </div>

                {accounts.length === 0 ? (
                  <div className="bg-white border border-slate-100 rounded-2xl p-10 text-center">
                    <Wallet size={30} className="mx-auto text-emerald-600" />
                    <p className="font-semibold mt-4">No accounts found</p>
                    <p className="text-sm text-slate-400 mt-1">
                      Create an account to get started with SmartBank.
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {accounts.map((account) => (
                      <div
                        key={account.id}
                        className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
                      >
                        <div className="flex items-center justify-between">
                          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                            <Landmark size={22} />
                          </div>

                          <span
                            className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                              account.status === "ACTIVE"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {account.status}
                          </span>
                        </div>

                        <p className="text-sm text-slate-500 mt-5">
                          {account.accountType} Account
                        </p>

                        <p className="font-semibold tracking-wider mt-1">
                          {account.accountNumber}
                        </p>

                        <div className="border-t border-slate-100 mt-5 pt-4">
                          <p className="text-xs text-slate-400">
                            Available Balance
                          </p>
                          <p className="text-2xl font-bold mt-1">
                            {formatCurrency(Number(account.balance || 0))}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Quick Actions */}
            <section className="mt-9">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold">Quick Actions</h3>
                <span className="text-xs text-slate-400">
                  Manage your money
                </span>
              </div>

              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {quickActions.map((action) => {
                  const Icon = action.icon;

                  return (
                    <button
                      key={action.label}
                      type="button"
                      onClick={() => navigate(action.path)}
                      className="bg-white border border-slate-100 rounded-2xl p-5 text-left hover:shadow-lg hover:-translate-y-1 transition duration-200"
                    >
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.color}`}
                      >
                        <Icon size={22} />
                      </div>

                      <p className="font-semibold mt-4">{action.label}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        Manage {action.label.toLowerCase()}
                      </p>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Recent Transactions */}
            <section className="mt-9 bg-white rounded-2xl border border-slate-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">Recent Transactions</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Keep track of your latest activity
                  </p>
                </div>

                <button
                  onClick={() => fetchRecentTransactions(accounts)}
                  disabled={transactionLoading}
                  title="Refresh transactions"
                  className="text-emerald-600 hover:text-emerald-800 disabled:opacity-50"
                >
                  <RefreshCw
                    size={21}
                    className={transactionLoading ? "animate-spin" : ""}
                  />
                </button>
              </div>

              {transactionLoading ? (
                <div className="text-center py-12 text-slate-500">
                  <RefreshCw className="animate-spin mx-auto" size={28} />
                  <p className="mt-3 text-sm">Loading recent transactions...</p>
                </div>
              ) : transactionError ? (
                <div className="text-center py-10">
                  <p className="text-sm text-red-600">{transactionError}</p>
                  <button
                    onClick={() => fetchRecentTransactions(accounts)}
                    className="mt-3 text-sm text-emerald-700 font-semibold underline"
                  >
                    Try again
                  </button>
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto">
                    <History size={25} />
                  </div>
                  <p className="font-semibold mt-4">No transactions to show</p>
                  <p className="text-sm text-slate-400 mt-1">
                    Your recent transactions will appear here.
                  </p>
                </div>
              ) : (
                <div className="mt-6 divide-y divide-slate-100">
                  {transactions.map((transaction) => {
                    const debit = isDebit(transaction.transactionType);

                    return (
                      <div
                        key={transaction.id}
                        className="py-4 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center ${
                              debit
                                ? "bg-orange-50 text-orange-600"
                                : "bg-emerald-50 text-emerald-700"
                            }`}
                          >
                            {debit ? (
                              <ArrowUpRight size={21} />
                            ) : (
                              <ArrowDownLeft size={21} />
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="font-semibold text-sm">
                              {transaction.transactionType?.replaceAll(
                                "_",
                                " ",
                              )}
                            </p>

                            <p className="text-xs text-slate-400 mt-1">
                              <Clock size={12} className="inline mr-1" />
                              {formatDate(transaction.createdAt)}
                            </p>

                            <p className="text-xs text-slate-400 mt-1 truncate">
                              Ref: {transaction.transactionReference}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <p
                            className={`font-bold ${
                              debit ? "text-orange-600" : "text-emerald-700"
                            }`}
                          >
                            {debit ? "-" : "+"}
                            {formatCurrency(Number(transaction.amount || 0))}
                          </p>

                          <p className="text-xs text-slate-400 mt-1">
                            Balance:{" "}
                            {formatCurrency(
                              Number(transaction.balanceAfter || 0),
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="border-t border-slate-100 mt-3 pt-4 text-center">
                <button
                  onClick={() => navigate("/transactions")}
                  className="text-sm font-semibold text-emerald-700 hover:text-emerald-900"
                >
                  View All Transactions →
                </button>
              </div>
            </section>

            <footer className="text-center text-xs text-slate-400 py-8">
              © 2026 SmartBank. Banking made simple and secure.
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Landmark,
  IndianRupee,
} from "lucide-react";

const API_URL = "https://smartbank-backend-a26c.onrender.com/api";

function Withdraw() {
  const navigate = useNavigate();

  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  const token = sessionStorage.getItem("token");

  const activeAccounts = accounts.filter(
    (account) => account.status === "ACTIVE",
  );

  const currentAccount = activeAccounts.find(
    (account) => String(account.id) === String(selectedAccount),
  );

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(Number(value || 0));

  const fetchAccounts = async () => {
    try {
      setFetching(true);
      setError("");

      if (!token) {
        throw new Error("Session expired. Please sign in again.");
      }

      const response = await fetch(`${API_URL}/accounts/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Unable to fetch accounts.",
        );
      }

      const list = Array.isArray(data) ? data : [];
      setAccounts(list);

      const active = list.filter((account) => account.status === "ACTIVE");

      if (active.length > 0) {
        setSelectedAccount((previous) => {
          const stillExists = active.some(
            (account) => String(account.id) === String(previous),
          );

          return stillExists ? previous : String(active[0].id);
        });
      } else {
        setSelectedAccount("");
      }
    } catch (err) {
      setError(err.message || "Unable to load accounts.");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleWithdraw = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess(null);

    const withdrawAmount = Number(amount);

    if (!selectedAccount) {
      setError("Please select an active account.");
      return;
    }

    if (!Number.isFinite(withdrawAmount) || withdrawAmount <= 0) {
      setError("Please enter a valid withdrawal amount.");
      return;
    }

    if (!/^\d+(\.\d{1,2})?$/.test(amount.trim())) {
      setError("Amount can have maximum 2 decimal places.");
      return;
    }

    if (withdrawAmount > Number(currentAccount?.balance || 0)) {
      setError("Insufficient balance in your account.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/transactions/${selectedAccount}/withdraw`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: withdrawAmount,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Withdrawal failed.");
      }

      setSuccess(data);
      setAmount("");

      // Fetch the latest balance from backend.
      await fetchAccounts();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const quickAmounts = [500, 1000, 2000, 5000];

  return (
    <div className="min-h-screen bg-[#f4f8f5] text-[#173c2e]">
      {/* Header */}
      <header className="max-w-6xl mx-auto px-5 md:px-8 py-7">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-700 transition"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div className="flex items-center justify-between mt-5">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Withdraw Money</h1>
            <p className="text-slate-500 mt-2">
              Withdraw funds from your SmartBank account securely.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-white border border-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm shadow-sm">
            <ShieldCheck size={17} />
            Secure Transaction
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-5 md:px-8 pb-12">
        <div className="grid lg:grid-cols-2 gap-6 items-start">
          {/* Withdrawal Form */}
          <section className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_15px_45px_rgba(18,55,42,0.07)]">
            <div className="flex items-center gap-4 mb-7">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
                <ArrowUpRight size={25} />
              </div>

              <div>
                <h2 className="text-lg font-bold">Withdraw money</h2>
                <p className="text-sm text-slate-500">
                  Select an account and enter an amount.
                </p>
              </div>
            </div>

            {/* Success Message */}
            {success && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                  <CheckCircle2 size={19} />
                  Withdrawal successful!
                </div>

                <p className="text-sm text-emerald-700 mt-2">
                  {formatCurrency(success.amount)} has been withdrawn.
                </p>

                <p className="text-sm text-emerald-700 mt-1">
                  Updated balance:{" "}
                  <strong>{formatCurrency(success.balanceAfter)}</strong>
                </p>

                <p className="text-xs text-emerald-600 mt-2 break-all">
                  Reference: {success.transactionReference}
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-100 text-red-600 rounded-xl p-4 mb-6 text-sm">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            {fetching ? (
              <div className="py-12 text-center text-slate-500">
                <RefreshCw className="animate-spin mx-auto mb-3" />
                Loading your accounts...
              </div>
            ) : activeAccounts.length === 0 ? (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
                <h3 className="font-semibold text-amber-800">
                  No active account found
                </h3>
                <p className="text-sm text-amber-700 mt-1">
                  You need an approved, active account before making a
                  withdrawal.
                </p>

                <button
                  onClick={() => navigate("/accounts")}
                  className="text-sm font-semibold text-emerald-800 mt-4 hover:underline"
                >
                  View my accounts
                </button>
              </div>
            ) : (
              <form onSubmit={handleWithdraw} className="space-y-6">
                {/* Account Selection */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Select Account
                  </label>

                  <div className="relative">
                    <Wallet
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />

                    <select
                      value={selectedAccount}
                      onChange={(e) => {
                        setSelectedAccount(e.target.value);
                        setSuccess(null);
                        setError("");
                      }}
                      className="w-full appearance-none pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    >
                      {activeAccounts.map((account) => (
                        <option key={account.id} value={account.id}>
                          {account.accountType} - {account.accountNumber}
                        </option>
                      ))}
                    </select>
                  </div>

                  <p className="text-xs text-slate-500 mt-2">
                    Available balance:{" "}
                    <strong className="text-emerald-700">
                      {formatCurrency(currentAccount?.balance)}
                    </strong>
                  </p>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Withdrawal Amount
                  </label>

                  <div className="relative">
                    <IndianRupee
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value);
                        setError("");
                        setSuccess(null);
                      }}
                      className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    />
                  </div>

                  {/* Quick Amounts */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {quickAmounts.map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => {
                          setAmount(String(value));
                          setError("");
                          setSuccess(null);
                        }}
                        className="px-4 py-2 rounded-lg border border-emerald-100 bg-emerald-50/60 text-emerald-800 text-sm font-semibold hover:bg-emerald-100 transition"
                      >
                        ₹{value.toLocaleString("en-IN")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || !currentAccount}
                  className="w-full flex items-center justify-center gap-3 bg-[#12372a] hover:bg-emerald-800 disabled:opacity-60 text-white font-semibold py-4 rounded-xl shadow-lg shadow-emerald-900/10 transition duration-300"
                >
                  {loading ? (
                    <>
                      <RefreshCw size={19} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ArrowUpRight size={19} />
                      Withdraw Money
                    </>
                  )}
                </button>
              </form>
            )}
          </section>

          {/* Right Side */}
          <section className="space-y-5">
            {/* Balance Card */}
            <div className="bg-gradient-to-br from-[#12372a] to-[#087f5b] rounded-3xl p-7 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <p className="text-sm text-emerald-100">
                  Selected Account Balance
                </p>
                <Wallet size={21} />
              </div>

              <h2 className="text-3xl font-bold mt-5">
                {formatCurrency(currentAccount?.balance)}
              </h2>

              <div className="border-t border-white/20 mt-6 pt-5">
                <p className="text-xs text-emerald-100">Account Number</p>
                <p className="font-semibold tracking-wider mt-1">
                  {currentAccount?.accountNumber || "Select an account"}
                </p>

                <p className="text-xs text-emerald-100 mt-4">Account Type</p>
                <p className="font-semibold mt-1">
                  {currentAccount?.accountType || "—"}
                </p>
              </div>
            </div>

            {/* Security Information */}
            <div className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <ShieldCheck size={22} />
                </div>
                <h3 className="font-bold">Banking with confidence</h3>
              </div>

              <div className="space-y-3 text-sm text-slate-500">
                {[
                  "Only your active accounts can make withdrawals.",
                  "Insufficient balance transactions are rejected.",
                  "Your transaction is recorded securely.",
                  "Your updated balance is fetched from the server.",
                ].map((item) => (
                  <p key={item} className="flex items-start gap-2">
                    <CheckCircle2
                      size={17}
                      className="text-emerald-600 shrink-0"
                    />
                    {item}
                  </p>
                ))}
              </div>
            </div>

            {/* Refresh */}
            <button
              onClick={fetchAccounts}
              disabled={fetching}
              className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 rounded-xl py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition disabled:opacity-50"
            >
              <RefreshCw size={16} className={fetching ? "animate-spin" : ""} />
              Refresh Accounts
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Withdraw;

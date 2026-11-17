import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Landmark,
  ArrowLeft,
  ArrowDownLeft,
  Wallet,
  IndianRupee,
  CheckCircle2,
  AlertCircle,
  LoaderCircle,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import { getMyAccounts, depositMoney } from "../services/transactionService";

const formatINR = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(Number(amount || 0));

function Deposit() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  const activeAccounts = useMemo(
    () => accounts.filter((account) => account.status === "ACTIVE"),
    [accounts],
  );

  const selectedAccount = activeAccounts.find(
    (account) => String(account.id) === selectedAccountId,
  );

  const loadAccounts = async () => {
    setLoadingAccounts(true);
    setError("");

    try {
      const data = await getMyAccounts();
      const accountList = Array.isArray(data) ? data : [];

      setAccounts(accountList);

      const active = accountList.filter(
        (account) => account.status === "ACTIVE",
      );

      setSelectedAccountId((currentId) => {
        if (active.some((account) => String(account.id) === currentId)) {
          return currentId;
        }

        return active.length ? String(active[0].id) : "";
      });
    } catch (err) {
      setError(err.message || "Unable to load your accounts.");
    } finally {
      setLoadingAccounts(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const handleDeposit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(null);

    const numericAmount = Number(amount);

    if (!selectedAccountId) {
      setError("Please select an active account.");
      return;
    }

    if (!Number.isFinite(numericAmount) || numericAmount < 0.01) {
      setError("Please enter an amount greater than zero.");
      return;
    }

    if (!/^\d+(\.\d{1,2})?$/.test(amount.trim())) {
      setError("Amount can have maximum 2 decimal places.");
      return;
    }

    setSubmitting(true);

    try {
      const result = await depositMoney(selectedAccountId, numericAmount);

      setSuccess(result);
      setAmount("");

      // Fetch the latest account balance from the backend.
      await loadAccounts();
    } catch (err) {
      setError(err.message || "Deposit failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f8f5] px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              to="/dashboard"
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-emerald-700"
            >
              <ArrowLeft size={17} />
              Back to Dashboard
            </Link>

            <h1 className="text-3xl font-bold text-[#12372a]">Deposit Money</h1>

            <p className="mt-2 text-slate-500">
              Add funds to your SmartBank account securely.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm">
            <ShieldCheck size={18} />
            Secure Transaction
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
          {/* Deposit Form */}
          <section className="rounded-3xl border border-white bg-white p-6 shadow-[0_15px_45px_rgba(18,55,42,0.07)] sm:p-8">
            <div className="mb-7 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <ArrowDownLeft size={28} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#12372a]">Add money</h2>
                <p className="text-sm text-slate-500">
                  Choose an account and enter an amount.
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                {error}
              </div>
            )}

            {success && (
              <div className="mb-5 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                <div className="flex items-center gap-2 font-semibold text-emerald-800">
                  <CheckCircle2 size={19} />
                  Deposit successful!
                </div>

                <p className="mt-2 text-sm text-emerald-700">
                  {formatINR(success.amount)} has been deposited.
                </p>

                <p className="mt-1 text-sm text-emerald-700">
                  Updated balance:{" "}
                  <strong>{formatINR(success.balanceAfter)}</strong>
                </p>

                {success.transactionReference && (
                  <p className="mt-2 break-all text-xs text-emerald-700">
                    Reference: {success.transactionReference}
                  </p>
                )}
              </div>
            )}

            {loadingAccounts ? (
              <div className="flex items-center justify-center gap-3 py-12 text-slate-500">
                <LoaderCircle className="animate-spin" size={21} />
                Loading your accounts...
              </div>
            ) : activeAccounts.length === 0 ? (
              <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
                <p className="font-semibold text-amber-800">
                  No active account found
                </p>
                <p className="mt-1 text-sm text-amber-700">
                  You need an approved, active account before making a deposit.
                </p>
                <Link
                  to="/accounts"
                  className="mt-4 inline-flex font-semibold text-emerald-800 hover:underline"
                >
                  View my accounts
                </Link>
              </div>
            ) : (
              <form onSubmit={handleDeposit} className="space-y-6">
                {/* Account selection */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Select Account
                  </label>

                  <div className="relative">
                    <Wallet
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <select
                      value={selectedAccountId}
                      onChange={(e) => {
                        setSelectedAccountId(e.target.value);
                        setSuccess(null);
                        setError("");
                      }}
                      required
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                    >
                      {activeAccounts.map((account) => (
                        <option key={account.id} value={account.id}>
                          {account.accountType} - {account.accountNumber}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedAccount && (
                    <p className="mt-2 text-xs text-slate-500">
                      Available balance:{" "}
                      <strong className="text-[#12372a]">
                        {formatINR(selectedAccount.balance)}
                      </strong>
                    </p>
                  )}
                </div>

                {/* Amount */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Deposit Amount
                  </label>

                  <div className="relative">
                    <IndianRupee
                      size={20}
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
                        setSuccess(null);
                      }}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-lg font-semibold text-[#12372a] outline-none transition placeholder:text-slate-400 placeholder:font-normal focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                    />
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {[500, 1000, 2000, 5000].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => {
                          setAmount(String(value));
                          setSuccess(null);
                          setError("");
                        }}
                        className="rounded-lg border border-emerald-100 bg-emerald-50/60 px-4 py-2 text-sm font-semibold text-emerald-800 transition hover:border-emerald-300 hover:bg-emerald-100"
                      >
                        + ₹{value.toLocaleString("en-IN")}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || !selectedAccountId}
                  className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#12372a] py-4 font-semibold text-white shadow-lg shadow-emerald-900/10 transition hover:-translate-y-0.5 hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <LoaderCircle size={19} className="animate-spin" />
                      Processing Deposit...
                    </>
                  ) : (
                    <>
                      <ArrowDownLeft size={19} />
                      Deposit Money
                    </>
                  )}
                </button>
              </form>
            )}
          </section>

          {/* Account Summary */}
          <aside className="space-y-5">
            <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#12372a] to-[#07845f] p-7 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <p className="text-sm text-emerald-100">
                  Selected Account Balance
                </p>
                <Wallet size={22} className="text-emerald-100" />
              </div>

              <h2 className="mt-5 text-3xl font-bold">
                {formatINR(selectedAccount?.balance)}
              </h2>

              <div className="mt-6 border-t border-white/20 pt-5">
                <p className="text-xs text-emerald-100">Account Number</p>
                <p className="mt-1 font-semibold tracking-wider">
                  {selectedAccount?.accountNumber || "Select an account"}
                </p>

                <p className="mt-4 text-xs text-emerald-100">Account Type</p>
                <p className="mt-1 font-semibold">
                  {selectedAccount?.accountType || "—"}
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-emerald-50 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <ShieldCheck size={22} />
                </div>
                <h3 className="font-bold text-[#12372a]">
                  Banking with confidence
                </h3>
              </div>

              <ul className="mt-5 space-y-3 text-sm text-slate-500">
                <li className="flex gap-2">
                  <CheckCircle2
                    size={17}
                    className="shrink-0 text-emerald-600"
                  />
                  Only your active accounts can receive deposits.
                </li>
                <li className="flex gap-2">
                  <CheckCircle2
                    size={17}
                    className="shrink-0 text-emerald-600"
                  />
                  Your transaction is recorded securely.
                </li>
                <li className="flex gap-2">
                  <CheckCircle2
                    size={17}
                    className="shrink-0 text-emerald-600"
                  />
                  Your updated balance is fetched from the server.
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={loadAccounts}
              disabled={loadingAccounts}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-600 transition hover:border-emerald-200 hover:text-emerald-700 disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={loadingAccounts ? "animate-spin" : ""}
              />
              Refresh Accounts
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Deposit;

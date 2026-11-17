import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowLeftRight,
  Wallet,
  ShieldCheck,
  RefreshCw,
  Send,
  CheckCircle,
  AlertCircle,
  IndianRupee,
  Hash,
} from "lucide-react";

import { getMyAccounts, transferMoney } from "../services/transactionService";

function Transfer() {
  const [accounts, setAccounts] = useState([]);
  const [senderAccountId, setSenderAccountId] = useState("");
  const [receiverAccountId, setReceiverAccountId] = useState("");
  const [amount, setAmount] = useState("");

  const [loading, setLoading] = useState(false);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  const activeAccounts = accounts.filter(
    (account) => account.status === "ACTIVE",
  );

  const selectedAccount = activeAccounts.find(
    (account) => String(account.id) === String(senderAccountId),
  );

  const formatAmount = (value) =>
    Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // Load sender accounts
  const loadAccounts = async () => {
    try {
      setAccountsLoading(true);
      setError("");

      const data = await getMyAccounts();
      setAccounts(data || []);

      const active = (data || []).filter(
        (account) => account.status === "ACTIVE",
      );

      if (active.length > 0) {
        setSenderAccountId(String(active[0].id));
      } else {
        setSenderAccountId("");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setAccountsLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const handleTransfer = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess(null);

    if (!senderAccountId) {
      setError("Please select your sender account.");
      return;
    }

    if (
      !receiverAccountId ||
      !Number.isInteger(Number(receiverAccountId)) ||
      Number(receiverAccountId) <= 0
    ) {
      setError("Please enter a valid receiver account ID.");
      return;
    }

    if (Number(receiverAccountId) === Number(senderAccountId)) {
      setError("Sender and receiver accounts cannot be the same.");
      return;
    }

    if (!amount || !Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      setError("Please enter a valid transfer amount.");
      return;
    }

    if (Number(amount) > Number(selectedAccount?.balance || 0)) {
      setError("Insufficient balance.");
      return;
    }

    try {
      setLoading(true);

      const result = await transferMoney(
        senderAccountId,
        receiverAccountId,
        amount,
      );

      setSuccess(result);

      setAmount("");
      setReceiverAccountId("");

      await loadAccounts();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f7f4] p-5 md:p-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-700 mb-4"
            >
              <ArrowLeft size={17} />
              Back to Dashboard
            </Link>

            <h1 className="text-3xl font-bold text-[#12372a]">
              Transfer Money
            </h1>

            <p className="text-slate-500 mt-2">
              Send money securely to another SmartBank account.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 bg-white border border-emerald-100 rounded-full px-4 py-2 text-sm text-emerald-700 shadow-sm">
            <ShieldCheck size={17} />
            Secure Transfer
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Transfer Form */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-7">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <ArrowLeftRight size={24} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#12372a]">Send Money</h2>
                <p className="text-sm text-slate-500">
                  Enter transfer details below.
                </p>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-5 text-sm">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            {success && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-xl mb-5">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle size={19} />
                  Transfer Successful!
                </div>

                <p className="text-sm mt-2">
                  ₹{formatAmount(success.amount)} transferred successfully.
                </p>

                <p className="text-xs mt-2 break-all">
                  Reference: {success.transactionReference}
                </p>

                <p className="text-sm mt-2">
                  Updated Balance: ₹{formatAmount(success.balanceAfter)}
                </p>
              </div>
            )}

            {accountsLoading ? (
              <p className="text-slate-500">Loading accounts...</p>
            ) : activeAccounts.length === 0 ? (
              <div className="bg-amber-50 border border-amber-100 text-amber-800 p-5 rounded-xl">
                <h3 className="font-bold">No active account found</h3>
                <p className="text-sm mt-2">
                  You need an approved active account to transfer money.
                </p>
                <Link
                  to="/accounts"
                  className="inline-block mt-3 font-semibold underline"
                >
                  View my accounts
                </Link>
              </div>
            ) : (
              <form onSubmit={handleTransfer} className="space-y-5">
                {/* Sender Account */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    From Account
                  </label>

                  <div className="relative">
                    <Wallet
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <select
                      value={senderAccountId}
                      onChange={(e) => {
                        setSenderAccountId(e.target.value);
                        setError("");
                        setSuccess(null);
                      }}
                      required
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-emerald-500"
                    >
                      {activeAccounts.map((account) => (
                        <option key={account.id} value={account.id}>
                          {account.accountType} - {account.accountNumber}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedAccount && (
                    <p className="text-sm text-slate-500 mt-2">
                      Available Balance:{" "}
                      <span className="font-bold text-emerald-700">
                        ₹{formatAmount(selectedAccount.balance)}
                      </span>
                    </p>
                  )}
                </div>

                {/* Receiver Account ID */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Receiver Account ID
                  </label>

                  <div className="relative">
                    <Hash
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="number"
                      min="1"
                      step="1"
                      placeholder="Enter receiver account ID"
                      value={receiverAccountId}
                      onChange={(e) => setReceiverAccountId(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-emerald-500"
                    />
                  </div>

                  <p className="text-xs text-slate-400 mt-2">
                    Enter the receiver's database account ID, not account
                    number.
                  </p>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Transfer Amount
                  </label>

                  <div className="relative">
                    <IndianRupee
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {[500, 1000, 2000, 5000].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setAmount(String(value))}
                        className="px-3 py-2 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg hover:bg-emerald-100"
                      >
                        ₹{value.toLocaleString("en-IN")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || !senderAccountId}
                  className="w-full flex items-center justify-center gap-3 bg-[#12372a] hover:bg-emerald-800 disabled:opacity-60 text-white font-semibold py-4 rounded-xl shadow-lg transition"
                >
                  {loading ? (
                    <>
                      <RefreshCw size={19} className="animate-spin" />
                      Processing Transfer...
                    </>
                  ) : (
                    <>
                      <Send size={19} />
                      Transfer Money
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Information */}
          <div className="space-y-5">
            <div className="bg-gradient-to-br from-[#12372a] to-emerald-700 text-white rounded-3xl p-7 shadow-lg">
              <div className="flex justify-between items-center">
                <p className="text-sm text-emerald-100">
                  Sender Account Balance
                </p>
                <Wallet size={23} />
              </div>

              <h2 className="text-3xl font-bold mt-5">
                ₹{formatAmount(selectedAccount?.balance)}
              </h2>

              <div className="border-t border-white/20 mt-6 pt-5">
                <p className="text-sm text-emerald-100">Account Number</p>
                <p className="font-semibold mt-1">
                  {selectedAccount?.accountNumber || "Select an account"}
                </p>

                <p className="text-sm text-emerald-100 mt-4">Account Type</p>
                <p className="font-semibold mt-1">
                  {selectedAccount?.accountType || "—"}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <ShieldCheck size={23} />
                </div>

                <h3 className="font-bold text-[#12372a]">
                  Banking with confidence
                </h3>
              </div>

              <div className="space-y-4 text-sm text-slate-500">
                <p className="flex items-center gap-2">
                  <CheckCircle size={17} className="text-emerald-600" />
                  Only active accounts can send transfers.
                </p>

                <p className="flex items-center gap-2">
                  <CheckCircle size={17} className="text-emerald-600" />
                  Insufficient balance transfers are rejected.
                </p>

                <p className="flex items-center gap-2">
                  <CheckCircle size={17} className="text-emerald-600" />
                  Every transaction is recorded securely.
                </p>

                <p className="flex items-center gap-2">
                  <CheckCircle size={17} className="text-emerald-600" />
                  Updated balance is fetched from the server.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={loadAccounts}
              disabled={accountsLoading || loading}
              className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl py-3 font-semibold text-sm disabled:opacity-50"
            >
              <RefreshCw size={16} />
              Refresh Accounts
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-8">
          © 2026 SmartBank. Banking made simple and secure.
        </p>
      </div>
    </div>
  );
}

export default Transfer;

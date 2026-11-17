import { useEffect, useState } from "react";
import { createAccount, getMyAccounts } from "../services/accountService";

function MyAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [accountType, setAccountType] = useState("SAVINGS");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchAccounts = async () => {
    try {
      setError("");
      const data = await getMyAccounts();
      setAccounts(data);
    } catch (err) {
      setError(err.message || "Unable to fetch accounts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleCreateAccount = async (e) => {
    e.preventDefault();

    try {
      setCreating(true);
      setError("");
      setMessage("");

      await createAccount(accountType);

      setMessage(
        "Account request submitted successfully! Waiting for admin approval.",
      );
      await fetchAccounts();
    } catch (err) {
      setError(err.message || "Unable to create account.");
    } finally {
      setCreating(false);
    }
  };

  const formatBalance = (balance) =>
    Number(balance || 0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-[#12372a]">My Accounts</h1>
          <p className="text-slate-500 mt-2">Manage your SmartBank accounts.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl">{error}</div>
        )}

        {message && (
          <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl">
            {message}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-5">
          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <p className="text-slate-500">Total Accounts</p>
            <h2 className="text-3xl font-bold text-[#12372a] mt-2">
              {accounts.length}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm">
            <p className="text-slate-500">Total Balance</p>
            <h2 className="text-3xl font-bold text-[#12372a] mt-2">
              {formatBalance(
                accounts.reduce(
                  (total, account) => total + Number(account.balance || 0),
                  0,
                ),
              )}
            </h2>
          </div>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold text-[#12372a] mb-5">
            Create New Bank Account
          </h2>

          <form onSubmit={handleCreateAccount}>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Select Account Type
            </label>

            <select
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
              className="w-full md:w-1/2 border border-slate-200 rounded-xl p-3 mb-5"
            >
              <option value="SAVINGS">Savings Account</option>
              <option value="CURRENT">Current Account</option>
              <option value="SALARY">Salary Account</option>
            </select>

            <p className="text-sm text-slate-500 mb-5">
              Your new account will require admin approval before activation.
            </p>

            <button
              type="submit"
              disabled={creating}
              className="bg-[#12372a] hover:bg-emerald-800 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-60"
            >
              {creating ? "Creating..." : "Create Account"}
            </button>
          </form>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold text-[#12372a] mb-5">
            Your Bank Accounts
          </h2>

          {loading ? (
            <p className="text-slate-500">Loading accounts...</p>
          ) : accounts.length === 0 ? (
            <p className="text-slate-500">
              No bank accounts found. Create your first account above.
            </p>
          ) : (
            <div className="space-y-4">
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className="border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div>
                    <h3 className="font-bold text-[#12372a]">
                      {account.accountType} Account
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      Account No: {account.accountNumber}
                    </p>
                    <p className="font-semibold mt-2">
                      {formatBalance(account.balance)}
                    </p>
                  </div>

                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold w-fit ${
                      account.status === "ACTIVE"
                        ? "bg-emerald-100 text-emerald-700"
                        : account.status === "PENDING"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {account.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyAccounts;

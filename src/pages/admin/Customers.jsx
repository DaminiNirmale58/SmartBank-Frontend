import { useEffect, useMemo, useState } from "react";
import { Users, Search, RefreshCw, Eye, X, AlertCircle } from "lucide-react";

import { getAllCustomers, getCustomerById } from "../../services/adminService";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllCustomers();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load customers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const value = search.toLowerCase().trim();

    return customers.filter((customer) =>
      [customer.fullName, customer.email, customer.id, customer.role]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(value)),
    );
  }, [customers, search]);

  const handleViewDetails = async (customerId) => {
    try {
      setDetailsLoading(true);
      setSelectedCustomer(null);

      const data = await getCustomerById(customerId);
      setSelectedCustomer(data);
    } catch (err) {
      setError(err.message || "Unable to load customer details.");
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Customers</h1>
          <p className="text-sm text-gray-500 mt-1">
            View and manage SmartBank customers.
          </p>
        </div>

        <button
          onClick={fetchCustomers}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#12372a] text-white hover:bg-[#1b4d3b] disabled:opacity-60 transition"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Customer Count */}
      <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-5 flex items-center gap-4">
        <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
          <Users size={26} />
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Customers</p>
          <h2 className="text-2xl font-bold text-gray-800">
            {loading ? "..." : customers.length}
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

      {/* Customer Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Customer List</h2>
            <p className="text-sm text-gray-500 mt-1">
              All registered customers.
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
              placeholder="Search name, email or ID..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading customers...
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            {search
              ? "No matching customers found."
              : "No customers available."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-5 py-4 font-semibold">Customer ID</th>
                  <th className="px-5 py-4 font-semibold">Full Name</th>
                  <th className="px-5 py-4 font-semibold">Email Address</th>
                  <th className="px-5 py-4 font-semibold">Role</th>
                  <th className="px-5 py-4 font-semibold">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-4 font-medium text-gray-700">
                      SB-{customer.id}
                    </td>

                    <td className="px-5 py-4 font-semibold text-gray-800">
                      {customer.fullName}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {customer.email}
                    </td>

                    <td className="px-5 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                        {customer.role}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleViewDetails(customer.id)}
                        className="flex items-center gap-2 text-green-700 hover:text-green-900 font-medium"
                      >
                        <Eye size={16} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && (
          <div className="px-5 py-4 border-t border-gray-100 text-sm text-gray-500">
            Showing {filteredCustomers.length} of {customers.length} customers
          </div>
        )}
      </div>

      {/* Customer Details Modal */}
      {(selectedCustomer || detailsLoading) && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                Customer Details
              </h2>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            {detailsLoading ? (
              <p className="text-center py-8 text-gray-500">
                Loading customer details...
              </p>
            ) : selectedCustomer ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b">
                  <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xl font-bold">
                    {selectedCustomer.fullName?.charAt(0)?.toUpperCase() || "C"}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">
                      {selectedCustomer.fullName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Customer ID: SB-{selectedCustomer.id}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Full Name</p>
                  <p className="font-medium text-gray-800">
                    {selectedCustomer.fullName || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Email Address</p>
                  <p className="font-medium text-gray-800 break-all">
                    {selectedCustomer.email || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Role</p>
                  <p className="font-medium text-gray-800">
                    {selectedCustomer.role || "N/A"}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="w-full mt-3 py-2.5 rounded-lg bg-[#12372a] text-white hover:bg-[#1b4d3b]"
                >
                  Close
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

export default Customers;

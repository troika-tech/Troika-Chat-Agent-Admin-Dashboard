import React, { useState, useEffect } from "react";
import { Loader2, Search, Calendar, User, Building2, Bot, TrendingUp, Filter, X, History as HistoryIcon } from "lucide-react";
import { toast } from "react-toastify";
import { fetchCompaniesWithChatbots, getCompanyCreditHistory } from "../services/api";
import { useAuth } from "../context/AuthContext";

const CreditHistoryPage = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [creditHistory, setCreditHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [expandedRows, setExpandedRows] = useState(new Set());

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all companies with their chatbots
      const companiesResponse = await fetchCompaniesWithChatbots();
      const companiesData = companiesResponse.data?.companies || companiesResponse.data?.data?.companies || [];
      console.log("Companies fetched:", companiesData.length);
      setCompanies(companiesData);

      if (companiesData.length === 0) {
        console.log("No companies found");
        setCreditHistory([]);
        setLoading(false);
        return;
      }

      // Fetch credit history for all companies in parallel
      const historyPromises = companiesData.map(async (company) => {
        try {
          const historyResponse = await getCompanyCreditHistory(company._id);
          console.log(`History response for company ${company._id} (${company.name}):`, historyResponse);
          
          // Response structure: { success: true, data: { history: [...] }, message: "..." }
          const history = historyResponse.data?.data?.history || [];
          
          console.log(`History for company ${company.name} (${company._id}):`, history.length, "entries");
          
          if (history.length === 0) {
            return [];
          }
          
          return history.map((entry) => ({
            ...entry,
            companyId: company._id,
            companyName: company.name,
            chatbots: company.chatbots || [],
          }));
        } catch (error) {
          console.error(`Failed to fetch history for company ${company._id} (${company.name}):`, error);
          console.error("Error details:", error.response?.data || error.message);
          return [];
        }
      });

      const allHistory = (await Promise.all(historyPromises)).flat();
      console.log("Total history entries:", allHistory.length);
      
      // Sort by date (newest first)
      allHistory.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setCreditHistory(allHistory);
    } catch (error) {
      console.error("Failed to fetch credit history:", error);
      toast.error("Failed to load credit history");
    } finally {
      setLoading(false);
    }
  };

  // Filter credit history based on search, company, and date filters
  const filteredHistory = creditHistory.filter((entry) => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        entry.companyName?.toLowerCase().includes(searchLower) ||
        entry.admin_email?.toLowerCase().includes(searchLower) ||
        entry.reason?.toLowerCase().includes(searchLower) ||
        entry.chatbots?.some((cb) => cb.name?.toLowerCase().includes(searchLower));
      if (!matchesSearch) return false;
    }

    // Company filter
    if (selectedCompany !== "all" && entry.companyId !== selectedCompany) {
      return false;
    }

    // Date filter
    if (dateFilter !== "all") {
      const entryDate = new Date(entry.created_at);
      const now = new Date();
      const daysAgo = parseInt(dateFilter);

      if (daysAgo === 7) {
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (entryDate < sevenDaysAgo) return false;
      } else if (daysAgo === 30) {
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        if (entryDate < thirtyDaysAgo) return false;
      } else if (daysAgo === 90) {
        const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        if (entryDate < ninetyDaysAgo) return false;
      }
    }

    return true;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleRowExpansion = (index) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRows(newExpanded);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCompany("all");
    setDateFilter("all");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading credit history...</span>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#1e3a8a] mb-2">Credit History</h1>
        <p className="text-gray-600">View credit transaction history for all chatbots</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by company, chatbot, admin email, or reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
            />
          </div>

          {/* Company Filter */}
          <div className="w-full md:w-64">
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
            >
              <option value="all">All Companies</option>
              {companies.map((company) => (
                <option key={company._id} value={company._id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div className="w-full md:w-48">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
            >
              <option value="all">All Time</option>
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
            </select>
          </div>

          {/* Clear Filters */}
          {(searchTerm || selectedCompany !== "all" || dateFilter !== "all") && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-2"
            >
              <X size={18} />
              Clear
            </button>
          )}
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredHistory.length} of {creditHistory.length} transactions
        </div>
      </div>

      {/* Credit History Table */}
      {filteredHistory.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200">
          <HistoryIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-2">
            {creditHistory.length === 0
              ? "No credit history found"
              : "No transactions match your filters"}
          </p>
          {creditHistory.length === 0 && companies.length > 0 && (
            <p className="text-gray-500 text-sm mt-2">
              Credit history will appear here when admins add or update credits for companies.
              <br />
              Go to "Manage Chatbots" to add credits to a company.
            </p>
          )}
          {companies.length === 0 && (
            <p className="text-gray-500 text-sm mt-2">
              No companies found. Create a company first to track credit history.
            </p>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] text-white uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Date & Time</th>
                  <th className="px-4 py-3 text-left font-semibold">Company</th>
                  <th className="px-4 py-3 text-left font-semibold">Chatbots</th>
                  <th className="px-4 py-3 text-center font-semibold">Credits Added</th>
                  <th className="px-4 py-3 text-center font-semibold">Previous State</th>
                  <th className="px-4 py-3 text-center font-semibold">New State</th>
                  <th className="px-4 py-3 text-left font-semibold">Admin</th>
                  <th className="px-4 py-3 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredHistory.map((entry, idx) => {
                  const isExpanded = expandedRows.has(idx);
                  return (
                    <React.Fragment key={`${entry._id || entry.companyId}-${idx}`}>
                      <tr
                        className={`hover:bg-gray-50 cursor-pointer ${
                          idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                        onClick={() => toggleRowExpansion(idx)}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="text-gray-400" size={16} />
                            <span className="font-medium">{formatDate(entry.created_at)}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Building2 className="text-gray-400" size={16} />
                            <span className="font-medium">{entry.companyName || "—"}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Bot className="text-gray-400" size={16} />
                            <span className="text-gray-700">
                              {entry.chatbots && entry.chatbots.length > 0
                                ? entry.chatbots.map((cb) => cb.name).join(", ")
                                : "—"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full font-semibold">
                            <TrendingUp size={14} />
                            +{entry.credits_added || 0}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center text-xs text-gray-600">
                          <div>Total: {entry.previous_total_credits || 0}</div>
                          <div>Used: {entry.previous_used_credits || 0}</div>
                          <div>Remaining: {entry.previous_remaining_credits || 0}</div>
                        </td>
                        <td className="px-4 py-3 text-center text-xs font-semibold text-blue-700">
                          <div>Total: {entry.new_total_credits || 0}</div>
                          <div>Used: {entry.new_used_credits || 0}</div>
                          <div>Remaining: {entry.new_remaining_credits || 0}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <User className="text-gray-400" size={16} />
                            <span className="text-gray-700">
                              {entry.admin_email || entry.admin_id?.email || "—"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button className="text-blue-600 hover:text-blue-800 font-medium">
                            {isExpanded ? "Hide" : "View"}
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-blue-50">
                          <td colSpan="8" className="px-4 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold text-gray-700 mb-2">Previous State</h4>
                                <div className="bg-white rounded p-3 space-y-1 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Total Credits:</span>
                                    <span className="font-medium">{entry.previous_total_credits || 0}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Used Credits:</span>
                                    <span className="font-medium text-orange-600">
                                      {entry.previous_used_credits || 0}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Remaining Credits:</span>
                                    <span className="font-medium text-green-600">
                                      {entry.previous_remaining_credits || 0}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-700 mb-2">New State</h4>
                                <div className="bg-white rounded p-3 space-y-1 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Total Credits:</span>
                                    <span className="font-medium text-blue-700">
                                      {entry.new_total_credits || 0}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Used Credits:</span>
                                    <span className="font-medium">
                                      {entry.new_used_credits || 0}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Remaining Credits:</span>
                                    <span className="font-medium text-green-600">
                                      {entry.new_remaining_credits || 0}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              {entry.reason && (
                                <div className="md:col-span-2">
                                  <h4 className="font-semibold text-gray-700 mb-2">Reason/Note</h4>
                                  <div className="bg-white rounded p-3 text-sm text-gray-700">
                                    {entry.reason}
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditHistoryPage;


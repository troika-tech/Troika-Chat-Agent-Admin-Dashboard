import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import leadsService from "../services/leadsService";
import {
  BarChart3,
  Users,
  Target,
  Activity,
  Zap,
  Globe,
  Brain,
  RefreshCw,
  Filter,
  Search,
  Download,
  Eye,
  Mail,
  Phone,
  Calendar,
  Star,
  Tag,
  Languages,
  BrainCircuit,
} from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

// Skeleton Loader Components
const CardSkeleton = () => (
  <div className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
    <div className="flex items-center gap-2 mb-4">
      <div className="w-8 h-8 bg-gray-200 rounded-md"></div>
      <div className="h-4 bg-gray-200 rounded-full w-1/2"></div>
    </div>
    <div className="space-y-3">
      <div className="h-6 bg-gray-200 rounded-full w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded-full w-1/2"></div>
    </div>
  </div>
);

const TableSkeleton = () => (
  <div className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
    <div className="h-6 bg-gray-200 rounded-full w-1/3 mb-6"></div>
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded-full w-1/4"></div>
            <div className="h-3 bg-gray-200 rounded-full w-1/2"></div>
          </div>
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
        </div>
      ))}
    </div>
  </div>
);

const LeadsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [health, setHealth] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [companyId, setCompanyId] = useState(null);
  const [daysFilter, setDaysFilter] = useState(30);
  const [searchTerm, setSearchTerm] = useState("");
  const [confidenceFilter, setConfidenceFilter] = useState("");
  const [showGuests, setShowGuests] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [exporting, setExporting] = useState(false);

  const limit = 10;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
      return;
    }

    // Get company ID from user data
    fetchCompanyData();
  }, []);

  // Refetch data when filters change
  useEffect(() => {
    if (companyId) {
      const timeout = setTimeout(() => {
        fetchAllData(companyId);
      }, 300); // 300ms debounce

      return () => clearTimeout(timeout);
    }
  }, [searchTerm, confidenceFilter, daysFilter, showGuests]);

  const fetchCompanyData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://api.0804.in/api/user/company", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setCompanyId(data.chatbot_id);
      if (data.chatbot_id) {
        await fetchAllData(data.chatbot_id);
      }
    } catch (error) {
      console.error("Error fetching company data:", error);
      toast.error("Failed to load company data");
    }
  };

  const fetchAllData = async (companyId) => {
    setLoading(true);
    try {
      // Use real API
      const data = await leadsService.getAllData(companyId, daysFilter, {
        page: currentPage,
        limit,
        search: searchTerm,
        confidence: confidenceFilter,
      });

      setAnalytics(data.analytics.data);
      setMetrics(data.metrics.data);
      setHealth(data.health.data);
      
      // Filter leads based on guest status
      let filteredLeads = data.leads.data?.leads || [];
      
      // Filter by guest status
      if (!showGuests) {
        filteredLeads = filteredLeads.filter(lead => !lead.isGuest && (lead.email || lead.phone));
      }
      
      setLeads(filteredLeads);
      setTotalPages(data.leads.data?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching leads data:", error);
      toast.error("Failed to load leads data");
    } finally {
      setLoading(false);
    }
  };

  const handleProcessBatches = async () => {
    setProcessing(true);
    try {
      await leadsService.processBatches();
      toast.success("Batches processed successfully");
      if (companyId) {
        await fetchAllData(companyId);
      }
    } catch (error) {
      console.error("Error processing batches:", error);
      toast.error("Failed to process batches");
    } finally {
      setProcessing(false);
    }
  };

  const handleExportLeads = async () => {
    if (!companyId) {
      toast.error("Company ID not found");
      return;
    }

    setExporting(true);
    try {
      // Prepare export parameters
      const exportParams = {
        companyId: companyId,
        confidence: confidenceFilter || undefined,
        startDate: new Date(Date.now() - daysFilter * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date().toISOString(),
      };

      // Remove undefined values
      Object.keys(exportParams).forEach(key => {
        if (exportParams[key] === undefined) {
          delete exportParams[key];
        }
      });

      const response = await leadsService.exportLeads(exportParams);
      
      // Create blob and download
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `leads-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("Leads exported successfully");
    } catch (error) {
      console.error("Error exporting leads:", error);
      toast.error("Failed to export leads");
    } finally {
      setExporting(false);
    }
  };


  const getConfidenceColor = (confidence) => {
    switch (confidence) {
      case "high":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getInterestLevelColor = (level) => {
    switch (level) {
      case "hot":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };


  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl ml-64 mx-auto p-6 sm:p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <CardSkeleton />
            <CardSkeleton />
          </div>
          <TableSkeleton />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl ml-64 mx-auto p-6 sm:p-10 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Leads Dashboard</h1>
            <p className="text-gray-600 mt-2">Monitor and manage your lead generation</p>
          </div>
          <div className="flex gap-3">
            <select
              value={daysFilter}
              onChange={(e) => setDaysFilter(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
            <button
              onClick={handleExportLeads}
              disabled={exporting}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className={`w-4 h-4 ${exporting ? "animate-pulse" : ""}`} />
              {exporting ? "Exporting..." : "Export CSV"}
            </button>
            <button
              onClick={handleProcessBatches}
              disabled={processing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${processing ? "animate-spin" : ""}`} />
              Process Batches
            </button>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Total Leads</h3>
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {analytics?.summary?.totalLeads || 0}
            </div>
            <p className="text-sm text-gray-600">
              {analytics?.summary?.period || "30 days"}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-green-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">High Confidence</h3>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {analytics?.confidenceBreakdown?.high || 0}
            </div>
            <p className="text-sm text-gray-600">High quality leads</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-purple-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">AI Analysis</h3>
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {analytics?.aiAnalysis?.total || 0}
            </div>
            <p className="text-sm text-gray-600">
              {analytics?.aiAnalysis?.legitimate || 0} legitimate
            </p>
          </div>

        </div>

        {/* Charts and Breakdowns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Confidence Breakdown */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Confidence Breakdown
            </h3>
            <div className="space-y-4">
              {analytics?.confidenceBreakdown && Object.entries(analytics.confidenceBreakdown).map(([level, count]) => (
                <div key={level} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      level === 'high' ? 'bg-green-500' : 
                      level === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span className="capitalize font-medium">{level} confidence</span>
                  </div>
                  <span className="font-bold text-lg">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Tag className="w-5 h-5 text-purple-600" />
              Category Breakdown
            </h3>
            <div className="space-y-4">
              {analytics?.categoryBreakdown && Object.entries(analytics.categoryBreakdown).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="capitalize font-medium text-sm">
                    {category.replace('_', ' ')}
                  </span>
                  <span className="font-bold text-lg">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>



        {/* Leads Table */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Recent Leads
            </h3>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={confidenceFilter}
                onChange={(e) => setConfidenceFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Confidence</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <button
                onClick={() => setShowGuests(!showGuests)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  showGuests 
                    ? "bg-orange-100 text-orange-800 border border-orange-200" 
                    : "bg-gray-100 text-gray-600 border border-gray-200"
                }`}
              >
                <Users className="w-4 h-4" />
                {showGuests ? "Hide Guests" : "Show Guests"}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Lead</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Score</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Interest</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Confidence</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Created</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => {
                  const isGuest = lead.isGuest || (!lead.email && !lead.phone);
                  return (
                    <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-gray-900 flex items-center gap-2">
                            {isGuest ? (
                              <>
                                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                                  Guest
                                </span>
                                <span>Guest User</span>
                              </>
                            ) : (
                              lead.email || lead.phone || 'Unknown'
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {isGuest ? `Session: ${lead.sessionId}` : lead.company}
                          </div>
                          <div className="text-xs text-gray-400 mt-1 flex gap-3">
                            {isGuest ? (
                              <span className="flex items-center gap-1 text-orange-600">
                                <Users className="w-3 h-3" />
                                Guest Session
                              </span>
                            ) : (
                              <>
                                {lead.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />Email</span>}
                                {lead.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />Phone</span>}
                              </>
                            )}
                          </div>
                        </div>
                      </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${lead.leadScore || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{lead.leadScore || 0}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getInterestLevelColor(lead.interestLevel)}`}>
                        {lead.interestLevel || 'N/A'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(lead.confidence)}`}>
                        {lead.confidence || 'N/A'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-600 capitalize">
                        {lead.category?.replace('_', ' ') || 'N/A'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-600">
                        {dayjs(lead.createdAt).fromNow()}
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {leads.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No leads found</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default LeadsPage;

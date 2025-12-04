import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { assignCompanyCredits, getCompanyCreditBalance, addCompanyCredits, removeCompanyCredits } from "../services/api";
import MessageHistory from "../components/MessageHistory";
import EditClientConfigModal from "../components/EditClientConfigModal";
import { toast } from "react-toastify";
import {
  Search,
  Copy,
  FileText,
  History,
  RefreshCw,
  Settings,
  Palette,
  Upload,
  Rocket,
  Building,
  Link,
  Pencil,
  Check,
  Save,
  Brain,
  Loader2,
  Undo2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext"; // 👈 1. Import useAuth

// --- Skeleton Components for Loading State ---
const StatSkeleton = () => (
  <div className="bg-white p-4 rounded-xl border border-gray-200/80">
    <div className="h-3 bg-gray-200 rounded-full w-24 mb-2 animate-pulse"></div>
    <div className="h-6 bg-gray-300 rounded-full w-20 animate-pulse"></div>
  </div>
);

const PlanDetailSkeleton = () => (
  <div>
    <div className="h-2.5 bg-gray-200 rounded-full w-16 mb-2 animate-pulse"></div>
    <div className="h-4 bg-gray-300 rounded-full w-20 animate-pulse"></div>
  </div>
);

const ChatbotCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-md p-6 lg:p-8 border border-gray-200/80">
    {/* Header Skeleton */}
    <div className="mb-8">
      <div className="h-6 bg-gray-300 rounded-full w-1/2 mb-3 animate-pulse"></div>
      <div className="flex items-center gap-x-6">
        <div className="h-4 bg-gray-200 rounded-full w-1/4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded-full w-1/3 animate-pulse"></div>
      </div>
    </div>
    {/* Stats Skeleton */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <StatSkeleton />
      <StatSkeleton />
      <StatSkeleton />
      <StatSkeleton />
    </div>
    {/* Token Limit Skeleton */}
    <div className="mb-8">
      <div className="h-3 bg-gray-200 rounded-full w-32 mb-2 animate-pulse"></div>
      <div className="h-8 bg-gray-300 rounded-full w-48 animate-pulse"></div>
    </div>
    {/* Plan Details Skeleton */}
    <div className="mb-8">
      <div className="h-4 bg-gray-200 rounded-full w-32 mb-2 animate-pulse"></div>
      <div className="h-3 bg-gray-200 rounded-full w-48 mb-4 animate-pulse"></div>
      <div className="bg-white p-4 rounded-xl border border-gray-200/80">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 text-sm">
          <PlanDetailSkeleton />
          <PlanDetailSkeleton />
          <PlanDetailSkeleton />
          <PlanDetailSkeleton />
          <PlanDetailSkeleton />
          <PlanDetailSkeleton />
        </div>
      </div>
    </div>
  </div>
);
// --- End Skeleton Components ---

const MODAL_TYPES = {
  NONE: null,
  MESSAGE_HISTORY: "message_history",
  CONFIG: "config",
  PERSONA: "persona",
};

const ManageChatbotsPage = () => {
  const navigate = useNavigate();
  const [chatbots, setChatbots] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(MODAL_TYPES.NONE);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [renewing, setRenewing] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [availablePlans, setAvailablePlans] = useState([]);
  const [editingCreditsFor, setEditingCreditsFor] = useState(null);
  const [newCredits, setNewCredits] = useState("");
  const [companyCredits, setCompanyCredits] = useState({}); // { companyId: { total, used, remaining } }
  // Add/Remove credit modal state
  const [showAddCreditModal, setShowAddCreditModal] = useState(false);
  const [showRemoveCreditModal, setShowRemoveCreditModal] = useState(false);
  const [selectedCompanyForCredit, setSelectedCompanyForCredit] = useState(null);
  const [creditAmount, setCreditAmount] = useState("");
  const [creditReason, setCreditReason] = useState("");
  const [processingCredit, setProcessingCredit] = useState(false);

  // Persona modal state
  const [personaLoading, setPersonaLoading] = useState(false);
  const [personaSaving, setPersonaSaving] = useState(false);
  const [personaDraft, setPersonaDraft] = useState("");
  const [personaOriginal, setPersonaOriginal] = useState("");

  const { token } = useAuth(); // 👈 2. Get token from context

  const fetchAllData = async () => {
    if (!token) return; // Don't fetch if no token
    setLoading(true);

    try {
      // Fetch subscriptions and plans in parallel
      const [subsResponse, plansResponse] = await Promise.all([
        api.get("/subscriptions", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("/plans", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const uniqueSubs = Array.from(
        new Map(
          subsResponse.data.subscriptions.map((sub) => [sub.chatbot_id._id, sub])
        ).values()
      );

      setChatbots(uniqueSubs || []);

      // Fetch company credit balances for all unique companies
      const companyIds = [...new Set(
        uniqueSubs
          .map(sub => {
            const companyId = sub.chatbot_id?.company_id;
            // Handle both string and ObjectId formats
            return companyId ? String(companyId) : null;
          })
          .filter(Boolean)
      )];
      
      const creditPromises = companyIds.map(async (companyId) => {
        try {
          const creditRes = await getCompanyCreditBalance(companyId);
          return { companyId, credits: creditRes.data?.data || creditRes.data };
        } catch (err) {
          console.error(`Failed to fetch credits for company ${companyId}:`, err);
          return { companyId, credits: { total: 0, used: 0, remaining: 0 } };
        }
      });
      const creditResults = await Promise.all(creditPromises);
      const creditsMap = {};
      creditResults.forEach(({ companyId, credits }) => {
        creditsMap[companyId] = credits;
      });
      setCompanyCredits(creditsMap);

      setAvailablePlans(plansResponse.data.plans || []);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      toast.error("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [token]); // 👈 3. Re-run when token is available

  const handleUpdateCredits = async (companyId) => {
    if (!companyId) {
      toast.error("Company ID is missing. Cannot update credits.");
      return;
    }

    try {
      const credits = parseInt(newCredits, 10);
      if (isNaN(credits) || credits < 0) {
        toast.error("Please enter a valid credit amount");
        return;
      }

      await assignCompanyCredits(String(companyId), credits, "Admin credit adjustment");
      
      // Update local state - credits are reset, so used = 0, remaining = total
      setCompanyCredits((prev) => ({
        ...prev,
        [companyId]: {
          total: credits,
          used: 0, // Reset to 0
          remaining: credits // Remaining = total after reset
        }
      }));

      toast.success("Credits updated successfully!");
      setEditingCreditsFor(null);
      setNewCredits("");
    } catch (err) {
      console.error("Failed to update credits:", err);
      toast.error("Failed to update credits. Please try again.");
    }
  };

  const handleAddCredits = async () => {
    if (!selectedCompanyForCredit) {
      toast.error("Company ID is missing.");
      return;
    }

    const credits = parseInt(creditAmount, 10);
    if (isNaN(credits) || credits <= 0) {
      toast.error("Please enter a valid credit amount (greater than 0)");
      return;
    }

    setProcessingCredit(true);
    try {
      const result = await addCompanyCredits(String(selectedCompanyForCredit), credits, creditReason || "Credits added by admin");
      
      // Update local state with new credit values
      const currentCredits = companyCredits[selectedCompanyForCredit] || { total: 0, used: 0, remaining: 0 };
      setCompanyCredits((prev) => ({
        ...prev,
        [selectedCompanyForCredit]: {
          total: result.data.data.total_credits,
          used: result.data.data.used_credits,
          remaining: result.data.data.remaining_credits
        }
      }));

      toast.success(`${credits} credits added successfully!`);
      setShowAddCreditModal(false);
      setCreditAmount("");
      setCreditReason("");
      setSelectedCompanyForCredit(null);
    } catch (err) {
      console.error("Failed to add credits:", err);
      toast.error(err.response?.data?.message || "Failed to add credits.");
    } finally {
      setProcessingCredit(false);
    }
  };

  const handleRemoveCredits = async () => {
    if (!selectedCompanyForCredit) {
      toast.error("Company ID is missing.");
      return;
    }

    const credits = parseInt(creditAmount, 10);
    if (isNaN(credits) || credits <= 0) {
      toast.error("Please enter a valid credit amount (greater than 0)");
      return;
    }

    const currentCredits = companyCredits[selectedCompanyForCredit] || { total: 0, used: 0, remaining: 0 };
    if (credits > currentCredits.remaining) {
      toast.error(`Cannot remove ${credits} credits. Only ${currentCredits.remaining} credits remaining.`);
      return;
    }

    setProcessingCredit(true);
    try {
      const result = await removeCompanyCredits(String(selectedCompanyForCredit), credits, creditReason || "Credits removed by admin");
      
      // Update local state with new credit values
      setCompanyCredits((prev) => ({
        ...prev,
        [selectedCompanyForCredit]: {
          total: result.data.data.total_credits,
          used: result.data.data.used_credits,
          remaining: result.data.data.remaining_credits
        }
      }));

      toast.success(`${credits} credits removed successfully!`);
      setShowRemoveCreditModal(false);
      setCreditAmount("");
      setCreditReason("");
      setSelectedCompanyForCredit(null);
    } catch (err) {
      console.error("Failed to remove credits:", err);
      toast.error(err.response?.data?.message || "Failed to remove credits.");
    } finally {
      setProcessingCredit(false);
    }
  };

  const handleRenew = async (id) => {
    const planDetails = availablePlans.find((p) => p._id === selectedPlan);
    if (!selectedPlan || !planDetails) {
      toast.error("Please select a valid plan.");
      return;
    }
    const durationDays = planDetails.duration_days || 30;
    const months = Math.ceil(durationDays / 30);
    try {
      await api.post(
        `/chatbot/${id}/renew`,
        { plan_id: selectedPlan, months },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("✅ Plan renewed successfully");
      fetchAllData(); // Refresh all data
      setRenewing(null);
    } catch (err) {
      console.error("Renewal error:", err);
      toast.error("❌ Renewal failed");
    }
  };

  const handleDownloadReport = async (chatbotId) => {
    try {
      setIsDownloading(true);
      const response = await api.get(`/chatbot/download/${chatbotId}`, {
        responseType: "blob",
        headers: { Authorization: `Bearer ${token}` },
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${chatbotId}-report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Failed to download report:", err);
      toast.error("❌ Failed to download report. Try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  // PERSONA: open modal + fetch
  const openPersonaModal = async (chatbot) => {
    setSelected(chatbot);
    setShowModal(MODAL_TYPES.PERSONA);
    setPersonaLoading(true);
    setPersonaDraft("");
    setPersonaOriginal("");
    try {
      // 👉 API endpoint here
      const res = await api.get(`/chatbot/${chatbot._id}/persona`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const persona = res?.data?.persona ?? "";
      setPersonaDraft(persona);
      setPersonaOriginal(persona);
    } catch (err) {
      console.error("Failed to fetch persona:", err);
      toast.error("Couldn't fetch persona.");
    } finally {
      setPersonaLoading(false);
    }
  };

  // PERSONA: save
  const savePersona = async () => {
    if (!selected?._id) return;
    setPersonaSaving(true);
    try {
      // 👉 API endpoint here
      await api.put(
        `/chatbot/${selected._id}/persona`,
        { persona: personaDraft },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPersonaOriginal(personaDraft);
      toast(<CustomSuccessToast text="Persona saved!" />);
    } catch (err) {
      console.error("Failed to save persona:", err);
      toast.error("Saving persona failed.");
    } finally {
      setPersonaSaving(false);
    }
  };

  const closeAnyModal = () => {
    setShowModal(MODAL_TYPES.NONE);
    setSelected(null);
  };

  const resetPersonaToFetched = () => setPersonaDraft(personaOriginal);

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#1e3a8a] flex items-center gap-3">
          <Rocket className="text-[#1e3a8a]" />
          Manage Chatbots
        </h1>
        <div className="flex items-center gap-4 mt-4 sm:mt-0 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search chatbots..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] shadow-sm"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[#1e3a8a] text-white font-semibold rounded-lg hover:bg-[#1e40af] transition-colors shadow-md">
            <Upload size={16} />
            Upload
          </button>
        </div>
      </header>

      {/* --- 4. Conditional Rendering for Loading State --- */}
      {loading ? (
        <div className="space-y-8">
          <ChatbotCardSkeleton />
          <ChatbotCardSkeleton />
        </div>
      ) : (
        <div className="space-y-8">
          {chatbots.length > 0 ? (
            chatbots
              .filter((sub) =>
                sub.chatbot_id.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((sub) => {
                const cb = sub.chatbot_id;
                const plan = sub.plan_id;
                // Handle both string and ObjectId formats, convert to string for consistency
                const companyId = cb.company_id ? String(cb.company_id) : null;
                const credits = companyId ? (companyCredits[companyId] || { total: 0, used: 0, remaining: 0 }) : { total: 0, used: 0, remaining: 0 };

                return (
                  <div
                    key={cb._id}
                    className="bg-white rounded-xl shadow-lg p-6 lg:p-8 border border-gray-200 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="mb-8">
                      <h2 className="text-xl font-bold text-[#1e3a8a]">
                        {cb.name}
                      </h2>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm mt-2">
                        <span className="flex items-center gap-1.5 text-gray-500">
                          <Building size={14} />
                          {cb.company_name}
                        </span>
                        <a
                          href={`https://${cb.company_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-[#1e3a8a] hover:text-[#2563eb] hover:underline underline-offset-4 transition-colors"
                        >
                          <Link size={14} />
                          {cb.company_url}
                        </a>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      <Stat
                        label="CREDITS USED"
                        value={new Intl.NumberFormat("en-IN").format(
                          credits.used || 0
                        )}
                      />
                      <Stat
                        label="TOTAL MESSAGES"
                        value={new Intl.NumberFormat("en-IN").format(
                          cb.total_messages || 0
                        )}
                      />
                      <Stat
                        label="UNIQUE USERS"
                        value={new Intl.NumberFormat("en-IN").format(
                          cb.unique_users || 0
                        )}
                      />
                      <Stat
                        label="REMAINING CREDITS"
                        value={new Intl.NumberFormat("en-IN").format(
                          credits.remaining || 0
                        )}
                      />
                    </div>

                    {/* Total Credits UI - Commented out */}
                    {/* <div className="mb-8">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-500">
                            Total Credits
                          </p>
                          {editingCreditsFor !== companyId && companyId && (
                            <button
                              onClick={() => {
                                setEditingCreditsFor(companyId);
                                setNewCredits(credits.total || "");
                              }}
                            >
                              <Pencil
                                size={12}
                                className="text-gray-400 hover:text-blue-600"
                              />
                            </button>
                          )}
                        </div>
                        {editingCreditsFor !== companyId && companyId && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedCompanyForCredit(companyId);
                                setShowAddCreditModal(true);
                                setCreditAmount("");
                                setCreditReason("");
                              }}
                              className="px-3 py-1.5 text-xs font-medium bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-1"
                            >
                              <span>+</span> Add Credit
                            </button>
                            <button
                              onClick={() => {
                                setSelectedCompanyForCredit(companyId);
                                setShowRemoveCreditModal(true);
                                setCreditAmount("");
                                setCreditReason("");
                              }}
                              className="px-3 py-1.5 text-xs font-medium bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-1"
                            >
                              <span>−</span> Remove Credit
                            </button>
                          </div>
                        )}
                      </div>
                      {editingCreditsFor === companyId && companyId ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={newCredits}
                            onChange={(e) => setNewCredits(e.target.value)}
                            className="text-3xl font-bold text-gray-800 bg-slate-100 rounded-md p-1 w-full max-w-xs"
                            autoFocus
                          />
                          <button
                            onClick={() => handleUpdateCredits(companyId)}
                            className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            <Save size={20} />
                          </button>
                          <button
                            onClick={() => {
                              setEditingCreditsFor(null);
                              setNewCredits("");
                            }}
                            className="p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                          >
                            <span className="text-lg font-bold">&times;</span>
                          </button>
                        </div>
                      ) : (
                        <p className="text-3xl font-bold text-gray-800">
                          {new Intl.NumberFormat("en-IN").format(
                            credits.total || 0
                          )}
                        </p>
                      )}
                    </div> */}

                    {/* Credit Management Section - Prominent Add/Remove Buttons */}
                    {companyId && (
                      <div className="mb-8 bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold text-gray-700 mb-1">
                              Credit Management
                            </p>
                            <p className="text-xs text-gray-500">
                              Add or remove credits for this company
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => {
                                setSelectedCompanyForCredit(companyId);
                                setShowAddCreditModal(true);
                                setCreditAmount("");
                                setCreditReason("");
                              }}
                              className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2 shadow-sm"
                            >
                              <span className="text-lg">+</span> Add Credit
                            </button>
                            <button
                              onClick={() => {
                                setSelectedCompanyForCredit(companyId);
                                setShowRemoveCreditModal(true);
                                setCreditAmount("");
                                setCreditReason("");
                              }}
                              className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2 shadow-sm"
                            >
                              <span className="text-lg">−</span> Remove Credit
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mb-8">
                      <p className="font-semibold text-gray-800 mb-1">
                        Plan Details
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        Overview of your subscription
                      </p>
                      <div className="bg-white p-4 rounded-xl border border-gray-200/80">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 text-sm">
                          <PlanDetail label="NAME" value={plan?.name || "N/A"} />
                          <PlanDetail
                            label="DURATION"
                            value={`${plan?.duration_days || "N/A"} days`}
                          />
                          <PlanDetail
                            label="PRICE"
                            value={`₹${plan?.price || "N/A"}`}
                          />
                          <PlanDetail
                            label="MAX USERS"
                            value={plan?.max_users || "N/A"}
                          />
                          <PlanDetail
                            label="USERS USED"
                            value={`${cb.unique_users} / ${
                              plan?.max_users || "N/A"
                            }`}
                          />
                          <PlanDetail
                            label="EXPIRES"
                            value={
                              sub?.end_date
                                ? new Date(sub.end_date).toLocaleDateString()
                                : "N/A"
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-slate-100 p-3 rounded-lg border border-slate-200 mb-8">
                      <code className="text-xs text-gray-600 break-all mr-4">
                        {`<script src="https://api.0804.in/chatbot-loader/troika-loader.js" chatbot-id="${cb._id}" defer></script>`}
                      </code>
                      <button
                        onClick={() => {
                          const script = `<script src="https://api.0804.in/chatbot-loader/troika-loader" chatbot-id="${cb._id}" defer></script>`;
                          navigator.clipboard.writeText(script);
                          toast(<CustomSuccessToast text="Embed code copied" />);
                        }}
                        className="flex-shrink-0 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium flex items-center gap-2"
                      >
                        <Copy size={14} /> Copy
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-3">
                      <ActionButton
                        variant="outline"
                        onClick={() => {
                          setSelected(cb);
                          setShowModal(MODAL_TYPES.MESSAGE_HISTORY);
                        }}
                      >
                        <History size={16} /> Message History
                      </ActionButton>
                      <ActionButton
                        color="blue"
                        onClick={() => handleDownloadReport(cb._id)}
                        disabled={isDownloading}
                      >
                        <FileText size={16} />{" "}
                        {isDownloading ? "Downloading..." : "Report"}
                      </ActionButton>
                      <ActionButton
                        color="cyan"
                        onClick={() => setRenewing(cb._id)}
                      >
                        <RefreshCw size={16} /> Renew
                      </ActionButton>
                      <ActionButton
                        color="violet"
                        onClick={() => {
                          setSelected(cb);
                          setShowModal(MODAL_TYPES.CONFIG);
                        }}
                      >
                        <Settings size={16} /> Config
                      </ActionButton>
                      <ActionButton
                        color="blue"
                        onClick={() => openPersonaModal(cb)}
                      >
                        <Brain size={16} /> Persona
                      </ActionButton>
                      <ActionButton
                        color="purple"
                        onClick={() => navigate(`/dashboard/customize/${cb._id}`)}
                      >
                        <Palette size={16} /> Customize
                      </ActionButton>
                    </div>
                  </div>
                );
              })
          ) : (
            <p className="text-red-500 p-6 text-center">No chatbots found.</p>
          )}
        </div>
      )}

      {/* Modals */}
      {renewing && (
        <RenewModal
          availablePlans={availablePlans}
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
          onConfirm={() => handleRenew(renewing)}
          onClose={() => setRenewing(null)}
        />
      )}

      {/* Add Credit Modal */}
      {showAddCreditModal && selectedCompanyForCredit && (
        <AddCreditModal
          companyId={selectedCompanyForCredit}
          currentCredits={companyCredits[selectedCompanyForCredit]}
          creditAmount={creditAmount}
          creditReason={creditReason}
          setCreditAmount={setCreditAmount}
          setCreditReason={setCreditReason}
          onConfirm={handleAddCredits}
          onClose={() => {
            setShowAddCreditModal(false);
            setSelectedCompanyForCredit(null);
            setCreditAmount("");
            setCreditReason("");
          }}
          processing={processingCredit}
        />
      )}

      {/* Remove Credit Modal */}
      {showRemoveCreditModal && selectedCompanyForCredit && (
        <RemoveCreditModal
          companyId={selectedCompanyForCredit}
          currentCredits={companyCredits[selectedCompanyForCredit]}
          creditAmount={creditAmount}
          creditReason={creditReason}
          setCreditAmount={setCreditAmount}
          setCreditReason={setCreditReason}
          onConfirm={handleRemoveCredits}
          onClose={() => {
            setShowRemoveCreditModal(false);
            setSelectedCompanyForCredit(null);
            setCreditAmount("");
            setCreditReason("");
          }}
          processing={processingCredit}
        />
      )}

      {showModal === MODAL_TYPES.MESSAGE_HISTORY && selected && (
        <Modal
          title={`🧾 Message History – ${selected.name}`}
          onClose={closeAnyModal}
        >
          <MessageHistory chatbotId={selected._id} />
        </Modal>
      )}

      {showModal === MODAL_TYPES.CONFIG && selected && (
        <EditClientConfigModal chatbot={selected} onClose={closeAnyModal} />
      )}

      {showModal === MODAL_TYPES.PERSONA && selected && (
        <PersonaModal
          chatbot={selected}
          loading={personaLoading}
          saving={personaSaving}
          value={personaDraft}
          onChange={setPersonaDraft}
          onCopy={() => {
            navigator.clipboard.writeText(personaDraft || "");
            toast(<CustomSuccessToast text="Persona copied" />);
          }}
          onReset={resetPersonaToFetched}
          onSave={savePersona}
          onClose={closeAnyModal}
          hasChanges={personaDraft !== personaOriginal}
        />
      )}
    </div>
  );
};

// --- Child Components ---
const CustomSuccessToast = ({ text }) => (
  <div className="flex items-center gap-3">
    <div className="flex-shrink-0 w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center">
      <Check size={12} className="text-white" />
    </div>
    <span className="font-semibold text-sm text-gray-800">{text}</span>
  </div>
);

const Stat = ({ label, value }) => (
  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300">
    <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
    <p className="text-xl font-bold text-gray-800 mt-1">{value}</p>
  </div>
);

const PlanDetail = ({ label, value }) => (
  <div>
    <p className="text-gray-500 text-xs uppercase tracking-wider">{label}</p>
    <p className="font-medium text-gray-800 mt-0.5">{value}</p>
  </div>
);

const ActionButton = ({
  children,
  onClick,
  color = "blue",
  disabled,
  variant = "solid",
}) => {
  const solidColors = {
    blue: "bg-[#1e3a8a] hover:bg-[#1e40af] text-white shadow-md",
    cyan: "bg-teal-500 hover:bg-teal-600 text-white shadow-md",
    violet: "bg-blue-600 hover:bg-blue-700 text-white shadow-md",
    purple: "bg-[#1e3a8a] hover:bg-[#1e40af] text-white shadow-md",
  };
  const outlineClass =
    "bg-white text-gray-700 border border-gray-300 hover:bg-blue-50 hover:border-[#1e3a8a]";
  const baseClass =
    "px-4 py-2 font-semibold rounded-lg flex items-center justify-center gap-2 transition-all duration-300";
  const styleClass = variant === "outline" ? outlineClass : solidColors[color];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${styleClass} ${
        disabled ? "opacity-70 cursor-not-allowed" : ""
      }`}
    >
      {children}
    </button>
  );
};

const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white p-6 rounded-xl w-full max-w-3xl relative shadow-2xl border border-gray-200">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-[#1e3a8a] text-2xl transition-colors"
      >
        &times;
      </button>
      <h3 className="text-xl font-semibold mb-4 text-[#1e3a8a]">{title}</h3>
      {children}
    </div>
  </div>
);

const RenewModal = ({
  availablePlans,
  selectedPlan,
  setSelectedPlan,
  onConfirm,
  onClose,
}) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white p-6 rounded-xl w-full max-w-sm relative shadow-2xl border border-gray-200">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-[#1e3a8a] text-xl transition-colors"
      >
        &times;
      </button>
      <h3 className="text-xl font-semibold mb-4 text-[#1e3a8a]">Renew Plan</h3>
      <select
        value={selectedPlan}
        onChange={(e) => setSelectedPlan(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-lg mb-4 bg-white focus:ring-2 focus:ring-[#1e3a8a] shadow-sm"
      >
        <option disabled value="">
          Select a plan
        </option>
        {availablePlans.map((plan) => (
          <option key={plan._id} value={plan._id}>
            {plan.name} – ₹{plan.price} / {plan.duration_days} days (
            {plan.max_users} users)
          </option>
        ))}
      </select>
      <button
        onClick={onConfirm}
        className="w-full bg-[#1e3a8a] text-white py-2 rounded-lg hover:bg-[#1e40af] font-semibold shadow-md transition-colors"
      >
        Confirm Renew
      </button>
    </div>
  </div>
);

// --- Persona Modal ---
const PersonaModal = ({
  chatbot,
  loading,
  saving,
  value,
  onChange,
  onCopy,
  onReset,
  onSave,
  onClose,
  hasChanges,
}) => {
  const count = value?.length ?? 0;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white p-0 rounded-xl w-full max-w-4xl relative shadow-2xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Brain className="text-[#1e3a8a]" />
            <h3 className="text-lg font-semibold text-[#1e3a8a]">
              Set Persona — {chatbot?.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-[#1e3a8a] text-2xl transition-colors"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className="p-6 space-y-4">
          {loading ? (
            <div className="flex items-center gap-2 text-gray-600">
              <Loader2 className="animate-spin" />
              <span>Loading persona…</span>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Tip: Write clear instructions, tone, do/don't rules, and any
                  company/product knowledge that must always be respected.
                </p>
                <span className="text-xs text-gray-500">{count} chars</span>
              </div>

              <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Describe this chatbot's persona, tone, goals, allowed topics, and rules…"
                className="w-full h-[50vh] resize-y leading-6 p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#1e3a8a] font-mono text-sm bg-white shadow-sm"
              />

              <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                <button
                  onClick={onCopy}
                  className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-blue-50 hover:border-[#1e3a8a] flex items-center gap-2 transition-colors"
                >
                  <Copy size={16} /> Copy
                </button>
                <button
                  onClick={onReset}
                  disabled={!hasChanges}
                  className={`px-3 py-2 rounded-lg border flex items-center gap-2 transition-colors ${
                    hasChanges
                      ? "border-gray-300 text-gray-700 bg-white hover:bg-blue-50 hover:border-[#1e3a8a]"
                      : "border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed"
                  }`}
                >
                  <Undo2 size={16} /> Reset
                </button>
                <button
                  onClick={onSave}
                  disabled={saving}
                  className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors ${
                    saving
                      ? "bg-[#1e3a8a]/70 text-white cursor-wait"
                      : "bg-[#1e3a8a] hover:bg-[#1e40af] text-white shadow-md"
                  }`}
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {saving ? "Saving…" : "Save Persona"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Add Credit Modal ---
const AddCreditModal = ({
  companyId,
  currentCredits,
  creditAmount,
  creditReason,
  setCreditAmount,
  setCreditReason,
  onConfirm,
  onClose,
  processing,
}) => {
  const remaining = currentCredits?.remaining || 0;
  const total = currentCredits?.total || 0;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-xl w-full max-w-md relative shadow-2xl border border-gray-200">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-[#1e3a8a] text-xl transition-colors"
        >
          &times;
        </button>
        <h3 className="text-xl font-semibold mb-4 text-green-600 flex items-center gap-2">
          <span>+</span> Add Credits
        </h3>
        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">Current Credits</p>
            <p className="text-lg font-semibold text-gray-800">
              Total: {new Intl.NumberFormat("en-IN").format(total)} | Remaining: {new Intl.NumberFormat("en-IN").format(remaining)}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Credits to Add
            </label>
            <input
              type="number"
              value={creditAmount}
              onChange={(e) => setCreditAmount(e.target.value)}
              placeholder="Enter amount"
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason (Optional)
            </label>
            <input
              type="text"
              value={creditReason}
              onChange={(e) => setCreditReason(e.target.value)}
              placeholder="e.g., Monthly allocation, Bonus credits"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={processing || !creditAmount || parseInt(creditAmount, 10) <= 0}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Credits"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Remove Credit Modal ---
const RemoveCreditModal = ({
  companyId,
  currentCredits,
  creditAmount,
  creditReason,
  setCreditAmount,
  setCreditReason,
  onConfirm,
  onClose,
  processing,
}) => {
  const remaining = currentCredits?.remaining || 0;
  const total = currentCredits?.total || 0;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-xl w-full max-w-md relative shadow-2xl border border-gray-200">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-[#1e3a8a] text-xl transition-colors"
        >
          &times;
        </button>
        <h3 className="text-xl font-semibold mb-4 text-red-600 flex items-center gap-2">
          <span>−</span> Remove Credits
        </h3>
        <div className="space-y-4">
          <div className="bg-red-50 p-3 rounded-lg border border-red-200">
            <p className="text-sm text-gray-600">Current Credits</p>
            <p className="text-lg font-semibold text-gray-800">
              Total: {new Intl.NumberFormat("en-IN").format(total)} | Remaining: {new Intl.NumberFormat("en-IN").format(remaining)}
            </p>
            {remaining > 0 && (
              <p className="text-xs text-red-600 mt-1">
                You can remove up to {new Intl.NumberFormat("en-IN").format(remaining)} credits
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Credits to Remove
            </label>
            <input
              type="number"
              value={creditAmount}
              onChange={(e) => setCreditAmount(e.target.value)}
              placeholder="Enter amount"
              min="1"
              max={remaining}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason (Optional)
            </label>
            <input
              type="text"
              value={creditReason}
              onChange={(e) => setCreditReason(e.target.value)}
              placeholder="e.g., Refund, Adjustment"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={processing || !creditAmount || parseInt(creditAmount, 10) <= 0 || parseInt(creditAmount, 10) > remaining}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {processing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Removing...
                </>
              ) : (
                "Remove Credits"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageChatbotsPage;

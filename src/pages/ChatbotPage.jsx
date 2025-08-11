import { useEffect, useState } from "react";
import api from "../services/api";
import MessageHistory from "../components/MessageHistory";
import ClipLoader from "react-spinners/ClipLoader";
import UploadContextModal from "../components/UploadContextModal";
import EditClientConfigModal from "../components/EditClientConfigModal";
import { toast } from "react-toastify";
import {
  Search,
  Copy,
  FileText,
  History,
  RefreshCw,
  Settings,
  Upload,
  Rocket,
  Building,
  Link,
  Pencil,
  Check,
  Save,
} from "lucide-react";

const MODAL_TYPES = {
  NONE: null,
  MESSAGE_HISTORY: "message_history",
  CONFIG: "config",
};

const ManageChatbotsPage = () => {
  const [chatbots, setChatbots] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(MODAL_TYPES.NONE);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [renewing, setRenewing] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [availablePlans, setAvailablePlans] = useState([]);

  // Editable token limit
  const [editingTokenLimitFor, setEditingTokenLimitFor] = useState(null);
  const [newTokenLimit, setNewTokenLimit] = useState("");

  // ✅ New: Fetch ALL chatbots + subscriptions in one API call
  const fetchAllSubs = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await api.get("/subscriptions", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      // Deduplicate by chatbot_id
      const uniqueSubs = Array.from(
        new Map(
          res.data.subscriptions.map((sub) => [sub.chatbot_id._id, sub])
        ).values()
      );

      setChatbots(uniqueSubs || []);
    } catch (err) {
      console.error("Failed to fetch subscriptions:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await api.get("/plans", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAvailablePlans(res.data.plans || []);
    } catch (err) {
      console.error("Failed to fetch plans:", err);
    }
  };

  useEffect(() => {
    fetchAllSubs();
    fetchPlans();
  }, []);

  const handleUpdateTokenLimit = async (chatbotId) => {
    console.log(
      `Updating chatbot ${chatbotId} with new token limit: ${newTokenLimit}`
    );

    setChatbots((prev) =>
      prev.map((cb) =>
        cb.chatbot_id._id === chatbotId
          ? {
              ...cb,
              chatbot_id: {
                ...cb.chatbot_id,
                token_limit: parseInt(newTokenLimit, 10),
              },
            }
          : cb
      )
    );

    toast(<CustomSuccessToast text="Token limit updated!" />);
    setEditingTokenLimitFor(null);
  };

  const handleRenew = async (id) => {
    const token = localStorage.getItem("adminToken");
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
      fetchAllSubs(); // Refresh data
      setRenewing(null);
    } catch (err) {
      console.error("Renewal error:", err);
      toast.error("❌ Renewal failed");
    }
  };

  const handleDownloadReport = async (chatbotId) => {
    try {
      setIsDownloading(true);
      const token = localStorage.getItem("adminToken");
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <ClipLoader size={40} color="#4A90E2" loading={loading} />
      </div>
    );
  }

  if (!chatbots || chatbots.length === 0) {
    return <p className="text-red-500 p-6">No chatbots found.</p>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <Rocket className="text-blue-600" />
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
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
            <Upload size={16} />
            Upload
          </button>
        </div>
      </header>

      <div className="space-y-8">
        {chatbots.map((sub) => {
          const cb = sub.chatbot_id;
          const plan = sub.plan_id;
          const remainingTokens =
            cb.token_limit != null && cb.used_tokens != null
              ? Math.max(cb.token_limit - cb.used_tokens, 0)
              : "Unlimited";

          return (
            <div
              key={cb._id}
              className="bg-white rounded-xl shadow-md p-6 lg:p-8 border border-gray-200/80"
            >
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900">{cb.name}</h2>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm mt-2">
                  <span className="flex items-center gap-1.5 text-gray-500">
                    <Building size={14} />
                    {cb.company_name}
                  </span>
                  <a
                    href={`https://${cb.company_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-gray-600 hover:text-gray-700 hover:underline underline-offset-4"
                  >
                    <Link size={14} />
                    {cb.company_url}
                  </a>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <Stat label="TOKEN USAGE" value={cb.used_tokens || 0} />
                <Stat label="TOTAL MESSAGES" value={cb.total_messages || 0} />
                <Stat label="UNIQUE USERS" value={cb.unique_users || 0} />
                <Stat
                  label="REMAINING TOKENS"
                  value={
                    typeof remainingTokens === "number"
                      ? remainingTokens
                      : remainingTokens
                  }
                />
              </div>

              {/* Token Limit */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm text-gray-500">Total Token Limit</p>
                  {editingTokenLimitFor !== cb._id && (
                    <button
                      onClick={() => {
                        setEditingTokenLimitFor(cb._id);
                        setNewTokenLimit(cb.token_limit ?? "");
                      }}
                    >
                      <Pencil
                        size={12}
                        className="text-gray-400 hover:text-blue-600"
                      />
                    </button>
                  )}
                </div>
                {editingTokenLimitFor === cb._id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={newTokenLimit}
                      onChange={(e) => setNewTokenLimit(e.target.value)}
                      className="text-3xl font-bold text-gray-800 bg-slate-100 rounded-md p-1 w-full max-w-xs"
                      autoFocus
                    />
                    <button
                      onClick={() => handleUpdateTokenLimit(cb._id)}
                      className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      <Save size={20} />
                    </button>
                    <button
                      onClick={() => setEditingTokenLimitFor(null)}
                      className="p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                      <span className="text-lg font-bold">&times;</span>
                    </button>
                  </div>
                ) : (
                  <p className="text-3xl font-bold text-gray-800">
                    {cb.token_limit ?? 0}
                  </p>
                )}
              </div>

              {/* Plan Details */}
              <div className="mb-8">
                <p className="font-semibold text-gray-800 mb-1">Plan Details</p>
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
                      value={`${cb.unique_users} / ${plan?.max_users || "N/A"}`}
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

              {/* Embed Code */}
              <div className="flex items-center justify-between bg-slate-100 p-3 rounded-lg border border-slate-200 mb-8">
                <code className="text-xs text-gray-600 break-all mr-4">
                  {`<script src="https://api.0804.in/chatbot-loader/loaders.js" chatbot-id="${cb._id}" defer></script>`}
                </code>
                <button
                  onClick={() => {
                    const script = `<script src="https://api.0804.in/chatbot-loader/loaders.js" chatbot-id="${cb._id}" defer></script>`;
                    navigator.clipboard.writeText(script);
                    toast(<CustomSuccessToast text="Embed code copied" />);
                  }}
                  className="flex-shrink-0 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 text-sm font-medium flex items-center gap-2"
                >
                  <Copy size={14} /> Copy
                </button>
              </div>

              {/* Actions */}
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
                <ActionButton color="cyan" onClick={() => setRenewing(cb._id)}>
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
              </div>
            </div>
          );
        })}
      </div>

      {renewing && (
        <RenewModal
          availablePlans={availablePlans}
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
          onConfirm={() => handleRenew(renewing)}
          onClose={() => setRenewing(null)}
        />
      )}

      {showModal === MODAL_TYPES.MESSAGE_HISTORY && selected && (
        <Modal
          title={`🧾 Message History – ${selected.name}`}
          onClose={() => {
            setShowModal(MODAL_TYPES.NONE);
            setSelected(null);
          }}
        >
          <MessageHistory chatbotId={selected._id} />
        </Modal>
      )}

      {showModal === MODAL_TYPES.CONFIG && selected && (
        <EditClientConfigModal
          chatbot={selected}
          onClose={() => {
            setShowModal(MODAL_TYPES.NONE);
            setSelected(null);
          }}
        />
      )}
    </div>
  );
};

/* --- Child Components --- */
const CustomSuccessToast = ({ text }) => (
  <div className="flex items-center gap-3">
    <div className="flex-shrink-0 w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center">
      <Check size={12} className="text-white" />
    </div>
    <span className="font-semibold text-sm text-gray-800">{text}</span>
  </div>
);

const Stat = ({ label, value }) => (
  <div className="bg-white p-4 rounded-xl border border-gray-200/80">
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
    blue: "bg-blue-600 hover:bg-blue-700 text-white",
    cyan: "bg-cyan-500 hover:bg-cyan-600 text-white",
    violet: "bg-violet-600 hover:bg-violet-700 text-white",
  };
  const outlineClass =
    "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50";
  const baseClass =
    "px-4 py-2 font-semibold rounded-lg flex items-center justify-center gap-2";
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
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white p-6 rounded-xl w-full max-w-3xl relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
      >
        &times;
      </button>
      <h3 className="text-xl font-semibold mb-4 text-gray-800">{title}</h3>
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
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white p-6 rounded-xl w-full max-w-sm relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 text-xl"
      >
        &times;
      </button>
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Renew Plan</h3>
      <select
        value={selectedPlan}
        onChange={(e) => setSelectedPlan(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-lg mb-4 bg-white focus:ring-2 focus:ring-blue-500"
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
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold"
      >
        Confirm Renew
      </button>
    </div>
  </div>
);

export default ManageChatbotsPage;

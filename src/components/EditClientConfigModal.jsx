import { useEffect, useState } from "react";
import { fetchClientConfig, updateClientConfig } from "../services/api";
import { Phone, Video } from "lucide-react";

const EditClientConfigModal = ({ chatbot, onClose }) => {
  const [config, setConfig] = useState({
    demo_message: "",
    demo_link: "",
    default_suggestions: "",
    demo_keywords: "",
    curtom_intro: "",
    // Intent detection fields
    call_keywords: "",
    meeting_keywords: "",
    call_intent_enabled: false,
    meeting_intent_enabled: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (chatbot?._id) {
      fetchClientConfig(chatbot._id)
        .then((res) => {
          // Backend returns config directly in res.data, not res.data.config
          const data = res.data || {};
          setConfig({
            // Note: These fields don't exist in ClientConfig model - using empty defaults
            demo_message: data.demo_message || "",
            demo_link: data.demo_link || "",
            default_suggestions: Array.isArray(data.default_suggestions) 
              ? data.default_suggestions.join(", ") 
              : (data.ui_suggestions || []).map(s => s.label || s).join(", "),
            demo_keywords: Array.isArray(data.demo_keywords) 
              ? data.demo_keywords.join(", ") 
              : "",
            // Intent detection fields (these exist in the model)
            call_keywords: Array.isArray(data.call_keywords) 
              ? data.call_keywords.join(", ") 
              : "",
            meeting_keywords: Array.isArray(data.meeting_keywords) 
              ? data.meeting_keywords.join(", ") 
              : "",
            call_intent_enabled: data.call_intent_enabled || false,
            meeting_intent_enabled: data.meeting_intent_enabled || false,
          });
          setLoading(false);
        })
        .catch((err) => {
          console.error("Config fetch error", err);
          setLoading(false);
        });
    }
  }, [chatbot]);

  const handleSave = async () => {
    try {
      const payload = {
        demo_message: config.demo_message,
        demo_link: config.demo_link,
        default_suggestions: config.default_suggestions
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        demo_keywords: config.demo_keywords
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        // Intent detection fields
        call_keywords: config.call_keywords
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        meeting_keywords: config.meeting_keywords
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        call_intent_enabled: config.call_intent_enabled,
        meeting_intent_enabled: config.meeting_intent_enabled,
      };

      await updateClientConfig(chatbot._id, payload);
      alert("✅ Client config updated!");
      onClose();
    } catch (err) {
      console.error("Update error", err);
      alert("❌ Failed to update config");
    }
  };

  if (loading) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl my-8 max-h-[90vh] flex flex-col">
        {/* Fixed Header */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-800">
            Edit Client Config – {chatbot.name}
          </h2>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div>
            <label className="block font-medium mb-1">Demo Message</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded"
              rows={3}
              value={config.demo_message}
              onChange={(e) =>
                setConfig({ ...config, demo_message: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Demo Link</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={config.demo_link}
              onChange={(e) =>
                setConfig({ ...config, demo_link: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block font-medium mb-1">
              Default Suggestions (comma-separated)
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={config.default_suggestions}
              onChange={(e) =>
                setConfig({ ...config, default_suggestions: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block font-medium mb-1">
              Demo Keywords (comma-separated)
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={config.demo_keywords}
              onChange={(e) =>
                setConfig({ ...config, demo_keywords: e.target.value })
              }
            />
          </div>

          {/* Intent Detection Section */}
          <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-800">
              🎯 Lead Capture Intent Detection
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Configure keywords to detect when users want a callback or meeting. The chatbot will automatically collect their contact info.
            </p>

            {/* Call Intent */}
            <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <label className="font-medium flex items-center gap-2 text-blue-800">
                  <Phone size={18} />
                  Call Request Detection
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={config.call_intent_enabled}
                    onChange={(e) =>
                      setConfig({ ...config, call_intent_enabled: e.target.checked })
                    }
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    {config.call_intent_enabled ? "Enabled" : "Disabled"}
                  </span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-blue-700">
                  Custom Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g., call me, ring me, callback, phone me"
                  className="w-full p-2 border border-blue-300 rounded bg-white"
                  value={config.call_keywords}
                  onChange={(e) =>
                    setConfig({ ...config, call_keywords: e.target.value })
                  }
                />
                <p className="text-xs text-blue-600 mt-1">
                  Default: "call me", "callback", "ring me", "phone me", etc.
                </p>
              </div>
            </div>

            {/* Meeting Intent */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-3">
                <label className="font-medium flex items-center gap-2 text-green-800">
                  <Video size={18} />
                  Meeting Request Detection
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={config.meeting_intent_enabled}
                    onChange={(e) =>
                      setConfig({ ...config, meeting_intent_enabled: e.target.checked })
                    }
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    {config.meeting_intent_enabled ? "Enabled" : "Disabled"}
                  </span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-green-700">
                  Custom Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g., schedule meeting, google meet, zoom call, demo"
                  className="w-full p-2 border border-green-300 rounded bg-white"
                  value={config.meeting_keywords}
                  onChange={(e) =>
                    setConfig({ ...config, meeting_keywords: e.target.value })
                  }
                />
                <p className="text-xs text-green-600 mt-1">
                  Default: "schedule meeting", "google meet", "zoom", "demo", etc.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="p-6 border-t border-gray-200 flex-shrink-0 flex justify-end gap-4 bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#1e3a8a] hover:bg-[#1e40af] text-white rounded-lg shadow-md transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditClientConfigModal;

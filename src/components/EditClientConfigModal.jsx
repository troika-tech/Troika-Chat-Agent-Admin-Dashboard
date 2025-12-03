import { useEffect, useState } from "react";
import { fetchClientConfig, updateClientConfig } from "../services/api";

const EditClientConfigModal = ({ chatbot, onClose }) => {
  const [config, setConfig] = useState({
    demo_message: "",
    demo_link: "",
    default_suggestions: "",
    demo_keywords: "",
    // Intent detection fields - single field for each
    default_call_keywords: "",
    default_meeting_keywords: "",
    call_intent_enabled: false,
    meeting_intent_enabled: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (chatbot?._id) {
      fetchClientConfig(chatbot._id)
        .then((res) => {
          const data = res.data.config;
          setConfig({
            demo_message: data.demo_message || "",
            demo_link: data.demo_link || "",
            default_suggestions: (data.default_suggestions || []).join(", "),
            demo_keywords: (data.demo_keywords || []).join(", "),
            // Intent detection - fetch stored keywords
            default_call_keywords: (data.default_call_keywords || []).join(", "),
            default_meeting_keywords: (data.default_meeting_keywords || []).join(", "),
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
        // Intent detection - save keywords
        default_call_keywords: config.default_call_keywords
          .split(",")
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean),
        default_meeting_keywords: config.default_meeting_keywords
          .split(",")
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean),
        call_intent_enabled: config.call_intent_enabled,
        meeting_intent_enabled: config.meeting_intent_enabled,
      };

      await updateClientConfig(chatbot._id, payload);
      alert("Client config updated!");
      onClose();
    } catch (err) {
      console.error("Update error", err);
      alert("Failed to update config");
    }
  };

  if (loading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-xl p-6 relative shadow-xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Edit Client Config - {chatbot.name}
        </h2>

        <div className="space-y-4">
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
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Intent Detection Settings</h3>

            {/* Call Intent */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="font-medium text-gray-700">Call Intent Detection</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.call_intent_enabled}
                    onChange={(e) =>
                      setConfig({ ...config, call_intent_enabled: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1e3a8a]"></div>
                </label>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Call Keywords (comma-separated)
                </label>
                <textarea
                  className="w-full p-2 text-sm border border-gray-300 rounded"
                  rows={3}
                  value={config.default_call_keywords}
                  onChange={(e) =>
                    setConfig({ ...config, default_call_keywords: e.target.value })
                  }
                  placeholder="call me, call back, schedule a call, ring me..."
                />
              </div>
            </div>

            {/* Meeting Intent */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="font-medium text-gray-700">Meeting Intent Detection</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.meeting_intent_enabled}
                    onChange={(e) =>
                      setConfig({ ...config, meeting_intent_enabled: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1e3a8a]"></div>
                </label>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Meeting Keywords (comma-separated)
                </label>
                <textarea
                  className="w-full p-2 text-sm border border-gray-300 rounded"
                  rows={3}
                  value={config.default_meeting_keywords}
                  onChange={(e) =>
                    setConfig({ ...config, default_meeting_keywords: e.target.value })
                  }
                  placeholder="schedule a meeting, book a demo, google meet, zoom call..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
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

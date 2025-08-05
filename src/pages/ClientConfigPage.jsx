// pages/ClientConfigPage.jsx
import { useEffect, useState } from "react";
import api from "../services/api";
import { iconOptions } from "../utils/icons";

const ClientConfigPage = () => {
  const [chatbots, setChatbots] = useState([]);
  const [selectedChatbot, setSelectedChatbot] = useState("");
  const [uiSuggestions, setUiSuggestions] = useState([]);
  const [linkIntents, setLinkIntents] = useState([]);
  const [iconSearch, setIconSearch] = useState("");
  const [activeIconIndex, setActiveIconIndex] = useState(null);
  const [chatbotSearch, setChatbotSearch] = useState("");

  useEffect(() => {
    async function fetchChatbots() {
      try {
        const res = await api.get("/chatbot/all");
        console.log("✅ Loaded chatbots:", res.data.chatbots);
        setChatbots(Array.isArray(res.data.chatbots) ? res.data.chatbots : []);
      } catch (err) {
        console.error("❌ Failed to fetch chatbots", err);
        setChatbots([]);
      }
    }
    fetchChatbots();
  }, []);

  useEffect(() => {
    if (!selectedChatbot) return;

    async function fetchConfig() {
      const [suggestionRes, configRes] = await Promise.all([
        api.get(`/suggestions/${selectedChatbot}`),
        api.get(`/chatbot/${selectedChatbot}/config`),
      ]);

      setUiSuggestions(suggestionRes.data || []);
      setLinkIntents(configRes.data?.link_intents || []);
    }

    fetchConfig();
  }, [selectedChatbot]);

  const handleSave = async () => {
    try {
      await Promise.all([
        api.post(`/suggestions/${selectedChatbot}`, {
          suggestions: uiSuggestions,
        }),
        api.put(`/client-config/${selectedChatbot}`, {
          link_intents: linkIntents,
        }),
      ]);

      alert("Client config saved successfully!");
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save config.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Manage Client Config</h2>

      {/* Searchable Chatbot Dropdown */}
      <label className="block mb-2">Select Chatbot</label>
      <input
        type="text"
        placeholder="Search chatbot by name, company, or URL..."
        className="border p-2 w-full mb-2"
        value={chatbotSearch}
        onChange={(e) => setChatbotSearch(e.target.value)}
      />

      <select
        className="w-full border p-2 mb-4"
        value={selectedChatbot}
        onChange={(e) => setSelectedChatbot(e.target.value)}
      >
        <option value="">-- Select Chatbot --</option>
        {chatbots
          .filter((cb) =>
            `${cb.name} ${cb.company_name} ${cb.company_url}`
              .toLowerCase()
              .includes(chatbotSearch.toLowerCase())
          )
          .map((cb) => (
            <option key={cb._id} value={cb._id}>
              🏷 {cb.name} — 🏢 {cb.company_name} ({cb.company_url})
            </option>
          ))}
      </select>

      <h3 className="text-xl font-semibold mt-6 mb-2">UI Suggestions</h3>
      {uiSuggestions.map((s, idx) => (
        <div key={idx} className="flex gap-2 mb-2 items-center relative">
          <input
            className="border p-1 flex-1"
            placeholder="Label"
            value={s.label}
            onChange={(e) => {
              const newSuggestions = [...uiSuggestions];
              newSuggestions[idx].label = e.target.value;
              setUiSuggestions(newSuggestions);
            }}
          />
          <div className="relative w-48">
            <input
              type="text"
              placeholder="Search icon..."
              className="border p-1 w-full"
              value={activeIconIndex === idx ? iconSearch : s.icon}
              onFocus={() => {
                setActiveIconIndex(idx);
                setIconSearch("");
              }}
              onChange={(e) => setIconSearch(e.target.value)}
            />
            {activeIconIndex === idx && (
              <div className="absolute z-10 bg-white border mt-1 max-h-40 overflow-y-auto w-full p-2 shadow-md rounded">
                {Object.entries(iconOptions)
                  .filter(([key]) =>
                    key.toLowerCase().includes(iconSearch.toLowerCase())
                  )
                  .map(([key, IconComponent]) => (
                    <div
                      key={key}
                      className="flex items-center gap-2 p-1 cursor-pointer hover:bg-gray-100"
                      onClick={() => {
                        const updated = [...uiSuggestions];
                        updated[idx].icon = key;
                        setUiSuggestions(updated);
                        setActiveIconIndex(null);
                        setIconSearch("");
                      }}
                    >
                      <IconComponent size={16} />
                      <span>{key}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
          <input
            type="color"
            value={s.bg}
            onChange={(e) => {
              const newSuggestions = [...uiSuggestions];
              newSuggestions[idx].bg = e.target.value;
              setUiSuggestions(newSuggestions);
            }}
          />
          {iconOptions[s.icon] && (
            <div className="ml-2 p-1 rounded bg-gray-100">
              {iconOptions[s.icon]({ size: 20 })}
            </div>
          )}
          <button
            className="text-red-500"
            onClick={() =>
              setUiSuggestions(uiSuggestions.filter((_, i) => i !== idx))
            }
          >
            ✖
          </button>
        </div>
      ))}
      <button
        className="bg-blue-500 text-white px-3 py-1 rounded"
        onClick={() =>
          setUiSuggestions([
            ...uiSuggestions,
            { label: "", icon: "FaBuilding", bg: "#10b981" },
          ])
        }
      >
        ➕ Add Suggestion
      </button>

      <h3 className="text-xl font-semibold mt-6 mb-2">Link Intents</h3>
      {linkIntents.map((li, idx) => (
        <div key={idx} className="flex gap-2 mb-2 items-center">
          <input
            className="border p-1 w-1/4"
            placeholder="Intent"
            value={li.intent}
            onChange={(e) => {
              const updated = [...linkIntents];
              updated[idx].intent = e.target.value;
              setLinkIntents(updated);
            }}
          />
          <input
            className="border p-1 w-1/3"
            placeholder="Keywords (comma-separated)"
            value={li.keywords.join(",")}
            onChange={(e) => {
              const updated = [...linkIntents];
              updated[idx].keywords = e.target.value
                .split(",")
                .map((k) => k.trim());
              setLinkIntents(updated);
            }}
          />
          <input
            className="border p-1 w-1/3"
            placeholder="Link URL"
            value={li.link}
            onChange={(e) => {
              const updated = [...linkIntents];
              updated[idx].link = e.target.value;
              setLinkIntents(updated);
            }}
          />
          <button
            className="text-red-500"
            onClick={() =>
              setLinkIntents(linkIntents.filter((_, i) => i !== idx))
            }
          >
            ✖
          </button>
        </div>
      ))}
      <button
        className="bg-blue-500 text-white px-3 py-1 rounded"
        onClick={() =>
          setLinkIntents([
            ...linkIntents,
            { intent: "", keywords: [], link: "" },
          ])
        }
      >
        ➕ Add Link Intent
      </button>

      <div className="mt-6">
        <button
          className="bg-green-600 text-white px-6 py-2 rounded font-bold"
          onClick={handleSave}
        >
          💾 Save Config
        </button>
      </div>
    </div>
  );
};

export default ClientConfigPage;

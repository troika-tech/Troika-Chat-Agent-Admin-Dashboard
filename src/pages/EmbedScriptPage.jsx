import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { fetchChatbots, getEmbedScript } from "../services/api";
import { Code, Copy, Check, Loader2, ExternalLink, Search, ChevronDown } from "lucide-react";

const EmbedScriptPage = () => {
  const [chatbots, setChatbots] = useState([]);
  const [selectedChatbotId, setSelectedChatbotId] = useState("");
  const [selectedChatbot, setSelectedChatbot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingScript, setLoadingScript] = useState(false);
  const [embedScript, setEmbedScript] = useState("");
  const [embedData, setEmbedData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Fetch chatbots on mount
  useEffect(() => {
    fetchChatbotsList();
  }, []);

  // Generate script when chatbot is selected
  useEffect(() => {
    if (selectedChatbotId) {
      generateEmbedScript(selectedChatbotId);
    } else {
      setEmbedScript("");
      setEmbedData(null);
    }
  }, [selectedChatbotId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter chatbots based on search query
  const filteredChatbots = chatbots.filter((chatbot) =>
    chatbot.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchChatbotsList = async () => {
    try {
      setLoading(true);
      const response = await fetchChatbots();
      setChatbots(response.data.data?.chatbots || response.data.chatbots || []);
    } catch (error) {
      console.error("Error fetching chatbots:", error);
      toast.error("Failed to load chatbots");
    } finally {
      setLoading(false);
    }
  };

  const generateEmbedScript = async (chatbotId) => {
    try {
      setLoadingScript(true);
      const response = await getEmbedScript(chatbotId);
      const data = response.data.data || response.data;
      
      setEmbedScript(data.script || "");
      setEmbedData({
        chatbotId: data.chatbotId,
        chatbotName: data.chatbotName,
        apiBase: data.apiBase,
        loaderUrl: data.loaderUrl,
        bundleUrl: data.bundleUrl,
        instructions: data.instructions,
      });

      // Find and set selected chatbot details
      const chatbot = chatbots.find((c) => c._id === chatbotId);
      const selectedChatbotData = chatbot || { name: data.chatbotName || "Unknown" };
      setSelectedChatbot(selectedChatbotData);
      setSearchQuery(selectedChatbotData.name);
    } catch (error) {
      console.error("Error generating embed script:", error);
      toast.error("Failed to generate embed script");
      setEmbedScript("");
      setEmbedData(null);
    } finally {
      setLoadingScript(false);
    }
  };

  const handleCopyScript = async () => {
    try {
      await navigator.clipboard.writeText(embedScript);
      setCopied(true);
      toast.success("Script copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      toast.error("Failed to copy script");
    }
  };

  const handleSelectChatbot = (chatbotId, chatbotName) => {
    setSelectedChatbotId(chatbotId);
    setSearchQuery(chatbotName);
    setIsDropdownOpen(false);
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setIsDropdownOpen(true);
    if (!e.target.value) {
      setSelectedChatbotId("");
    }
  };

  const handleInputFocus = () => {
    setIsDropdownOpen(true);
  };

  const handlePreview = () => {
    if (!embedData) return;
    
    // Create a preview HTML page
    const previewHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chatbot Preview - ${embedData.chatbotName}</title>
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: system-ui, -apple-system, sans-serif;
      background: #f5f5f5;
    }
    .preview-header {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .preview-header h1 {
      margin: 0 0 10px 0;
      color: #333;
    }
    .preview-header p {
      margin: 0;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="preview-header">
    <h1>Chatbot Preview</h1>
    <p>This is a preview of how the chatbot will appear on your website.</p>
  </div>
  ${embedScript}
</body>
</html>`;

    // Open in new window
    const previewWindow = window.open("", "_blank");
    if (previewWindow) {
      previewWindow.document.write(previewHTML);
      previewWindow.document.close();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
          <h1 className="text-2xl font-bold text-[#1e3a8a] mb-2">Embed Chatbot Script</h1>
          <p className="text-gray-600">
            Generate an embed script to add your chatbot as a fullscreen interface on any website.
          </p>
        </div>

        {/* Chatbot Selection */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Chatbot
          </label>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading chatbots...</span>
            </div>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  placeholder="Search chatbots..."
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1e3a8a] focus:border-[#1e3a8a] shadow-sm"
                />
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              
              {isDropdownOpen && filteredChatbots.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {filteredChatbots.map((chatbot) => (
                    <button
                      key={chatbot._id}
                      type="button"
                      onClick={() => handleSelectChatbot(chatbot._id, chatbot.name)}
                      className={`w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors ${
                        selectedChatbotId === chatbot._id ? "bg-blue-100 font-medium" : ""
                      }`}
                    >
                      {chatbot.name}
                    </button>
                  ))}
                </div>
              )}
              
              {isDropdownOpen && searchQuery && filteredChatbots.length === 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center text-gray-500">
                  No chatbots found matching "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Embed Script Display */}
        {loadingScript ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Generating embed script...</p>
          </div>
        ) : embedScript ? (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Code className="w-5 h-5 mr-2" />
                Embed Script
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={handlePreview}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Preview
                </button>
                <button
                  onClick={handleCopyScript}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#1e3a8a] rounded-lg hover:bg-[#1e40af] flex items-center shadow-md transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Script
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-4 mb-4 overflow-x-auto">
              <pre className="text-sm text-gray-100 whitespace-pre-wrap">
                <code>{embedScript}</code>
              </pre>
            </div>

            {embedData && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">Instructions</h3>
                <p className="text-sm text-blue-800 mb-4">{embedData.instructions}</p>
                <div className="space-y-2 text-xs text-blue-700">
                  <p><strong>Chatbot:</strong> {embedData.chatbotName}</p>
                  <p><strong>API Base:</strong> <code className="bg-blue-100 px-1 rounded">{embedData.apiBase}</code></p>
                  <p><strong>Loader URL:</strong> <code className="bg-blue-100 px-1 rounded break-all">{embedData.loaderUrl}</code></p>
                </div>
              </div>
            )}
          </div>
        ) : selectedChatbotId ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              No embed script available. Please try again or contact support.
            </p>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              Select a chatbot above to generate the embed script.
            </p>
          </div>
        )}

        {/* Additional Information */}
        {embedScript && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Use</h3>
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
              <li>Copy the embed script above</li>
              <li>Open your HTML file in a code editor</li>
              <li>Paste the script just before the closing <code className="bg-gray-100 px-1 rounded">&lt;/body&gt;</code> tag</li>
              <li>Save and open your HTML file in a browser</li>
              <li>The chatbot will appear as a fullscreen interface when the page loads</li>
            </ol>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> The chatbot configuration (avatar, welcome text, sidebar items) is loaded dynamically from the backend. 
                Any changes you make in the dashboard will be reflected immediately without needing to regenerate the script.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmbedScriptPage;


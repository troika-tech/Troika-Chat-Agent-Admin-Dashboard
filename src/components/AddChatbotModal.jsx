// src/components/AddChatbotModal.jsx
import { useState } from "react";

// Default keywords for call intent detection
const DEFAULT_CALL_KEYWORDS = [
  'call me',
  'call back',
  'callback',
  'ring me',
  'phone me',
  'give me a call',
  'contact me',
  'reach me',
  'speak to someone',
  'talk to someone',
  'call tomorrow',
  'call today',
  'call later',
  'schedule a call',
  'book a call',
  'request a call',
  'want a call',
  'need a call'
];

// Default keywords for meeting intent detection
const DEFAULT_MEETING_KEYWORDS = [
  'schedule a meeting',
  'book a meeting',
  'arrange a meeting',
  'set up a meeting',
  'meeting with',
  'google meet',
  'gmeet',
  'zoom call',
  'zoom meeting',
  'video call',
  'video meeting',
  'teams meeting',
  'schedule meeting',
  'book meeting',
  'meet with',
  'meeting request',
  'want to meet',
  'need a meeting',
  'can we meet',
  'lets meet',
  "let's meet",
  'arrange meeting',
  'schedule time',
  'book time',
  'demo call',
  'schedule demo',
  'schedule a demo',
  'product demo',
  'need a demo',
  'want a demo',
  'book a demo',
  'online meeting',
  'virtual meeting'
];

const AddChatbotModal = ({ company, onClose, onCreate }) => {
  const [name, setName] = useState(`${company.name} Bot`);
  const [initialCredits, setInitialCredits] = useState("");
  const [callKeywords, setCallKeywords] = useState(DEFAULT_CALL_KEYWORDS.join(", "));
  const [meetingKeywords, setMeetingKeywords] = useState(DEFAULT_MEETING_KEYWORDS.join(", "));
  const [callIntentEnabled, setCallIntentEnabled] = useState(false);
  const [meetingIntentEnabled, setMeetingIntentEnabled] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Validate initial credits is provided and valid
    if (!initialCredits.trim()) {
      alert("Initial Credits is required");
      return;
    }

    const credits = parseInt(initialCredits, 10);
    if (isNaN(credits) || credits < 0) {
      alert("Please enter a valid credit amount (0 or greater)");
      return;
    }

    // Parse keywords from comma-separated string to array
    const callKeywordsArray = callKeywords
      .split(",")
      .map((k) => k.trim().toLowerCase())
      .filter(Boolean);
    const meetingKeywordsArray = meetingKeywords
      .split(",")
      .map((k) => k.trim().toLowerCase())
      .filter(Boolean);

    onCreate(company._id, name, credits, {
      default_call_keywords: callKeywordsArray,
      default_meeting_keywords: meetingKeywordsArray,
      call_intent_enabled: callIntentEnabled,
      meeting_intent_enabled: meetingIntentEnabled,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[90%] max-w-2xl shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-4 text-[#1e3a8a]">Create Chatbot for {company.name}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Chatbot Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Initial Credits <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={initialCredits}
              onChange={(e) => setInitialCredits(e.target.value)}
              placeholder="Enter credits"
              min="0"
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
            />
          </div>

          {/* Intent Detection Section */}
          <div className="border-t pt-4 mt-4">
            <h3 className="text-md font-semibold text-gray-800 mb-3">Intent Detection Settings</h3>

            {/* Call Intent */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Call Intent Detection</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={callIntentEnabled}
                    onChange={(e) => setCallIntentEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1e3a8a]"></div>
                </label>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Call Keywords (comma-separated)
                </label>
                <textarea
                  value={callKeywords}
                  onChange={(e) => setCallKeywords(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  placeholder="call me, call back, schedule a call..."
                />
              </div>
            </div>

            {/* Meeting Intent */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Meeting Intent Detection</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={meetingIntentEnabled}
                    onChange={(e) => setMeetingIntentEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1e3a8a]"></div>
                </label>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Meeting Keywords (comma-separated)
                </label>
                <textarea
                  value={meetingKeywords}
                  onChange={(e) => setMeetingKeywords(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
                  placeholder="schedule a meeting, book a demo, google meet..."
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#1e3a8a] text-white hover:bg-[#1e40af] text-sm shadow-md transition-colors"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddChatbotModal;

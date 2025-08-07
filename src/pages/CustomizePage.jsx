import React, { useState } from "react";
import ChatbotPreview from "../components/ChatbotPreview";
import IconPicker from "../components/IconPicker";
import * as FaIcons from "react-icons/fa";

// A curated list of preset gradients for selection
const PRESET_GRADIENTS = [
  "linear-gradient(135deg, #a855f7, #ec4899)",
  "linear-gradient(to right, #a855f7, #ec4899)",
  "linear-gradient(to right, #d43f8d, #0250c5)",
  "linear-gradient(135deg, #667eea, #764ba2)",
  "linear-gradient(to right, #84fab0, #8fd3f4)",
  "linear-gradient(to right, #ff7e5f, #feb47b)",
  "linear-gradient(to right, #43e97b, #38f9d7)",
  "linear-gradient(to right, #ff8177, #f99185, #b12a5b)",
  "linear-gradient(to right, #a18cd1, #fbc2eb)",
  "linear-gradient(to top, #5ee7df, #b490ca)",
  "linear-gradient(to right, #f83600, #f9d423)",
  "linear-gradient(to right, #4facfe, #00f2fe)",
  "linear-gradient(to right, #fa709a, #fee140)",
];

const ChatbotCustomizationPage = () => {
  // State for UI Suggestions, with individual background and type for each
  const [suggestions, setSuggestions] = useState([
    { label: "Our Services", icon: "FaCogs", bg: "#6366f1", bgType: "color" },
    { label: "Contact Us", icon: "FaPhone", bg: "#ec4899", bgType: "color" },
    {
      label: "View Pricing",
      icon: "FaTags",
      bg: "linear-gradient(to right, #84fab0, #8fd3f4)",
      bgType: "gradient",
    },
  ]);

  // Handler to update a specific field of a suggestion item
  const handleSuggestionChange = (index, field, value) => {
    const newSuggestions = [...suggestions];
    newSuggestions[index][field] = value;
    setSuggestions(newSuggestions);
  };

  // Handler to add a new suggestion with default values
  const handleAddSuggestion = () => {
    if (suggestions.length < 5) {
      setSuggestions([
        ...suggestions,
        { label: "", icon: "FaQuestionCircle", bg: "#cccccc", bgType: "color" },
      ]);
    }
  };

  // Handler to remove a suggestion
  const handleRemoveSuggestion = (index) => {
    if (suggestions.length > 1) {
      const newSuggestions = suggestions.filter((_, i) => i !== index);
      setSuggestions(newSuggestions);
    }
  };

  // Handler for the save button
  const saveUiSuggestions = () => {
    // In a real app, this would send the 'suggestions' state to a backend API
    console.log("Saving suggestions:", suggestions);
    alert("Current suggestions state has been logged to the console!");
  };

  // General state for other chatbot customizations
  const [welcomeMessage, setWelcomeMessage] = useState(
    "Hello! How can I help you today?"
  );
  const [botSubtitle, setBotSubtitle] = useState("AI Assistant");
  const [headerColor, setHeaderColor] = useState(
    "linear-gradient(135deg, #a855f7, #ec4899)"
  );
  const [headerStyleType, setHeaderStyleType] = useState("gradient");
  const [buttonColor, setButtonColor] = useState("#3b8276");
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [bgImage, setBgImage] = useState("");
  const [fontFamily, setFontFamily] = useState("Inter");

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Left Panel: Scrollable Controls */}
      <div className="w-2/5 p-6 space-y-8 bg-white overflow-y-auto">
        <h1 className="text-2xl font-bold text-gray-800">
          Chatbot Customization
        </h1>

        {/* Header Background Section */}
        <div className="space-y-3 p-4 bg-gray-100 rounded-lg">
          <label className="text-lg font-semibold text-gray-700">
            Header Background
          </label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                value="color"
                checked={headerStyleType === "color"}
                onChange={() => setHeaderStyleType("color")}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span>Solid Color</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                value="gradient"
                checked={headerStyleType === "gradient"}
                onChange={() => {
                  setHeaderStyleType("gradient");
                  if (headerColor.startsWith("#")) {
                    setHeaderColor(PRESET_GRADIENTS[0]);
                  }
                }}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span>Gradient</span>
            </label>
          </div>
          {headerStyleType === "color" ? (
            <div>
              <input
                type="color"
                value={headerColor.startsWith("#") ? headerColor : "#936661"}
                onChange={(e) => setHeaderColor(e.target.value)}
                className="w-full h-10 p-1 border border-gray-300 rounded"
              />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-5 gap-3 pt-2">
                {PRESET_GRADIENTS.map((grad, index) => (
                  <div
                    key={index}
                    className="w-10 h-10 rounded-full cursor-pointer transition-transform duration-150 ease-in-out hover:scale-110"
                    style={{
                      background: grad,
                      boxShadow:
                        headerColor === grad
                          ? "0 0 0 3px rgba(59, 130, 246, 0.7)"
                          : "none",
                    }}
                    onClick={() => setHeaderColor(grad)}
                    title={`Gradient ${index + 1}`}
                  />
                ))}
              </div>
              <div className="pt-4">
                <label className="block text-sm font-medium text-gray-600">
                  Or paste your own CSS gradient
                </label>
                <input
                  type="text"
                  className="w-full p-2 mt-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 font-mono text-xs"
                  placeholder="e.g., linear-gradient(...)"
                  value={
                    headerColor.startsWith("linear-gradient") ? headerColor : ""
                  }
                  onChange={(e) => setHeaderColor(e.target.value)}
                />
              </div>
            </>
          )}
        </div>

        {/* Other Component Colors Section */}
        <div className="space-y-4">
          <label className="text-lg font-semibold text-gray-700">
            Other Component Colors
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Send/Mic Buttons
              </label>
              <input
                type="color"
                value={buttonColor}
                onChange={(e) => setButtonColor(e.target.value)}
                className="w-full h-10 p-1 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Button Text
              </label>
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-full h-10 p-1 border border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        {/* Bot Content Section */}
        <div className="space-y-4">
          <label className="text-lg font-semibold text-gray-700">
            Bot Content
          </label>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-600">
              Bot Subtitle
            </label>
            <input
              type="text"
              value={botSubtitle}
              onChange={(e) => setBotSubtitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., AI Assistant"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-600">
              Welcome Message
            </label>
            <input
              type="text"
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* UI Suggestions Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">
            UI Suggestions (Max 5)
          </h3>
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="p-3 bg-gray-50 rounded-md border border-gray-200 space-y-3"
            >
              {/* Row 1: Label and Remove */}
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-500">{index + 1}.</span>
                <input
                  type="text"
                  placeholder="Suggestion Label"
                  value={suggestion.label}
                  onChange={(e) =>
                    handleSuggestionChange(index, "label", e.target.value)
                  }
                  className="border border-gray-300 rounded-md px-3 py-2 w-full"
                />
                <button
                  onClick={() => handleRemoveSuggestion(index)}
                  className="text-red-500 hover:text-red-700 p-2"
                  title="Remove Suggestion"
                >
                  <FaIcons.FaTrash />
                </button>
              </div>

              {/* Row 2: Icon Picker */}
              <IconPicker
                value={suggestion.icon}
                onChange={(iconName) =>
                  handleSuggestionChange(index, "icon", iconName)
                }
              />

              {/* Row 3: Per-Item Background Controls */}
              <div className="pt-2">
                <label className="text-sm font-medium text-gray-600">
                  Icon Background
                </label>
                <div className="flex items-center space-x-4 mt-1">
                  <label className="flex items-center space-x-2 cursor-pointer text-sm">
                    <input
                      type="radio"
                      value="color"
                      checked={suggestion.bgType === "color"}
                      onChange={() =>
                        handleSuggestionChange(index, "bgType", "color")
                      }
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span>Solid</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer text-sm">
                    <input
                      type="radio"
                      value="gradient"
                      checked={suggestion.bgType === "gradient"}
                      onChange={() => {
                        handleSuggestionChange(index, "bgType", "gradient");
                        if (suggestion.bg.startsWith("#")) {
                          handleSuggestionChange(
                            index,
                            "bg",
                            PRESET_GRADIENTS[0]
                          );
                        }
                      }}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span>Gradient</span>
                  </label>
                </div>

                {suggestion.bgType === "color" ? (
                  <div className="mt-2">
                    <input
                      type="color"
                      value={
                        suggestion.bg.startsWith("#")
                          ? suggestion.bg
                          : "#cccccc"
                      }
                      onChange={(e) =>
                        handleSuggestionChange(index, "bg", e.target.value)
                      }
                      className="w-full h-10 p-1 border border-gray-300 rounded"
                    />
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-7 gap-2 pt-2">
                      {PRESET_GRADIENTS.map((grad, gradIndex) => (
                        <div
                          key={gradIndex}
                          className="w-8 h-8 rounded-full cursor-pointer transition-transform duration-150 ease-in-out hover:scale-110"
                          style={{
                            background: grad,
                            boxShadow:
                              suggestion.bg === grad
                                ? "0 0 0 3px rgba(59, 130, 246, 0.7)"
                                : "none",
                          }}
                          onClick={() =>
                            handleSuggestionChange(index, "bg", grad)
                          }
                        />
                      ))}
                    </div>
                    {/* --- NEW: Custom Gradient Input per item --- */}
                    <div className="pt-3">
                      <label className="block text-xs font-medium text-gray-500">
                        Or paste CSS
                      </label>
                      <input
                        type="text"
                        className="w-full p-1 mt-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 font-mono text-xs"
                        placeholder="linear-gradient(...)"
                        value={
                          suggestion.bg.startsWith("linear-gradient")
                            ? suggestion.bg
                            : ""
                        }
                        onChange={(e) =>
                          handleSuggestionChange(index, "bg", e.target.value)
                        }
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleAddSuggestion}
              disabled={suggestions.length >= 5}
              className="bg-gray-200 px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Suggestion
            </button>
            <button
              onClick={saveUiSuggestions}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="space-y-4">{/* ... appearance controls ... */}</div>
      </div>

      {/* Right Panel: Fixed Preview */}
      <div className="w-3/5 p-6 border-l border-gray-200 bg-gray-100">
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className="w-full max-w-md h-[700px] max-h-[90vh]">
            <ChatbotPreview
              botSubtitle={botSubtitle}
              headerColor={headerColor}
              buttonColor={buttonColor}
              textColor={textColor}
              welcomeMessage={welcomeMessage}
              suggestions={suggestions}
              bgImage={bgImage}
              fontFamily={fontFamily}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotCustomizationPage;

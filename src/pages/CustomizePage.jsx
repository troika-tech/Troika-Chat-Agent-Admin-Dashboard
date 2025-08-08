import React, { useState } from "react";
import ChatbotPreview from "../components/ChatbotPreview";
import IconPicker from "../components/IconPicker";
import * as FaIcons from "react-icons/fa";
import { motion } from "framer-motion";
import {
  Plus,
  Trash2,
  Palette,
  Save,
  MessageSquare,
  Type
} from "lucide-react";
import "@fontsource/outfit";
import { ToggleButton, ToggleButtonGroup, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

// === Gradient Presets ===
const PRESET_GRADIENTS = [
  "linear-gradient(135deg, #a855f7, #ec4899)",
  "linear-gradient(to right, #d43f8d, #0250c5)",
  "linear-gradient(135deg, #667eea, #764ba2)",
  "linear-gradient(to right, #84fab0, #8fd3f4)",
  "linear-gradient(to right, #ff7e5f, #feb47b)",
  "linear-gradient(to right, #43e97b, #38f9d7)",
  "linear-gradient(to right, #ff8177, #f99185, #b12a5b)",
  "linear-gradient(to right, #a18cd1, #fbc2eb)",
  "linear-gradient(to top, #5ee7df, #b490ca)",
  "linear-gradient(to right, #4facfe, #00f2fe)",
  "linear-gradient(to right, #fa709a, #fee140)"
];

// 30 popular Google Fonts
const GOOGLE_FONTS = [
  "Outfit",
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Poppins",
  "Montserrat",
  "Raleway",
  "Oswald",
  "Noto Sans",
  "Merriweather",
  "Source Sans Pro",
  "Ubuntu",
  "Playfair Display",
  "Fira Sans",
  "Rubik",
  "Quicksand",
  "Work Sans",
  "Inconsolata",
  "Caveat",
  "Pacifico",
  "Lobster",
  "Nunito",
  "Exo 2",
  "Teko",
  "Kanit",
  "Josefin Sans",
  "Bebas Neue",
  "Signika",
  "Asap"
];

const ChatbotCustomizationPage = () => {
  const [suggestions, setSuggestions] = useState([
    { label: "Our Services", icon: "FaCogs", bg: "#6366f1", bgType: "color" },
    { label: "Contact Us", icon: "FaPhone", bg: "#ec4899", bgType: "color" },
    {
      label: "View Pricing",
      icon: "FaTags",
      bg: "linear-gradient(to right, #84fab0, #8fd3f4)",
      bgType: "gradient"
    }
  ]);
  const [welcomeMessage, setWelcomeMessage] = useState(
    "Hello! How can I help you today?"
  );
  const [botSubtitle, setBotSubtitle] = useState("AI Assistant");
  const [headerColor, setHeaderColor] = useState(
    "linear-gradient(135deg, #a855f7, #ec4899)"
  );
  const [headerStyleType, setHeaderStyleType] = useState("gradient");
  const [buttonColor, setButtonColor] = useState("#3b8276");
  const [buttonStyleType, setButtonStyleType] = useState("color");
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [bgImage, setBgImage] = useState("");
  const [fontFamily, setFontFamily] = useState("Outfit");
  const [errorMessage, setErrorMessage] = useState("");

  // === Handlers ===
  const handleSuggestionChange = (index, field, value) => {
    const newSuggestions = [...suggestions];
    newSuggestions[index][field] = value;
    setSuggestions(newSuggestions);
  };

  const handleAddSuggestion = () => {
    if (suggestions.length >= 5) {
      setErrorMessage("You can only add up to 5 suggestions.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    setSuggestions([
      ...suggestions,
      {
        label: "",
        icon: "FaQuestionCircle",
        bg: "#cccccc",
        bgType: "color"
      }
    ]);
  };

  const handleRemoveSuggestion = (index) => {
    if (suggestions.length > 1) {
      setSuggestions(suggestions.filter((_, i) => i !== index));
    }
  };

  const saveUiSuggestions = () => {
    console.log("Saving suggestions:", suggestions);
    alert("Customization Saved!");
  };

  return (
    <div className="flex h-screen" >
      {/* LEFT PANEL */}
      <div className="w-1/2 overflow-y-auto p-8 space-y-8 bg-white shadow-lg border-r border-gray-200">
        {/* PAGE TITLE */}
        <motion.h1
          className="text-3xl font-bold text-gray-900"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Chatbot Customization
        </motion.h1>

        {/* FONT SELECTOR */}
        <FormControl fullWidth sx={{ mt: 2, mb: 4 }}>
          <InputLabel id="font-select-label">Font Family</InputLabel>
          <Select
            labelId="font-select-label"
            id="font-select"
            value={fontFamily}
            label="Font Family"
            onChange={(e) => setFontFamily(e.target.value)}
          >
            {GOOGLE_FONTS.map((font) => (
              <MenuItem key={font} value={font} style={{ fontFamily: font }}>
                {font}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* HEADER CUSTOMIZATION */}
        <SectionCard title="Header Background" icon={<Palette size={20} />}>
          <ToggleButtonGroup
            value={headerStyleType}
            exclusive
            onChange={(e, val) => {
              if (val) {
                setHeaderStyleType(val);
                if (val === "gradient" && headerColor.startsWith("#")) {
                  setHeaderColor(PRESET_GRADIENTS[0]);
                }
              }
            }}
            sx={{ mt: 2 }}
          >
            <ToggleButton value="color">Solid Color</ToggleButton>
            <ToggleButton value="gradient">Gradient</ToggleButton>
          </ToggleButtonGroup>

          {headerStyleType === "color" ? (
            <ColorInput
              value={headerColor}
              onChange={(e) => setHeaderColor(e.target.value)}
            />
          ) : (
            <GradientGrid
              gradients={PRESET_GRADIENTS}
              selected={headerColor}
              onSelect={setHeaderColor}
            />
          )}
        </SectionCard>

        {/* BUTTON CUSTOMIZATION */}
        <SectionCard title="Button Styles" icon={<Palette size={20} />}>
          <ToggleButtonGroup
            value={buttonStyleType}
            exclusive
            onChange={(e, val) => {
              if (val) {
                setButtonStyleType(val);
                if (val === "gradient" && buttonColor.startsWith("#")) {
                  setButtonColor(PRESET_GRADIENTS[0]);
                }
              }
            }}
            sx={{ mt: 2 }}
          >
            <ToggleButton value="color">Solid Color</ToggleButton>
            <ToggleButton value="gradient">Gradient</ToggleButton>
          </ToggleButtonGroup>

          {buttonStyleType === "color" ? (
            <ColorInput
              value={buttonColor}
              onChange={(e) => setButtonColor(e.target.value)}
            />
          ) : (
            <GradientGrid
              gradients={PRESET_GRADIENTS}
              selected={buttonColor}
              onSelect={setButtonColor}
            />
          )}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-600">
              Button Text Color
            </label>
            <ColorInput
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
            />
          </div>
        </SectionCard>

        {/* BOT CONTENT */}
        <SectionCard title="Bot Content" icon={<MessageSquare size={20} />}>
          <TextInput
            label="Bot Subtitle"
            value={botSubtitle}
            onChange={(e) => setBotSubtitle(e.target.value)}
          />
          <TextInput
            label="Welcome Message"
            value={welcomeMessage}
            onChange={(e) => setWelcomeMessage(e.target.value)}
          />
        </SectionCard>

        {/* UI SUGGESTIONS */}
        <SectionCard title="UI Suggestions" icon={<Type size={20} />}>
          {errorMessage && (
            <p className="text-red-500 text-sm mb-2">{errorMessage}</p>
          )}

          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="mt-4 p-4 bg-gray-50 rounded-xl flex flex-col gap-3 border border-gray-200"
            >
              <div className="flex justify-between items-center">
                <input
                  type="text"
                  value={suggestion.label}
                  onChange={(e) =>
                    handleSuggestionChange(index, "label", e.target.value)
                  }
                  className="border p-2 rounded-lg flex-1"
                  placeholder="Suggestion Label"
                />
                <button
                  onClick={() => handleRemoveSuggestion(index)}
                  className="ml-3 text-red-500 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              <IconPicker
                value={suggestion.icon}
                onChange={(icon) =>
                  handleSuggestionChange(index, "icon", icon)
                }
              />

              {/* Solid/Gradient selector for each suggestion */}
              <ToggleButtonGroup
                value={suggestion.bgType}
                exclusive
                onChange={(e, val) => {
                  if (val) {
                    handleSuggestionChange(index, "bgType", val);
                    if (
                      val === "gradient" &&
                      suggestion.bg.startsWith("#")
                    ) {
                      handleSuggestionChange(
                        index,
                        "bg",
                        PRESET_GRADIENTS[0]
                      );
                    }
                  }
                }}
              >
                <ToggleButton value="color">Solid</ToggleButton>
                <ToggleButton value="gradient">Gradient</ToggleButton>
              </ToggleButtonGroup>

              {suggestion.bgType === "color" ? (
                <ColorInput
                  value={suggestion.bg}
                  onChange={(e) =>
                    handleSuggestionChange(index, "bg", e.target.value)
                  }
                />
              ) : (
                <GradientGrid
                  gradients={PRESET_GRADIENTS}
                  selected={suggestion.bg}
                  onSelect={(grad) =>
                    handleSuggestionChange(index, "bg", grad)
                  }
                />
              )}
            </div>
          ))}

          <div className="flex gap-3 mt-4">
            <ActionButton
              onClick={handleAddSuggestion}
              icon={<Plus size={18} />}
              label="Add Suggestion"
            />
            <ActionButton
              onClick={saveUiSuggestions}
              icon={<Save size={18} />}
              label="Save"
              primary
            />
          </div>
        </SectionCard>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-1/2 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-[380px] h-[680px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200"
        >
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
        </motion.div>
      </div>
    </div>
  );
};

/* === Reusable Components === */
const SectionCard = ({ title, icon, children }) => (
  <motion.section
    className="bg-white p-6 rounded-2xl shadow-md border border-gray-100"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <h2 className="text-xl font-semibold flex items-center gap-2">
      {icon} {title}
    </h2>
    {children}
  </motion.section>
);

const ColorInput = ({ value, onChange }) => (
  <input
    type="color"
    value={value.startsWith("#") ? value : "#000000"}
    onChange={onChange}
    className="mt-4 w-full h-12 rounded-lg border border-gray-200"
  />
);

const GradientGrid = ({ gradients, selected, onSelect }) => (
  <div className="grid grid-cols-6 gap-3 mt-4">
    {gradients.map((grad, idx) => (
      <div
        key={idx}
        onClick={() => onSelect(grad)}
        className={`w-12 h-12 rounded-full cursor-pointer border-2 ${
          selected === grad ? "border-indigo-500" : "border-transparent"
        }`}
        style={{ background: grad }}
      />
    ))}
  </div>
);

const TextInput = ({ label, value, onChange }) => (
  <div className="mt-4">
    <label className="block text-sm font-medium text-gray-600">{label}</label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
    />
  </div>
);

const ActionButton = ({ onClick, icon, label, primary }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
      primary
        ? "bg-indigo-500 text-white hover:bg-indigo-600"
        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
    }`}
  >
    {icon} {label}
  </button>
);

export default ChatbotCustomizationPage;

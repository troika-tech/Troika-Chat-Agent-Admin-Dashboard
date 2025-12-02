import React, { useState, useMemo } from "react";
import { Search, ChevronDown, X } from "lucide-react";
import * as FaIcons from "react-icons/fa";

// Comprehensive list of 80 commonly used Font Awesome icons
// Note: Icons are filtered to only show those that exist in react-icons/fa
const ALL_ICONS = [
  // Navigation & Basic (10)
  { name: "FaHome", label: "Home", category: "Navigation" },
  { name: "FaGlobe", label: "Globe/Website", category: "Navigation" },
  { name: "FaLink", label: "Link", category: "Navigation" },
  { name: "FaBars", label: "Menu", category: "Navigation" },
  { name: "FaArrowRight", label: "Arrow Right", category: "Navigation" },
  { name: "FaArrowLeft", label: "Arrow Left", category: "Navigation" },
  { name: "FaChevronRight", label: "Chevron Right", category: "Navigation" },
  { name: "FaChevronLeft", label: "Chevron Left", category: "Navigation" },
  { name: "FaTh", label: "Grid View", category: "Navigation" },
  { name: "FaList", label: "List View", category: "Navigation" },

  // Communication (10)
  { name: "FaEnvelope", label: "Email", category: "Communication" },
  { name: "FaPhone", label: "Phone", category: "Communication" },
  { name: "FaPhoneAlt", label: "Phone Alt", category: "Communication" },
  { name: "FaComment", label: "Comment", category: "Communication" },
  { name: "FaComments", label: "Comments", category: "Communication" },
  { name: "FaPaperPlane", label: "Send Message", category: "Communication" },
  { name: "FaInbox", label: "Inbox", category: "Communication" },
  { name: "FaBell", label: "Notifications", category: "Communication" },
  { name: "FaRss", label: "RSS Feed", category: "Communication" },
  { name: "FaAt", label: "Mention", category: "Communication" },

  // Business & Commerce (10)
  { name: "FaShoppingCart", label: "Shopping Cart", category: "Business" },
  { name: "FaStore", label: "Store/Shop", category: "Business" },
  { name: "FaCreditCard", label: "Payment", category: "Business" },
  { name: "FaDollarSign", label: "Money/Price", category: "Business" },
  { name: "FaTag", label: "Tag/Product", category: "Business" },
  { name: "FaTags", label: "Tags", category: "Business" },
  { name: "FaGift", label: "Gift/Offers", category: "Business" },
  { name: "FaPercent", label: "Discount", category: "Business" },
  { name: "FaReceipt", label: "Receipt/Invoice", category: "Business" },
  { name: "FaHandshake", label: "Partnership", category: "Business" },

  // Content & Media (10)
  { name: "FaBook", label: "Book/Documentation", category: "Content" },
  { name: "FaFileAlt", label: "Document", category: "Content" },
  { name: "FaNewspaper", label: "News/Blog", category: "Content" },
  { name: "FaVideo", label: "Video", category: "Content" },
  { name: "FaImage", label: "Image/Gallery", category: "Content" },
  { name: "FaImages", label: "Images", category: "Content" },
  { name: "FaMusic", label: "Music", category: "Content" },
  { name: "FaFilm", label: "Movies", category: "Content" },
  { name: "FaPodcast", label: "Podcast", category: "Content" },
  { name: "FaPlay", label: "Play Video", category: "Content" },

  // User & Account (10)
  { name: "FaUser", label: "User/Profile", category: "User" },
  { name: "FaUserCircle", label: "User Circle", category: "User" },
  { name: "FaUsers", label: "Users/Team", category: "User" },
  { name: "FaUserFriends", label: "Friends", category: "User" },
  { name: "FaUserPlus", label: "Add User", category: "User" },
  { name: "FaUserCheck", label: "Verified User", category: "User" },
  { name: "FaUserShield", label: "Admin/Protected", category: "User" },
  { name: "FaIdCard", label: "ID Card", category: "User" },
  { name: "FaAddressBook", label: "Contacts", category: "User" },
  { name: "FaUserCog", label: "User Settings", category: "User" },

  // Tools & Settings (10)
  { name: "FaCog", label: "Settings", category: "Tools" },
  { name: "FaTools", label: "Tools", category: "Tools" },
  { name: "FaWrench", label: "Maintenance", category: "Tools" },
  { name: "FaLock", label: "Security/Lock", category: "Tools" },
  { name: "FaKey", label: "Key/Access", category: "Tools" },
  { name: "FaShieldAlt", label: "Security", category: "Tools" },
  { name: "FaSearch", label: "Search", category: "Tools" },
  { name: "FaFilter", label: "Filter", category: "Tools" },
  { name: "FaSort", label: "Sort", category: "Tools" },
  { name: "FaDownload", label: "Download", category: "Tools" },

  // Social & Sharing (10)
  { name: "FaShare", label: "Share", category: "Social" },
  { name: "FaShareAlt", label: "Share Alt", category: "Social" },
  { name: "FaHeart", label: "Like/Favorite", category: "Social" },
  { name: "FaStar", label: "Star/Rating", category: "Social" },
  { name: "FaThumbsUp", label: "Like", category: "Social" },
  { name: "FaThumbsDown", label: "Dislike", category: "Social" },
  { name: "FaBookmark", label: "Bookmark", category: "Social" },
  { name: "FaFlag", label: "Flag/Report", category: "Social" },
  { name: "FaRetweet", label: "Retweet/Repost", category: "Social" },
  { name: "FaCommentDots", label: "Comment Dots", category: "Social" },

  // Location & Maps (5)
  { name: "FaMap", label: "Map", category: "Location" },
  { name: "FaMapMarkerAlt", label: "Location Marker", category: "Location" },
  { name: "FaMapPin", label: "Pin Location", category: "Location" },
  { name: "FaDirections", label: "Directions", category: "Location" },
  { name: "FaRoute", label: "Route", category: "Location" },

  // Actions & Utilities (10)
  { name: "FaPlus", label: "Add/Create", category: "Actions" },
  { name: "FaEdit", label: "Edit", category: "Actions" },
  { name: "FaTrash", label: "Delete", category: "Actions" },
  { name: "FaSave", label: "Save", category: "Actions" },
  { name: "FaPrint", label: "Print", category: "Actions" },
  { name: "FaCopy", label: "Copy", category: "Actions" },
  { name: "FaCut", label: "Cut", category: "Actions" },
  { name: "FaPaste", label: "Paste", category: "Actions" },
  { name: "FaUndo", label: "Undo", category: "Actions" },
  { name: "FaRedo", label: "Redo", category: "Actions" },

  // Special & Custom (5)
  { name: "FaInfoCircle", label: "Information", category: "Special" },
  { name: "FaQuestionCircle", label: "Help/FAQ", category: "Special" },
  { name: "FaExclamationCircle", label: "Warning", category: "Special" },
  { name: "FaCheckCircle", label: "Success/Check", category: "Special" },
  { name: "FaTimesCircle", label: "Error/Close", category: "Special" },
];

// Filter to only include icons that actually exist in react-icons/fa
const AVAILABLE_ICONS = ALL_ICONS.filter((icon) => FaIcons[icon.name] !== undefined);

const IconSelector = ({ value, onChange, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter icons based on search query
  const filteredIcons = useMemo(() => {
    if (!searchQuery.trim()) {
      return AVAILABLE_ICONS;
    }
    const query = searchQuery.toLowerCase();
    return AVAILABLE_ICONS.filter(
      (icon) =>
        icon.name.toLowerCase().includes(query) ||
        icon.label.toLowerCase().includes(query) ||
        icon.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Get current icon component
  const CurrentIcon = value && FaIcons[value] ? FaIcons[value] : null;

  // Group icons by category
  const groupedIcons = useMemo(() => {
    const groups = {};
    filteredIcons.forEach((icon) => {
      if (!groups[icon.category]) {
        groups[icon.category] = [];
      }
      groups[icon.category].push(icon);
    });
    return groups;
  }, [filteredIcons]);

  const handleSelectIcon = (iconName) => {
    onChange(iconName);
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div className={`relative ${className}`}>
      {/* Selected Icon Display */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-700 bg-white flex items-center justify-between hover:border-teal-400 transition-colors"
      >
        <div className="flex items-center gap-3">
          {CurrentIcon ? (
            <>
              <CurrentIcon className="h-5 w-5 text-teal-600" />
              <span className="font-mono text-sm">{value}</span>
            </>
          ) : (
            <span className="text-gray-400">Select an icon...</span>
          )}
        </div>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Panel */}
          <div className="absolute z-20 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-xl max-h-96 overflow-hidden flex flex-col">
            {/* Search Bar */}
            <div className="p-3 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search icons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Icons List */}
            <div className="overflow-y-auto flex-1">
              {Object.keys(groupedIcons).length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <p>No icons found</p>
                </div>
              ) : (
                Object.entries(groupedIcons).map(([category, icons]) => (
                  <div key={category} className="mb-4">
                    <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                      <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        {category}
                      </h3>
                    </div>
                    <div className="grid grid-cols-4 gap-2 p-3">
                      {icons.map((icon) => {
                        const IconComponent = FaIcons[icon.name];
                        const isSelected = value === icon.name;

                        return (
                          <button
                            key={icon.name}
                            type="button"
                            onClick={() => handleSelectIcon(icon.name)}
                            className={`
                              flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all
                              ${
                                isSelected
                                  ? "border-teal-500 bg-teal-50"
                                  : "border-gray-200 hover:border-teal-300 hover:bg-gray-50"
                              }
                            `}
                            title={icon.label}
                          >
                            {IconComponent ? (
                              <IconComponent
                                className={`h-6 w-6 mb-1 ${
                                  isSelected ? "text-teal-600" : "text-gray-600"
                                }`}
                              />
                            ) : (
                              <div className="h-6 w-6 mb-1 bg-gray-200 rounded" />
                            )}
                            <span
                              className={`text-xs font-mono truncate w-full text-center ${
                                isSelected ? "text-teal-700" : "text-gray-500"
                              }`}
                            >
                              {icon.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      <p className="mt-1 text-xs text-gray-500">
        Click to select an icon from {AVAILABLE_ICONS.length} available options
      </p>
    </div>
  );
};

export default IconSelector;


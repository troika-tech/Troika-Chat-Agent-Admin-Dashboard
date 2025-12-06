import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  fetchChatbots,
  getChatbotUIConfig,
  updateChatbotUIAvatar,
  updateChatbotUIWelcomeText,
  updateChatbotUIAssistantHeader,
  updateChatbotUITabConfig,
  updateChatbotUIInputPlaceholders,
  getWhatsAppProposalTemplates,
  createWhatsAppProposalTemplate,
  updateWhatsAppProposalTemplate,
  deleteWhatsAppProposalTemplate,
  updateWhatsAppProposalSettings,
  getChatbotSidebarConfig,
  updateChatbotSidebarEnabled,
  updateChatbotSidebarWhatsApp,
  updateChatbotSidebarCall,
  updateChatbotSidebarCalendly,
  updateChatbotSidebarEmail,
  getEmailTemplates,
  createEmailTemplate,
  updateEmailTemplate,
  deleteEmailTemplate,
  getSocialMediaLinks,
  createSocialMediaLink,
  updateSocialMediaLink,
  deleteSocialMediaLink,
  updateChatbotSidebarSocial,
  updateChatbotSidebarBranding,
  updateChatbotSidebarHeader,
  getCustomNavigationItems,
  createCustomNavigationItem,
  updateCustomNavigationItem,
  deleteCustomNavigationItem,
  updateChatbotSidebarCustomNav,
  getAuthConfigAdmin,
  updateAuthConfig,
  getIntentConfigAdmin,
  updateIntentConfig,
  getTranscriptConfigAdmin,
  updateTranscriptConfig,
  getZohoConfigAdmin,
  updateZohoConfig,
  testZohoConnection,
  getZohoAuthorizationUrl,
  exchangeZohoCodeForToken,
} from "../services/api";
import { Image, Type, Loader2, MessageSquare, Phone, Settings, Calendar, Mail, Plus, Edit2, Trash2, X, Share2, Sparkles, Heading, Navigation, Monitor, ArrowLeft, Eye, EyeOff, Search, Shield, FileText, Database, CheckCircle2 } from "lucide-react";
import AISensyConfigFields from "../components/auth/AISensyConfigFields";
import TwilioConfigFields from "../components/auth/TwilioConfigFields";
import MessageBirdConfigFields from "../components/auth/MessageBirdConfigFields";
import Dialog360ConfigFields from "../components/auth/Dialog360ConfigFields";
import GupshupConfigFields from "../components/auth/GupshupConfigFields";
import IconSelector from "../components/IconSelector";
import api from "../services/api";

const ManageChatbotUIPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const chatbotIdFromQuery = searchParams.get("chatbotId");

  // Table view state
  const [companies, setCompanies] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [tableRows, setTableRows] = useState([]);
  const [editingManagedBy, setEditingManagedBy] = useState({});
  const [managedByValues, setManagedByValues] = useState({});
  const [updatingStatus, setUpdatingStatus] = useState({});
  const [updatingManagedBy, setUpdatingManagedBy] = useState({});
  // Username editing state
  const [editingUsername, setEditingUsername] = useState({});
  const [usernameValues, setUsernameValues] = useState({});
  const [updatingUsername, setUpdatingUsername] = useState({});
  // Password editing state
  const [editingPassword, setEditingPassword] = useState({});
  const [passwordValues, setPasswordValues] = useState({});
  const [updatingPassword, setUpdatingPassword] = useState({});
  const [showPassword, setShowPassword] = useState({}); // Track password visibility per company
  const [showPasswordInput, setShowPasswordInput] = useState({}); // Track input visibility when editing
  const [decryptedPasswords, setDecryptedPasswords] = useState({}); // Store decrypted passwords
  const [canDecryptPassword, setCanDecryptPassword] = useState({}); // Track which companies can decrypt
  const [loadingPassword, setLoadingPassword] = useState({}); // Track password loading state
  // Phone number editing state
  const [editingPhone, setEditingPhone] = useState({});
  const [phoneValues, setPhoneValues] = useState({});
  const [updatingPhone, setUpdatingPhone] = useState({});
  // Search state
  const [search, setSearch] = useState("");
  
  // Debug: Log canDecryptPassword state changes
  useEffect(() => {
    console.log('[Password Debug] canDecryptPassword state:', canDecryptPassword);
  }, [canDecryptPassword]);

  // Configuration view state
  const [chatbots, setChatbots] = useState([]);
  const [selectedChatbotId, setSelectedChatbotId] = useState(chatbotIdFromQuery || "");
  const [selectedChatbot, setSelectedChatbot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [welcomeText, setWelcomeText] = useState("");
  const [assistantDisplayName, setAssistantDisplayName] = useState("");
  const [assistantLogoUrl, setAssistantLogoUrl] = useState("");
  const [updatingAvatar, setUpdatingAvatar] = useState(false);
  const [updatingText, setUpdatingText] = useState(false);
  const [activeSection, setActiveSection] = useState("avatar"); // Single state for active tab

  // Sidebar configuration state
  const [sidebarEnabled, setSidebarEnabled] = useState(false);
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [whatsappMode, setWhatsappMode] = useState("premium_modal");
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [whatsappText, setWhatsappText] = useState("Connect on WhatsApp");
  const [callEnabled, setCallEnabled] = useState(false);
  const [callMode, setCallMode] = useState("premium_modal");
  const [callNumber, setCallNumber] = useState("");
  const [callText, setCallText] = useState("Talk to a Counsellor");
  const [calendlyEnabled, setCalendlyEnabled] = useState(false);
  const [calendlyMode, setCalendlyMode] = useState("premium_modal");
  const [calendlyUrl, setCalendlyUrl] = useState("");
  const [calendlyText, setCalendlyText] = useState("Schedule a Meeting");
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [emailMode, setEmailMode] = useState("premium_modal");
  const [emailText, setEmailText] = useState("Send an Email");
  const [socialEnabled, setSocialEnabled] = useState(false);
  const [brandingEnabled, setBrandingEnabled] = useState(false);
  const [brandingText, setBrandingText] = useState("Powered by");
  const [brandingCompany, setBrandingCompany] = useState("Troika Tech");
  const [brandingLogoUrl, setBrandingLogoUrl] = useState("");
  const [brandingLogoLink, setBrandingLogoLink] = useState("");
  const [headerEnabled, setHeaderEnabled] = useState(false);
  const [headerText, setHeaderText] = useState("");
  const [headerLogoUrl, setHeaderLogoUrl] = useState("");
  const [headerLogoLink, setHeaderLogoLink] = useState("");
  const [updatingMaster, setUpdatingMaster] = useState(false);
  const [updatingWhatsApp, setUpdatingWhatsApp] = useState(false);
  const [updatingCall, setUpdatingCall] = useState(false);
  const [updatingCalendly, setUpdatingCalendly] = useState(false);
  
  // Authentication configuration state
  const [authConfig, setAuthConfig] = useState({
    auth_enabled: false,
    auth_provider: 'aisensy',
    auth_trigger_message_count: 1,
    provider_config: {},
    auth_phone_prompt_text: "To continue chat, please type your whatsapp number.",
    auth_otp_prompt_text: "I've sent an OTP to your whatsapp number. Please enter the 6-digit OTP code.",
    auth_success_text: "Great! You're verified. How can I help you?",
  });
  const [updatingAuth, setUpdatingAuth] = useState(false);
  const [showAuthPassword, setShowAuthPassword] = useState({
    aisensy_api_key: false,
    twilio_account_sid: false,
    twilio_auth_token: false,
    messagebird_api_key: false,
    dialog360_api_key: false,
    gupshup_api_key: false,
  });

  // Intent configuration state
  const [intentConfig, setIntentConfig] = useState({
    enabled: false,
    keywords: [],
    proposal_template_name: "",
    proposal_campaign_name: "",
    confirmation_prompt_text: "Would you like me to send the proposal to your WhatsApp number?",
    success_message: "✅ Proposal sent to your WhatsApp number!",
    toast_message: "Proposal sent successfully! 📱",
    positive_responses: ["yes", "yep", "sure", "ok", "send it", "please", "go ahead", "yes please"],
    negative_responses: ["no", "not now", "later", "maybe later", "not yet"],
    timeout_minutes: 5,
  });
  const [intentConfigLoading, setIntentConfigLoading] = useState(false);
  const [updatingIntent, setUpdatingIntent] = useState(false);
  const [newKeyword, setNewKeyword] = useState("");

  // Transcript configuration state
  const [transcriptConfig, setTranscriptConfig] = useState({
    enabled: false,
    template_name: "",
    campaign_name: "",
    company_name: "",
    inactivity_timeout_ms: null,
    pdf_filename: "Chat-Summary.pdf",
  });
  const [transcriptConfigLoading, setTranscriptConfigLoading] = useState(false);

  // Zoho CRM Integration state
  const [zohoConfig, setZohoConfig] = useState({
    enabled: false,
    capture_intent_keywords: [],
    required_fields: ['name', 'phone', 'email'],
    optional_fields: ['company'],
    name_prompt_text: "Great! What's your name?",
    phone_prompt_text: "What's your phone number?",
    email_prompt_text: "What's your email address?",
    company_prompt_text: "Which company are you from? (optional)",
    success_message: "✅ Thank you! We've saved your details. Our team will reach out soon!",
    zoho_region: 'com',
    zoho_module: 'Leads',
    zoho_client_id: '',
    zoho_client_secret: '',
    zoho_refresh_token: '',
    field_mapping: {
      name_field: 'First_Name',
      phone_field: 'Phone',
      email_field: 'Email',
      company_field: 'Company',
      source_field: 'Lead_Source',
      description_field: 'Description',
    },
  });
  const [zohoConfigLoading, setZohoConfigLoading] = useState(false);
  const [updatingZoho, setUpdatingZoho] = useState(false);
  const [testingZohoConnection, setTestingZohoConnection] = useState(false);
  const [generatingRefreshToken, setGeneratingRefreshToken] = useState(false);
  const [newZohoKeyword, setNewZohoKeyword] = useState('');
  const [manualAuthCode, setManualAuthCode] = useState('');
  const [exchangingManualCode, setExchangingManualCode] = useState(false);
  const [showZohoPassword, setShowZohoPassword] = useState({
    client_id: false,
    client_secret: false,
    refresh_token: false,
  });
  const [updatingTranscript, setUpdatingTranscript] = useState(false);
  const [updatingEmail, setUpdatingEmail] = useState(false);
  const [updatingSocial, setUpdatingSocial] = useState(false);
  const [updatingBranding, setUpdatingBranding] = useState(false);
  const [updatingHeader, setUpdatingHeader] = useState(false);
  const [tabTitle, setTabTitle] = useState("");
  const [faviconUrl, setFaviconUrl] = useState("");
  const [updatingTab, setUpdatingTab] = useState(false);
  
  // Input placeholder configuration state
  const [inputPlaceholdersEnabled, setInputPlaceholdersEnabled] = useState(false);
  const [inputPlaceholders, setInputPlaceholders] = useState(["Ask me anything...", "How can I help you?", "What would you like to know?"]);
  const [inputPlaceholderSpeed, setInputPlaceholderSpeed] = useState(2.5);
  const [inputPlaceholderAnimation, setInputPlaceholderAnimation] = useState("fade");
  const [updatingPlaceholders, setUpdatingPlaceholders] = useState(false);
  
  // WhatsApp Proposal configuration state
  const [whatsappProposalEnabled, setWhatsappProposalEnabled] = useState(false);
  const [whatsappProposalText, setWhatsappProposalText] = useState("Send Proposal via WhatsApp");
  const [whatsappProposalDefaultApiKey, setWhatsappProposalDefaultApiKey] = useState("");
  const [whatsappProposalDefaultOrgSlug, setWhatsappProposalDefaultOrgSlug] = useState("");
  const [whatsappProposalDefaultSenderName, setWhatsappProposalDefaultSenderName] = useState("");
  const [whatsappProposalDefaultCountryCode, setWhatsappProposalDefaultCountryCode] = useState("91");
  const [whatsappProposalTemplates, setWhatsappProposalTemplates] = useState([]);
  const [loadingProposalTemplates, setLoadingProposalTemplates] = useState(false);
  const [showProposalTemplateForm, setShowProposalTemplateForm] = useState(false);
  const [editingProposalTemplate, setEditingProposalTemplate] = useState(null);
  const [deletingProposalTemplate, setDeletingProposalTemplate] = useState(null);
  const [proposalTemplateFormData, setProposalTemplateFormData] = useState({
    display_name: "",
    description: "",
    campaign_name: "",
    template_name: "",
    api_key: "",
    org_slug: "",
    sender_name: "",
    country_code: "91",
    template_params: [],
    order: 0,
    is_active: true,
  });
  const [updatingProposalSettings, setUpdatingProposalSettings] = useState(false);

  // Email Templates state
  const [emailTemplates, setEmailTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [templateFormData, setTemplateFormData] = useState({
    template_name: "",
    email_subject: "",
    email_body: "",
    is_active: true,
    order: 0,
  });
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [deletingTemplate, setDeletingTemplate] = useState(null);
  const [showEmailPreview, setShowEmailPreview] = useState(false);

  // Social Media Links state
  const [socialLinks, setSocialLinks] = useState([]);
  const [loadingSocialLinks, setLoadingSocialLinks] = useState(false);
  const [showSocialLinkForm, setShowSocialLinkForm] = useState(false);
  const [editingSocialLink, setEditingSocialLink] = useState(null);
  const [socialLinkFormData, setSocialLinkFormData] = useState({
    url: "",
    platform: "custom",
    is_active: true,
    order: 0,
  });
  const [savingSocialLink, setSavingSocialLink] = useState(false);
  const [deletingSocialLink, setDeletingSocialLink] = useState(null);
  const [detectedPlatform, setDetectedPlatform] = useState(null);

  // Custom Navigation Items state
  const [customNavEnabled, setCustomNavEnabled] = useState(false);
  const [customNavItems, setCustomNavItems] = useState([]);
  const [loadingCustomNavItems, setLoadingCustomNavItems] = useState(false);
  const [showCustomNavForm, setShowCustomNavForm] = useState(false);
  const [editingCustomNavItem, setEditingCustomNavItem] = useState(null);
  const [customNavFormData, setCustomNavFormData] = useState({
    display_text: "",
    icon_name: "",
    redirect_url: "",
    is_active: true,
    order: 0,
  });
  const [savingCustomNavItem, setSavingCustomNavItem] = useState(false);
  const [deletingCustomNavItem, setDeletingCustomNavItem] = useState(null);
  const [updatingCustomNav, setUpdatingCustomNav] = useState(false);

  // Fetch companies with chatbots for table view
  useEffect(() => {
    if (!chatbotIdFromQuery) {
      fetchCompaniesData();
    }
  }, [chatbotIdFromQuery]);

  // Fetch chatbots list when chatbotId is in query
  useEffect(() => {
    if (chatbotIdFromQuery) {
    fetchChatbotsList();
      setSelectedChatbotId(chatbotIdFromQuery);
    }
  }, [chatbotIdFromQuery]);

  // Fetch UI config and sidebar config when chatbot is selected
  useEffect(() => {
    if (selectedChatbotId) {
      fetchUIConfig(selectedChatbotId);
      fetchSidebarConfig(selectedChatbotId);
      fetchAuthConfig(selectedChatbotId);
      fetchProposalTemplates(selectedChatbotId);
      fetchIntentConfig(selectedChatbotId);
      setActiveSection("avatar"); // Reset to first tab
    } else {
      setAvatarUrl("");
      setWelcomeText("");
      setAssistantDisplayName("");
      setAssistantLogoUrl("");
      setSelectedChatbot(null);
      setActiveSection("avatar");
      resetSidebarConfig();
    }
  }, [selectedChatbotId]);

  // Fetch data when section becomes active
  useEffect(() => {
    if (activeSection === "email" && selectedChatbotId) {
      fetchEmailTemplates(selectedChatbotId);
    }
    if (activeSection === "whatsapp-proposal" && selectedChatbotId) {
      fetchProposalTemplates(selectedChatbotId);
    }
  }, [activeSection, selectedChatbotId]);

  useEffect(() => {
    if (activeSection === "social" && selectedChatbotId) {
      fetchSocialMediaLinks(selectedChatbotId);
    }
  }, [activeSection, selectedChatbotId]);

  useEffect(() => {
    if (activeSection === "custom-nav" && selectedChatbotId) {
      fetchCustomNavigationItems(selectedChatbotId);
    }
  }, [activeSection, selectedChatbotId]);

  useEffect(() => {
    if (activeSection === "intent" && selectedChatbotId) {
      fetchIntentConfig(selectedChatbotId);
    }
    if (activeSection === "transcript" && selectedChatbotId) {
      fetchTranscriptConfig(selectedChatbotId);
    }
    if (activeSection === "zoho" && selectedChatbotId) {
      fetchZohoConfig(selectedChatbotId);
    }
  }, [activeSection, selectedChatbotId]);

  // Table view functions
  const fetchCompaniesData = async () => {
    try {
      setLoadingCompanies(true);
      const token = localStorage.getItem("adminToken");
      const response = await api.get('/company/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const companiesData = response.data.companies || response.data.data?.companies || [];
      setCompanies(companiesData);

      // Create table rows - one row per chatbot
      const rows = [];
      companiesData.forEach((company) => {
        const chatbots = company.chatbots || [];
        if (chatbots.length === 0) {
          // If no chatbots, still show company row
          rows.push({
            index: rows.length + 1,
            companyId: company._id,
            companyName: company.name || "",
            userName: company.userName || "",
            email: company.email || "",
            password: "••••••••",
            phoneNo: company.phoneNo || "",
            managedByName: company.managed_by_name || "",
            chatbotId: null,
            chatbotName: "No Chatbot",
            status: "inactive",
          });
          setManagedByValues(prev => ({ ...prev, [company._id]: company.managed_by_name || "" }));
          setUsernameValues(prev => ({ ...prev, [company._id]: company.userName || "" }));
          setPasswordValues(prev => ({ ...prev, [company._id]: "" })); // Password always starts empty
          // Check if password can be decrypted (for new companies with encrypted passwords)
          // Check both password_type and password_encrypted field as fallback
          const canDecrypt = company.password_type === 'encrypted' || !!company.password_encrypted;
          console.log(`[Password] Company ${company._id} (${company.name}): password_type="${company.password_type}", has_encrypted=${!!company.password_encrypted}, canDecrypt=${canDecrypt}`);
          console.log(`[Password] Full company object:`, { 
            _id: company._id, 
            password_type: company.password_type, 
            has_password_encrypted: !!company.password_encrypted,
            has_password_hash: !!company.password_hash
          });
          setCanDecryptPassword(prev => ({ ...prev, [company._id]: canDecrypt }));
        } else {
          chatbots.forEach((chatbot) => {
            rows.push({
              index: rows.length + 1,
              companyId: company._id,
              companyName: company.name || "",
              userName: company.userName || "",
              email: company.email || "",
              password: "••••••••",
              phoneNo: company.phoneNo || "",
              managedByName: company.managed_by_name || "",
              chatbotId: chatbot._id,
              chatbotName: chatbot.name || "",
              status: chatbot.status || "active",
            });
            setManagedByValues(prev => ({ ...prev, [company._id]: company.managed_by_name || "" }));
            setUsernameValues(prev => ({ ...prev, [company._id]: company.userName || "" }));
            setPasswordValues(prev => ({ ...prev, [company._id]: "" })); // Password always starts empty
            // Check if password can be decrypted (for new companies with encrypted passwords)
            // Check both password_type and password_encrypted field as fallback
            const canDecrypt = company.password_type === 'encrypted' || !!company.password_encrypted;
            console.log(`[Password] Company ${company._id} (${company.name}): password_type="${company.password_type}", has_encrypted=${!!company.password_encrypted}, canDecrypt=${canDecrypt}`);
            console.log(`[Password] Full company object:`, { 
              _id: company._id, 
              password_type: company.password_type, 
              has_password_encrypted: !!company.password_encrypted,
              has_password_hash: !!company.password_hash
            });
            setCanDecryptPassword(prev => ({ ...prev, [company._id]: canDecrypt }));
          });
        }
      });
      setTableRows(rows);
    } catch (error) {
      console.error("Error fetching companies:", error);
      toast.error("Failed to load companies");
    } finally {
      setLoadingCompanies(false);
    }
  };

  const handleStatusToggle = async (chatbotId, currentStatus) => {
    if (!chatbotId) {
      toast.error("No chatbot associated");
      return;
    }
    try {
      setUpdatingStatus(prev => ({ ...prev, [chatbotId]: true }));
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      const token = localStorage.getItem("adminToken");
      await api.put(`/chatbot/edit/${chatbotId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state
      setTableRows(prev => prev.map(row => 
        row.chatbotId === chatbotId ? { ...row, status: newStatus } : row
      ));
      
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(error?.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [chatbotId]: false }));
    }
  };

  const handleManagedByNameEdit = (companyId) => {
    setEditingManagedBy(prev => ({ ...prev, [companyId]: true }));
  };

  const handleManagedByNameSave = async (companyId) => {
    try {
      setUpdatingManagedBy(prev => ({ ...prev, [companyId]: true }));
      const newValue = managedByValues[companyId] || "";
      const token = localStorage.getItem("adminToken");
      await api.put(`/company/update/${companyId}`, { managed_by_name: newValue }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state
      setTableRows(prev => prev.map(row => 
        row.companyId === companyId ? { ...row, managedByName: newValue } : row
      ));
      setCompanies(prev => prev.map(company => 
        company._id === companyId ? { ...company, managed_by_name: newValue } : company
      ));
      
      setEditingManagedBy(prev => ({ ...prev, [companyId]: false }));
      toast.success("Managed by name updated");
    } catch (error) {
      console.error("Error updating managed by name:", error);
      toast.error(error?.response?.data?.message || "Failed to update managed by name");
    } finally {
      setUpdatingManagedBy(prev => ({ ...prev, [companyId]: false }));
    }
  };

  const handleManagedByNameCancel = (companyId) => {
    setEditingManagedBy(prev => ({ ...prev, [companyId]: false }));
    // Reset to original value
    const company = companies.find(c => c._id === companyId);
    if (company) {
      setManagedByValues(prev => ({ ...prev, [companyId]: company.managed_by_name || "" }));
    }
  };

  // Username editing handlers
  const handleUsernameEdit = (companyId) => {
    setEditingUsername(prev => ({ ...prev, [companyId]: true }));
  };

  const handleUsernameSave = async (companyId) => {
    try {
      setUpdatingUsername(prev => ({ ...prev, [companyId]: true }));
      const newValue = usernameValues[companyId] || "";
      if (!newValue.trim()) {
        toast.error("Username cannot be empty");
        setUpdatingUsername(prev => ({ ...prev, [companyId]: false }));
        return;
      }
      const token = localStorage.getItem("adminToken");
      await api.put(`/company/update/${companyId}`, { userName: newValue.trim() }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state
      setTableRows(prev => prev.map(row => 
        row.companyId === companyId ? { ...row, userName: newValue.trim() } : row
      ));
      setCompanies(prev => prev.map(company => 
        company._id === companyId ? { ...company, userName: newValue.trim() } : company
      ));
      
      setEditingUsername(prev => ({ ...prev, [companyId]: false }));
      toast.success("Username updated successfully");
    } catch (error) {
      console.error("Error updating username:", error);
      toast.error(error?.response?.data?.message || "Failed to update username");
    } finally {
      setUpdatingUsername(prev => ({ ...prev, [companyId]: false }));
    }
  };

  const handleUsernameCancel = (companyId) => {
    setEditingUsername(prev => ({ ...prev, [companyId]: false }));
    // Reset to original value
    const company = companies.find(c => c._id === companyId);
    if (company) {
      setUsernameValues(prev => ({ ...prev, [companyId]: company.userName || "" }));
    }
  };

  // Password editing handlers
  const handlePasswordEdit = (companyId) => {
    setEditingPassword(prev => ({ ...prev, [companyId]: true }));
    setPasswordValues(prev => ({ ...prev, [companyId]: "" })); // Clear password when starting to edit
    setShowPasswordInput(prev => ({ ...prev, [companyId]: false })); // Start with password hidden
  };

  const handlePasswordSave = async (companyId) => {
    try {
      setUpdatingPassword(prev => ({ ...prev, [companyId]: true }));
      const newPassword = passwordValues[companyId] || "";
      if (!newPassword.trim()) {
        toast.error("Password cannot be empty");
        setUpdatingPassword(prev => ({ ...prev, [companyId]: false }));
        return;
      }
      if (newPassword.length < 6) {
        toast.error("Password must be at least 6 characters");
        setUpdatingPassword(prev => ({ ...prev, [companyId]: false }));
        return;
      }
      const token = localStorage.getItem("adminToken");
      await api.put(`/company/update/${companyId}`, { password: newPassword.trim() }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setEditingPassword(prev => ({ ...prev, [companyId]: false }));
      setPasswordValues(prev => ({ ...prev, [companyId]: "" })); // Clear password after save
      toast.success("Password updated successfully");
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error(error?.response?.data?.message || "Failed to update password");
    } finally {
      setUpdatingPassword(prev => ({ ...prev, [companyId]: false }));
    }
  };

  const handlePasswordCancel = (companyId) => {
    setEditingPassword(prev => ({ ...prev, [companyId]: false }));
    setPasswordValues(prev => ({ ...prev, [companyId]: "" })); // Clear password on cancel
    setShowPasswordInput(prev => ({ ...prev, [companyId]: false })); // Start with password hidden
  };

  // Phone number editing handlers
  const handlePhoneEdit = (companyId) => {
    setEditingPhone(prev => ({ ...prev, [companyId]: true }));
    const company = companies.find(c => c._id === companyId);
    if (company) {
      setPhoneValues(prev => ({ ...prev, [companyId]: company.phoneNo || "" }));
    }
  };

  const handlePhoneSave = async (companyId) => {
    try {
      setUpdatingPhone(prev => ({ ...prev, [companyId]: true }));
      const newValue = phoneValues[companyId] || "";
      const token = localStorage.getItem("adminToken");
      await api.put(`/company/update/${companyId}`, { phoneNo: newValue.trim() }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state
      setTableRows(prev => prev.map(row => 
        row.companyId === companyId ? { ...row, phoneNo: newValue.trim() } : row
      ));
      setCompanies(prev => prev.map(company => 
        company._id === companyId ? { ...company, phoneNo: newValue.trim() } : company
      ));
      
      setEditingPhone(prev => ({ ...prev, [companyId]: false }));
      toast.success("Phone number updated successfully");
    } catch (error) {
      console.error("Error updating phone number:", error);
      toast.error(error?.response?.data?.message || "Failed to update phone number");
    } finally {
      setUpdatingPhone(prev => ({ ...prev, [companyId]: false }));
    }
  };

  const handlePhoneCancel = (companyId) => {
    setEditingPhone(prev => ({ ...prev, [companyId]: false }));
    // Reset to original value
    const company = companies.find(c => c._id === companyId);
    if (company) {
      setPhoneValues(prev => ({ ...prev, [companyId]: company.phoneNo || "" }));
    }
  };

  // Handle showing/hiding decrypted password
  const handleShowPassword = async (companyId) => {
    // If already showing, just hide it
    if (showPassword[companyId]) {
      setShowPassword(prev => ({ ...prev, [companyId]: false }));
      setDecryptedPasswords(prev => {
        const newState = { ...prev };
        delete newState[companyId];
        return newState;
      });
      return;
    }

    // Check if we can decrypt (only for new companies)
    if (!canDecryptPassword[companyId]) {
      toast.info("Password cannot be displayed (stored as hash - old company)");
      return;
    }

    // If already decrypted, just show it
    if (decryptedPasswords[companyId]) {
      setShowPassword(prev => ({ ...prev, [companyId]: true }));
      return;
    }

    // Fetch decrypted password from API
    try {
      setLoadingPassword(prev => ({ ...prev, [companyId]: true }));
      const token = localStorage.getItem("adminToken");
      const response = await api.get(`/company/${companyId}/password`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.data.canDecrypt && response.data.data.password) {
        setDecryptedPasswords(prev => ({ ...prev, [companyId]: response.data.data.password }));
        setShowPassword(prev => ({ ...prev, [companyId]: true }));
      } else {
        toast.info(response.data.data.message || "Password cannot be retrieved");
      }
    } catch (error) {
      console.error("Error fetching password:", error);
      toast.error(error?.response?.data?.message || "Failed to retrieve password");
    } finally {
      setLoadingPassword(prev => ({ ...prev, [companyId]: false }));
    }
  };

  const handleNavigateToUIConfig = (chatbotId) => {
    if (!chatbotId) {
      toast.error("No chatbot associated");
      return;
    }
    setSearchParams({ chatbotId });
    window.scrollTo(0, 0);
  };

  const handleBackToTable = () => {
    setSearchParams({});
    setSelectedChatbotId("");
  };

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

  const fetchUIConfig = async (chatbotId) => {
    try {
      setLoadingConfig(true);
      const response = await getChatbotUIConfig(chatbotId);
      const config = response.data.data || response.data;
      setAvatarUrl(config.avatar_url || "");
      setWelcomeText(config.welcome_text || "");
      setAssistantDisplayName(config.assistant_display_name || "");
      setAssistantLogoUrl(config.assistant_logo_url || "");
      setTabTitle(config.tab_title || "");
      setFaviconUrl(config.favicon_url || "");
      
      // Load input placeholder configuration
      setInputPlaceholdersEnabled(config.input_placeholders_enabled || false);
      setInputPlaceholders(config.input_placeholders || ["Ask me anything...", "How can I help you?", "What would you like to know?"]);
      setInputPlaceholderSpeed(config.input_placeholder_speed || 2.5);
      setInputPlaceholderAnimation(config.input_placeholder_animation || "fade");
      
      // Find and set selected chatbot details
      const chatbot = chatbots.find(c => c._id === chatbotId);
      setSelectedChatbot(chatbot || { name: config.chatbot_name || "Unknown" });
    } catch (error) {
      console.error("Error fetching UI config:", error);
      toast.error("Failed to load UI configuration");
      setAvatarUrl("");
      setWelcomeText("");
      setAssistantDisplayName("");
      setAssistantLogoUrl("");
    } finally {
      setLoadingConfig(false);
    }
  };

  const fetchAuthConfig = async (chatbotId) => {
    try {
      const response = await getAuthConfigAdmin(chatbotId);
      const config = response.data.data || response.data;
      setAuthConfig({
        auth_enabled: config.auth_enabled || false,
        auth_provider: config.auth_provider || 'aisensy',
        auth_trigger_message_count: config.auth_trigger_message_count || 1,
        provider_config: config.provider_config || {},
        auth_phone_prompt_text: config.auth_phone_prompt_text || "To continue chat, please type your whatsapp number.",
        auth_otp_prompt_text: config.auth_otp_prompt_text || "I've sent an OTP to your whatsapp number. Please enter the 6-digit OTP code.",
        auth_success_text: config.auth_success_text || "Great! You're verified. How can I help you?",
      });
    } catch (error) {
      console.error("Error fetching auth config:", error);
      // Set defaults on error
      setAuthConfig({
        auth_enabled: false,
        auth_provider: 'aisensy',
        auth_trigger_message_count: 1,
        provider_config: {},
        auth_phone_prompt_text: "To continue chat, please type your whatsapp number.",
        auth_otp_prompt_text: "I've sent an OTP to your whatsapp number. Please enter the 6-digit OTP code.",
        auth_success_text: "Great! You're verified. How can I help you?",
      });
    }
  };

  const fetchIntentConfig = async (chatbotId) => {
    try {
      setIntentConfigLoading(true);
      const response = await getIntentConfigAdmin(chatbotId);
      const config = response.data.data || response.data;
      setIntentConfig({
        enabled: config.enabled || false,
        keywords: config.keywords || [],
        proposal_template_name: config.proposal_template_name || "",
        proposal_campaign_name: config.proposal_campaign_name || "",
        confirmation_prompt_text: config.confirmation_prompt_text || "Would you like me to send the proposal to your WhatsApp number?",
        success_message: config.success_message || "✅ Proposal sent to your WhatsApp number!",
        toast_message: config.toast_message || "Proposal sent successfully! 📱",
        positive_responses: config.positive_responses || ["yes", "yep", "sure", "ok", "send it", "please", "go ahead", "yes please"],
        negative_responses: config.negative_responses || ["no", "not now", "later", "maybe later", "not yet"],
        timeout_minutes: config.timeout_minutes || 5,
      });
    } catch (error) {
      console.error("Error fetching intent config:", error);
      // Set defaults on error
      setIntentConfig({
        enabled: false,
        keywords: [],
        proposal_template_name: "",
        proposal_campaign_name: "",
        confirmation_prompt_text: "Would you like me to send the proposal to your WhatsApp number?",
        success_message: "✅ Proposal sent to your WhatsApp number!",
        toast_message: "Proposal sent successfully! 📱",
        positive_responses: ["yes", "yep", "sure", "ok", "send it", "please", "go ahead", "yes please"],
        negative_responses: ["no", "not now", "later", "maybe later", "not yet"],
        timeout_minutes: 5,
      });
    } finally {
      setIntentConfigLoading(false);
    }
  };

  const handleUpdateIntentConfig = async () => {
    if (!selectedChatbotId) {
      toast.error("Please select a chatbot first");
      return;
    }

    try {
      setUpdatingIntent(true);
      await updateIntentConfig(selectedChatbotId, intentConfig);
      toast.success("Intent configuration updated successfully! ✅");
    } catch (error) {
      console.error("Error updating intent config:", error);
      toast.error(error.response?.data?.message || "Failed to update intent configuration");
    } finally {
      setUpdatingIntent(false);
    }
  };

  const fetchZohoConfig = async (chatbotId) => {
    if (!chatbotId) return;
    
    setZohoConfigLoading(true);
    try {
      const response = await getZohoConfigAdmin(chatbotId);
      const config = response.data.data || response.data;
      console.log('[Zoho Config] Fetched config:', config);
      setZohoConfig({
        enabled: Boolean(config.enabled),
        capture_intent_keywords: config.capture_intent_keywords || [],
        required_fields: config.required_fields || ['name', 'phone', 'email'],
        optional_fields: config.optional_fields || ['company'],
        name_prompt_text: config.name_prompt_text || "Great! What's your name?",
        phone_prompt_text: config.phone_prompt_text || "What's your phone number?",
        email_prompt_text: config.email_prompt_text || "What's your email address?",
        company_prompt_text: config.company_prompt_text || "Which company are you from? (optional)",
        success_message: config.success_message || "✅ Thank you! We've saved your details. Our team will reach out soon!",
        zoho_region: config.zoho_region || 'com',
        zoho_module: config.zoho_module || 'Leads',
        zoho_client_id: config.zoho_client_id || '',
        zoho_client_secret: config.zoho_client_secret || '',
        zoho_refresh_token: config.zoho_refresh_token || '',
        field_mapping: config.field_mapping || {
          name_field: 'First_Name',
          phone_field: 'Phone',
          email_field: 'Email',
          company_field: 'Company',
          source_field: 'Lead_Source',
          description_field: 'Description',
        },
      });
    } catch (error) {
      console.error("Error fetching Zoho config:", error);
      // Set defaults on error
      setZohoConfig({
        enabled: false,
        capture_intent_keywords: [],
        required_fields: ['name', 'phone', 'email'],
        optional_fields: ['company'],
        name_prompt_text: "Great! What's your name?",
        phone_prompt_text: "What's your phone number?",
        email_prompt_text: "What's your email address?",
        company_prompt_text: "Which company are you from? (optional)",
        success_message: "✅ Thank you! We've saved your details. Our team will reach out soon!",
        zoho_region: 'com',
        zoho_module: 'Leads',
        zoho_client_id: '',
        zoho_client_secret: '',
        zoho_refresh_token: '',
        field_mapping: {
          name_field: 'First_Name',
          phone_field: 'Phone',
          email_field: 'Email',
          company_field: 'Company',
          source_field: 'Lead_Source',
          description_field: 'Description',
        },
      });
    } finally {
      setZohoConfigLoading(false);
    }
  };

  const handleUpdateZohoConfig = async () => {
    if (!selectedChatbotId) {
      toast.error("Please select a chatbot first");
      return;
    }

    setUpdatingZoho(true);
    try {
      await updateZohoConfig(selectedChatbotId, zohoConfig);
      toast.success("Zoho configuration updated successfully!");
    } catch (error) {
      console.error("Error updating Zoho config:", error);
      toast.error(error.response?.data?.message || "Failed to update Zoho configuration");
    } finally {
      setUpdatingZoho(false);
    }
  };

  // Handle OAuth callback from popup
  useEffect(() => {
    const handleMessage = async (event) => {
      // Log all messages for debugging
      console.log('🔍 [Zoho OAuth] Message received:', {
        type: event.data?.type,
        origin: event.origin,
        data: event.data
      });
      
      // Accept messages from any origin in development (for popup callback)
      // In production, you should verify the origin
      if (event.data?.type === 'zoho-oauth-callback') {
        const { code, region } = event.data;
        console.log('✅ [Zoho OAuth] Received authorization code, exchanging for token...');
        console.log('✅ [Zoho OAuth] Code:', code.substring(0, 20) + '...');
        console.log('✅ [Zoho OAuth] Region:', region);
        console.log('✅ [Zoho OAuth] Chatbot ID:', selectedChatbotId);
        
        setGeneratingRefreshToken(true);
        
        try {
          // Exchange code for refresh token
          console.log('🔄 [Zoho OAuth] Calling exchange endpoint...');
          const response = await exchangeZohoCodeForToken(
            selectedChatbotId,
            code,
            region || zohoConfig.zoho_region || 'in'
          );
          
          console.log('✅ [Zoho OAuth] Token exchange response:', response.data);
          
          if (response.data?.data?.refreshToken) {
            // Auto-fill refresh token
            setZohoConfig(prev => ({
              ...prev,
              zoho_refresh_token: response.data.data.refreshToken
            }));
            toast.success('✅ Refresh token generated successfully!');
          } else {
            throw new Error('No refresh token in response');
          }
        } catch (error) {
          console.error('❌ [Zoho OAuth] Error exchanging code for token:', error);
          console.error('❌ [Zoho OAuth] Error details:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
          });
          const errorMessage = error.response?.data?.message || error.message || 'Failed to generate refresh token';
          toast.error(errorMessage);
        } finally {
          setGeneratingRefreshToken(false);
        }
      } else if (event.data?.type === 'zoho-oauth-error') {
        console.error('❌ [Zoho OAuth] Error from callback:', event.data.error);
        setGeneratingRefreshToken(false);
        toast.error(event.data.error || 'Authorization failed');
      } else if (event.data?.type === 'zoho-refresh-token') {
        // Handle refresh token received from manual exchange
        console.log('✅ [Zoho OAuth] Received refresh token from manual exchange');
        if (event.data.refreshToken) {
          setZohoConfig(prev => ({
            ...prev,
            zoho_refresh_token: event.data.refreshToken
          }));
          toast.success('✅ Refresh token received! Please click "Update Zoho Configuration" to save it.');
          setGeneratingRefreshToken(false);
        }
      }
    };
    
    console.log('✅ [Zoho OAuth] Message listener registered');
    window.addEventListener('message', handleMessage);
    
    return () => {
      console.log('🔄 [Zoho OAuth] Message listener removed');
      window.removeEventListener('message', handleMessage);
    };
  }, [selectedChatbotId, zohoConfig.zoho_region]);

  const handleGenerateRefreshToken = async () => {
    if (!selectedChatbotId) {
      toast.error('Please select a chatbot first');
      return;
    }
    
    // Get the raw Client ID from the form (before encryption)
    const rawClientId = zohoConfig.zoho_client_id?.trim();
    const rawClientSecret = zohoConfig.zoho_client_secret?.trim();
    
    if (!rawClientId || !rawClientSecret) {
      toast.error('Please enter Client ID and Client Secret first');
      return;
    }
    
    // Save config first to ensure Client ID and Secret are stored
    try {
      await updateZohoConfig(selectedChatbotId, zohoConfig);
    } catch (error) {
      console.error('Error saving config before generating token:', error);
      toast.error('Failed to save configuration. Please check your inputs.');
      return;
    }
    
    setGeneratingRefreshToken(true);
    
    try {
      console.log('🔍 [Zoho Auth] Generating token for chatbot:', selectedChatbotId);
      console.log('🔍 [Zoho Auth] Client ID (first 10 chars):', rawClientId?.substring(0, 10));
      console.log('🔍 [Zoho Auth] Region:', zohoConfig.zoho_region || 'in');
      
      // Get authorization URL - pass raw clientId as query param
      // Use the raw value from form, not the encrypted one from saved config
      const response = await getZohoAuthorizationUrl(
        selectedChatbotId,
        zohoConfig.zoho_region || 'in',
        rawClientId // Pass raw client ID from form
      );
      
      if (response.data?.data?.authorizationUrl) {
        // Open popup window for OAuth
        const width = 600;
        const height = 700;
        const left = (window.screen.width - width) / 2;
        const top = (window.screen.height - height) / 2;
        
        const popup = window.open(
          response.data.data.authorizationUrl,
          'Zoho OAuth',
          `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
        );
        
        // Check if popup was blocked
        if (!popup || popup.closed || typeof popup.closed === 'undefined') {
          toast.error('Popup blocked. Please allow popups for this site and try again.');
          setGeneratingRefreshToken(false);
          return;
        }
        
        // Track if OAuth completed successfully
        let oauthCompleted = false;
        
        // Track completion via message handler
        const completionTracker = (event) => {
          if (event.data?.type === 'zoho-oauth-callback' || event.data?.type === 'zoho-oauth-error') {
            oauthCompleted = true;
          }
        };
        window.addEventListener('message', completionTracker);
        
        // Monitor popup (will be closed by callback page)
        const checkPopup = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkPopup);
            window.removeEventListener('message', completionTracker);
            
            // Reset loading state if popup was closed without completing OAuth
            // Use a delay to allow message handler to process first (in case message is still pending)
            setTimeout(() => {
              setGeneratingRefreshToken(prev => {
                // Only reset if still in generating state (message handler might have already reset it)
                if (prev && !oauthCompleted) {
                  console.log('🔄 [Zoho OAuth] Popup closed without completing OAuth, resetting generating state');
                  toast.info('OAuth popup was closed. If you completed authorization, the token should appear shortly.');
                }
                return false;
              });
            }, 2000); // Delay to allow message handler to process
          }
        }, 500);
        
        // Timeout after 5 minutes
        const timeoutId = setTimeout(() => {
          if (!popup.closed) {
            popup.close();
            window.removeEventListener('message', completionTracker);
            setGeneratingRefreshToken(false);
            toast.error('Authorization timeout. Please try again.');
          }
          clearInterval(checkPopup);
        }, 5 * 60 * 1000);
      } else {
        throw new Error('Failed to get authorization URL');
      }
    } catch (error) {
      console.error('Error generating refresh token:', error);
      toast.error(error.response?.data?.message || 'Failed to start authorization flow');
      setGeneratingRefreshToken(false);
    }
  };

  const handleManualCodeExchange = async () => {
    if (!selectedChatbotId) {
      toast.error('Please select a chatbot first');
      return;
    }
    
    if (!manualAuthCode.trim()) {
      toast.error('Please enter the authorization code');
      return;
    }
    
    setExchangingManualCode(true);
    try {
      const response = await exchangeZohoCodeForToken(
        selectedChatbotId,
        manualAuthCode.trim(),
        zohoConfig.zoho_region || 'in'
      );
      
      if (response.data?.data?.refreshToken) {
        setZohoConfig(prev => ({
          ...prev,
          zoho_refresh_token: response.data.data.refreshToken
        }));
        setManualAuthCode('');
        toast.success('✅ Refresh token generated successfully! Please click "Update Zoho Configuration" to save it.');
      } else {
        throw new Error('No refresh token in response');
      }
    } catch (error) {
      console.error('Error exchanging manual code:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to exchange code';
      toast.error(errorMessage);
    } finally {
      setExchangingManualCode(false);
    }
  };

  const handleTestZohoConnection = async () => {
    if (!selectedChatbotId) {
      toast.error("Please select a chatbot first");
      return;
    }

    // Validate that credentials are entered
    if (!zohoConfig.zoho_client_id || !zohoConfig.zoho_client_secret || !zohoConfig.zoho_refresh_token) {
      toast.error("Please enter Client ID, Client Secret, and Refresh Token before testing connection");
      return;
    }

    // Validate refresh token length (Zoho refresh tokens are typically 100+ characters)
    const refreshTokenLength = zohoConfig.zoho_refresh_token?.trim().length || 0;
    if (refreshTokenLength < 50) {
      toast.error("Refresh token appears to be invalid or truncated. Please generate a new refresh token using the 'Generate Refresh Token' button.");
      return;
    }

    // Save configuration first if it hasn't been saved yet
    try {
      await updateZohoConfig(selectedChatbotId, zohoConfig);
    } catch (error) {
      console.error("Error saving Zoho config before test:", error);
      toast.error("Failed to save configuration. Please check your inputs.");
      return;
    }

    setTestingZohoConnection(true);
    try {
      await testZohoConnection(selectedChatbotId);
      toast.success("Connection test successful! ✅");
    } catch (error) {
      console.error("Error testing Zoho connection:", error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          "Connection test failed";
      toast.error(errorMessage, { autoClose: 5000 });
      console.error("Full error response:", error.response?.data);
    } finally {
      setTestingZohoConnection(false);
    }
  };

  const handleAddZohoKeyword = () => {
    if (newZohoKeyword.trim() && !zohoConfig.capture_intent_keywords.includes(newZohoKeyword.trim())) {
      setZohoConfig({
        ...zohoConfig,
        capture_intent_keywords: [...zohoConfig.capture_intent_keywords, newZohoKeyword.trim()],
      });
      setNewZohoKeyword('');
    }
  };

  const handleRemoveZohoKeyword = (keyword) => {
    setZohoConfig({
      ...zohoConfig,
      capture_intent_keywords: zohoConfig.capture_intent_keywords.filter(k => k !== keyword),
    });
  };

  const fetchTranscriptConfig = async (chatbotId) => {
    if (!chatbotId) return;
    
    setTranscriptConfigLoading(true);
    try {
      const response = await getTranscriptConfigAdmin(chatbotId);
      const config = response.data.data || response.data;
      console.log('[Transcript Config] Fetched config:', config);
      setTranscriptConfig({
        enabled: Boolean(config.enabled), // Explicitly convert to boolean
        template_name: config.template_name || "",
        campaign_name: config.campaign_name || "",
        company_name: config.company_name || "",
        inactivity_timeout_ms: config.inactivity_timeout_ms || null,
        pdf_filename: config.pdf_filename || "Chat-Summary.pdf",
      });
    } catch (error) {
      console.error("Error fetching transcript config:", error);
      // Set defaults on error
      setTranscriptConfig({
        enabled: false,
        template_name: "",
        campaign_name: "",
        company_name: "",
        inactivity_timeout_ms: null,
        pdf_filename: "Chat-Summary.pdf",
      });
    } finally {
      setTranscriptConfigLoading(false);
    }
  };

  const handleUpdateTranscriptConfig = async () => {
    if (!selectedChatbotId) {
      toast.error("Please select a chatbot first");
      return;
    }

    // Validate required fields when enabled
    if (transcriptConfig.enabled) {
      if (!transcriptConfig.template_name?.trim()) {
        toast.error("Template name is required when transcript is enabled");
        return;
      }
      if (!transcriptConfig.campaign_name?.trim()) {
        toast.error("Campaign name is required when transcript is enabled");
        return;
      }
      if (!transcriptConfig.company_name?.trim()) {
        toast.error("Company name is required when transcript is enabled");
        return;
      }
      if (!transcriptConfig.inactivity_timeout_ms || transcriptConfig.inactivity_timeout_ms < 1000) {
        toast.error("Inactivity timeout must be at least 1000ms (1 second)");
        return;
      }
    }

    try {
      setUpdatingTranscript(true);
      console.log('[Transcript Config] Updating with config:', transcriptConfig);
      await updateTranscriptConfig(selectedChatbotId, transcriptConfig);
      toast.success("Transcript configuration updated successfully! ✅");
      // Refetch to ensure state is in sync
      await fetchTranscriptConfig(selectedChatbotId);
    } catch (error) {
      console.error("Error updating transcript config:", error);
      toast.error(error.response?.data?.message || "Failed to update transcript configuration");
    } finally {
      setUpdatingTranscript(false);
    }
  };

  const handleAddKeyword = () => {
    if (!newKeyword.trim()) {
      toast.error("Please enter a keyword");
      return;
    }
    if (intentConfig.keywords.includes(newKeyword.trim())) {
      toast.error("Keyword already exists");
      return;
    }
    setIntentConfig({
      ...intentConfig,
      keywords: [...intentConfig.keywords, newKeyword.trim()],
    });
    setNewKeyword("");
  };

  const handleRemoveKeyword = (keyword) => {
    setIntentConfig({
      ...intentConfig,
      keywords: intentConfig.keywords.filter((k) => k !== keyword),
    });
  };

  const fetchSidebarConfig = async (chatbotId) => {
    try {
      const response = await getChatbotSidebarConfig(chatbotId);
      const config = response.data.data || response.data;
      setSidebarEnabled(config.sidebar_enabled || false);
      setWhatsappEnabled(config.whatsapp_enabled || false);
      setWhatsappMode(config.whatsapp_mode || "premium_modal");
      setWhatsappUrl(config.whatsapp_url || "");
      setWhatsappText(config.whatsapp_text || "Connect on WhatsApp");
      setCallEnabled(config.call_enabled || false);
      setCallMode(config.call_mode || "premium_modal");
      setCallNumber(config.call_number || "");
      setCallText(config.call_text || "Talk to a Counsellor");
      setCalendlyEnabled(config.calendly_enabled || false);
      setCalendlyMode(config.calendly_mode || "premium_modal");
      setCalendlyUrl(config.calendly_url || "");
      setCalendlyText(config.calendly_text || "Schedule a Meeting");
      setEmailEnabled(config.email_enabled || false);
      setEmailMode(config.email_mode || "premium_modal");
      setEmailText(config.email_text || "Send an Email");
      setWhatsappProposalEnabled(config.whatsapp_proposal_enabled || false);
      setWhatsappProposalText(config.whatsapp_proposal_text || "Send Proposal via WhatsApp");
      setWhatsappProposalDefaultApiKey(config.whatsapp_proposal_default_api_key || "");
      setWhatsappProposalDefaultOrgSlug(config.whatsapp_proposal_default_org_slug || "");
      setWhatsappProposalDefaultSenderName(config.whatsapp_proposal_default_sender_name || "");
      setWhatsappProposalDefaultCountryCode(config.whatsapp_proposal_default_country_code || "91");
      setWhatsappProposalTemplates(config.whatsapp_proposal_templates || []);
      setSocialEnabled(config.social_enabled || false);
      setBrandingEnabled(config.branding_enabled || false);
      setBrandingText(config.branding_text || "Powered by");
      setBrandingCompany(config.branding_company || "Troika Tech");
      setBrandingLogoUrl(config.branding_logo_url || "");
      setBrandingLogoLink(config.branding_logo_link || "");
      setHeaderEnabled(config.header_enabled || false);
      setHeaderText(config.header_text || "");
      setHeaderLogoUrl(config.header_logo_url || "");
      setHeaderLogoLink(config.header_logo_link || "");
      setCustomNavEnabled(config.custom_nav_enabled || false);
    } catch (error) {
      console.error("Error fetching sidebar config:", error);
      resetSidebarConfig();
    }
  };

  const fetchEmailTemplates = async (chatbotId) => {
    try {
      setLoadingTemplates(true);
      const response = await getEmailTemplates(chatbotId);
      const templates = response.data.data?.templates || response.data.templates || [];
      setEmailTemplates(templates);
    } catch (error) {
      console.error("Error fetching email templates:", error);
      toast.error("Failed to load email templates");
      setEmailTemplates([]);
    } finally {
      setLoadingTemplates(false);
    }
  };

  const fetchProposalTemplates = async (chatbotId) => {
    if (!chatbotId) return;
    try {
      setLoadingProposalTemplates(true);
      const response = await getWhatsAppProposalTemplates(chatbotId);
      const templates = response.data.data || response.data || [];
      setWhatsappProposalTemplates(templates);
    } catch (error) {
      console.error("Error fetching proposal templates:", error);
      toast.error("Failed to load proposal templates");
      setWhatsappProposalTemplates([]);
    } finally {
      setLoadingProposalTemplates(false);
    }
  };

  const resetSidebarConfig = () => {
    setSidebarEnabled(false);
    setWhatsappEnabled(false);
    setWhatsappMode("premium_modal");
    setWhatsappUrl("");
    setWhatsappText("Connect on WhatsApp");
    setCallEnabled(false);
    setCallMode("premium_modal");
    setCallNumber("");
    setCallText("Talk to a Counsellor");
    setCalendlyEnabled(false);
    setCalendlyMode("premium_modal");
    setCalendlyUrl("");
    setCalendlyText("Schedule a Meeting");
    setEmailEnabled(false);
    setEmailMode("premium_modal");
    setEmailText("Send an Email");
    setEmailTemplates([]);
    setSocialEnabled(false);
    setSocialLinks([]);
    setBrandingEnabled(false);
    setBrandingText("Powered by");
    setBrandingCompany("Troika Tech");
    setBrandingLogoUrl("");
    setBrandingLogoLink("");
    setHeaderEnabled(false);
    setHeaderText("");
    setHeaderLogoUrl("");
    setHeaderLogoLink("");
    setCustomNavEnabled(false);
    setCustomNavItems([]);
  };

  const handleAddTemplate = () => {
    setEditingTemplate(null);
    setTemplateFormData({
      template_name: "",
      email_subject: "",
      email_body: "",
      is_active: true,
      order: emailTemplates.length,
    });
    setShowTemplateForm(true);
    setShowEmailPreview(false);
  };

  const handleEditTemplate = (template) => {
    setEditingTemplate(template);
    setTemplateFormData({
      template_name: template.template_name || "",
      email_subject: template.email_subject || "",
      email_body: template.email_body || "",
      is_active: template.is_active !== undefined ? template.is_active : true,
      order: template.order || 0,
    });
    setShowTemplateForm(true);
    setShowEmailPreview(false);
  };

  // Generate email preview with sample variable replacements
  const getEmailPreview = () => {
    let previewSubject = templateFormData.email_subject || "";
    let previewBody = templateFormData.email_body || "";

    // Replace variables with sample data
    const sampleVariables = {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1234567890",
    };

    // Replace variables in subject
    Object.keys(sampleVariables).forEach(key => {
      const regex = new RegExp(`\\{${key}\\}`, 'g');
      previewSubject = previewSubject.replace(regex, sampleVariables[key]);
    });

    // Replace variables in body (HTML content)
    Object.keys(sampleVariables).forEach(key => {
      const regex = new RegExp(`\\{${key}\\}`, 'g');
      previewBody = previewBody.replace(regex, sampleVariables[key]);
    });

    return { previewSubject, previewBody };
  };

  const handleSaveTemplate = async () => {
    if (!selectedChatbotId) {
      toast.error("Please select a chatbot first");
      return;
    }

    if (!templateFormData.template_name.trim()) {
      toast.error("Template name is required");
      return;
    }

    if (!templateFormData.email_subject.trim()) {
      toast.error("Email subject is required");
      return;
    }

    if (!templateFormData.email_body.trim()) {
      toast.error("Email body is required");
      return;
    }

    try {
      setSavingTemplate(true);
      if (editingTemplate) {
        await updateEmailTemplate(selectedChatbotId, editingTemplate._id, templateFormData);
        toast.success("Email template updated successfully! ✅");
      } else {
        await createEmailTemplate(selectedChatbotId, templateFormData);
        toast.success("Email template created successfully! ✅");
      }
      setShowTemplateForm(false);
      setEditingTemplate(null);
      await fetchEmailTemplates(selectedChatbotId);
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error(error.response?.data?.message || "Failed to save email template");
    } finally {
      setSavingTemplate(false);
    }
  };

  const handleDeleteTemplate = async (templateId) => {
    if (!selectedChatbotId) {
      toast.error("Please select a chatbot first");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this template?")) {
      return;
    }

    try {
      setDeletingTemplate(templateId);
      await deleteEmailTemplate(selectedChatbotId, templateId);
      toast.success("Email template deleted successfully! ✅");
      await fetchEmailTemplates(selectedChatbotId);
    } catch (error) {
      console.error("Error deleting template:", error);
      toast.error(error.response?.data?.message || "Failed to delete email template");
    } finally {
      setDeletingTemplate(null);
    }
  };

  // WhatsApp Proposal Template handlers
  const handleAddProposalTemplate = () => {
    setEditingProposalTemplate(null);
    setProposalTemplateFormData({
      display_name: "",
      description: "",
      campaign_name: "",
      template_name: "",
      api_key: "",
      org_slug: "",
      sender_name: "",
      country_code: "91",
      template_params: [],
      order: whatsappProposalTemplates.length,
      is_active: true,
    });
    setShowProposalTemplateForm(true);
  };

  const handleEditProposalTemplate = (template) => {
    setEditingProposalTemplate(template);
    setProposalTemplateFormData({
      display_name: template.display_name || "",
      description: template.description || "",
      campaign_name: template.campaign_name || "",
      template_name: template.template_name || "",
      api_key: template.api_key || "",
      org_slug: template.org_slug || "",
      sender_name: template.sender_name || "",
      country_code: template.country_code || "91",
      template_params: template.template_params || [],
      order: template.order || 0,
      is_active: template.is_active !== undefined ? template.is_active : true,
    });
    setShowProposalTemplateForm(true);
  };

  const handleSaveProposalTemplate = async () => {
    if (!selectedChatbotId) {
      toast.error("Please select a chatbot first");
      return;
    }

    if (!proposalTemplateFormData.display_name.trim()) {
      toast.error("Display name is required");
      return;
    }

    if (!proposalTemplateFormData.campaign_name.trim()) {
      toast.error("Campaign name is required");
      return;
    }

    if (!proposalTemplateFormData.template_name.trim()) {
      toast.error("Template name is required");
      return;
    }

    try {
      setSavingTemplate(true);
      if (editingProposalTemplate) {
        await updateWhatsAppProposalTemplate(selectedChatbotId, editingProposalTemplate._id, proposalTemplateFormData);
        toast.success("Proposal template updated successfully! ✅");
      } else {
        await createWhatsAppProposalTemplate(selectedChatbotId, proposalTemplateFormData);
        toast.success("Proposal template created successfully! ✅");
      }
      setShowProposalTemplateForm(false);
      setEditingProposalTemplate(null);
      await fetchProposalTemplates(selectedChatbotId);
      await fetchSidebarConfig(selectedChatbotId); // Refresh sidebar config to get updated templates
    } catch (error) {
      console.error("Error saving proposal template:", error);
      toast.error(error.response?.data?.message || "Failed to save proposal template");
    } finally {
      setSavingTemplate(false);
    }
  };

  const handleDeleteProposalTemplate = async (templateId) => {
    if (!selectedChatbotId) {
      toast.error("Please select a chatbot first");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this template?")) {
      return;
    }

    try {
      setDeletingProposalTemplate(templateId);
      await deleteWhatsAppProposalTemplate(selectedChatbotId, templateId);
      toast.success("Proposal template deleted successfully! ✅");
      await fetchProposalTemplates(selectedChatbotId);
      await fetchSidebarConfig(selectedChatbotId);
    } catch (error) {
      console.error("Error deleting proposal template:", error);
      toast.error(error.response?.data?.message || "Failed to delete proposal template");
    } finally {
      setDeletingProposalTemplate(null);
    }
  };

  const handleUpdateProposalSettings = async () => {
    if (!selectedChatbotId) {
      toast.error("Please select a chatbot first");
      return;
    }

    try {
      setUpdatingProposalSettings(true);
      await updateWhatsAppProposalSettings(
        selectedChatbotId,
        whatsappProposalEnabled,
        whatsappProposalText,
        whatsappProposalDefaultApiKey || null,
        whatsappProposalDefaultOrgSlug || null,
        whatsappProposalDefaultSenderName || null,
        whatsappProposalDefaultCountryCode || "91"
      );
      toast.success("WhatsApp proposal settings updated successfully! ✅");
      await fetchSidebarConfig(selectedChatbotId);
    } catch (error) {
      console.error("Error updating proposal settings:", error);
      toast.error(error.response?.data?.message || "Failed to update proposal settings");
    } finally {
      setUpdatingProposalSettings(false);
    }
  };

  // Social Media Links functions
  const fetchSocialMediaLinks = async (chatbotId) => {
    try {
      setLoadingSocialLinks(true);
      const response = await getSocialMediaLinks(chatbotId);
      const links = response.data.data?.links || response.data.links || [];
      setSocialLinks(links);
    } catch (error) {
      console.error("Error fetching social media links:", error);
      toast.error("Failed to load social media links");
      setSocialLinks([]);
    } finally {
      setLoadingSocialLinks(false);
    }
  };

  const fetchCustomNavigationItems = async (chatbotId) => {
    try {
      setLoadingCustomNavItems(true);
      const response = await getCustomNavigationItems(chatbotId);
      const items = response.data.data?.items || response.data.items || [];
      setCustomNavItems(items);
    } catch (error) {
      console.error("Error fetching custom navigation items:", error);
      toast.error("Failed to load custom navigation items");
      setCustomNavItems([]);
    } finally {
      setLoadingCustomNavItems(false);
    }
  };

  // Detect platform from URL (returns platform value for backend)
  const detectPlatformValue = (url) => {
    if (!url || typeof url !== 'string') return 'custom';
    
    const normalizedUrl = url.trim().toLowerCase();
    let hostname = '';
    
    try {
      let fullUrl = normalizedUrl;
      if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
        fullUrl = 'https://' + fullUrl;
      }
      const urlObj = new URL(fullUrl);
      hostname = urlObj.hostname.replace('www.', '').replace('m.', '');
    } catch (e) {
      return 'custom';
    }

    const platformMap = {
      'facebook.com': 'facebook',
      'fb.com': 'facebook',
      'instagram.com': 'instagram',
      'youtube.com': 'youtube',
      'youtu.be': 'youtube',
      'linkedin.com': 'linkedin',
      'twitter.com': 'twitter',
      'x.com': 'twitter',
      'whatsapp.com': 'whatsapp',
      'wa.me': 'whatsapp',
      'telegram.org': 'telegram',
      't.me': 'telegram',
      'pinterest.com': 'pinterest',
      'tiktok.com': 'tiktok',
      'snapchat.com': 'snapchat',
      'indiamart.com': 'indiamart',
      'justdial.com': 'justdial',
      'tradeindia.com': 'tradeindia',
      'exportersindia.com': 'exportersindia',
    };

    for (const [domain, platform] of Object.entries(platformMap)) {
      if (hostname.includes(domain)) {
        return platform;
      }
    }
    
    return 'custom';
  };

  // Get platform display name
  const getPlatformDisplayName = (platformValue) => {
    const displayNames = {
      facebook: 'Facebook',
      instagram: 'Instagram',
      youtube: 'YouTube',
      linkedin: 'LinkedIn',
      twitter: 'Twitter/X',
      whatsapp: 'WhatsApp',
      telegram: 'Telegram',
      pinterest: 'Pinterest',
      tiktok: 'TikTok',
      snapchat: 'Snapchat',
      indiamart: 'IndiaMART',
      justdial: 'JustDial',
      tradeindia: 'TradeIndia',
      exportersindia: 'ExportersIndia',
      custom: 'Custom Link'
    };
    return displayNames[platformValue] || 'Custom Link';
  };

  const handleAddSocialLink = () => {
    setEditingSocialLink(null);
    setSocialLinkFormData({
      url: "",
      platform: "custom",
      is_active: true,
      order: socialLinks.length,
    });
    setDetectedPlatform(null);
    setShowSocialLinkForm(true);
  };

  const handleEditSocialLink = (link) => {
    setEditingSocialLink(link);
    setSocialLinkFormData({
      url: link.url || "",
      platform: link.platform || "custom",
      is_active: link.is_active !== undefined ? link.is_active : true,
      order: link.order || 0,
    });
    const detected = detectPlatformValue(link.url);
    setDetectedPlatform(getPlatformDisplayName(detected));
    setShowSocialLinkForm(true);
  };

  const handleSocialLinkUrlChange = (url) => {
    const detectedPlatformValue = detectPlatformValue(url);
    setSocialLinkFormData({ 
      ...socialLinkFormData, 
      url,
      // Auto-update platform if not manually changed, or if URL changes significantly
      platform: detectedPlatformValue !== 'custom' ? detectedPlatformValue : socialLinkFormData.platform
    });
    setDetectedPlatform(getPlatformDisplayName(detectedPlatformValue));
  };

  const handleSaveSocialLink = async () => {
    if (!selectedChatbotId) {
      toast.error("Please select a chatbot first");
      return;
    }

    if (!socialLinkFormData.url.trim()) {
      toast.error("URL is required");
      return;
    }

    try {
      setSavingSocialLink(true);
      if (editingSocialLink) {
        await updateSocialMediaLink(selectedChatbotId, editingSocialLink._id, socialLinkFormData);
        toast.success("Social media link updated successfully! ✅");
      } else {
        await createSocialMediaLink(selectedChatbotId, socialLinkFormData);
        toast.success("Social media link created successfully! ✅");
      }
      setShowSocialLinkForm(false);
      setEditingSocialLink(null);
      await fetchSocialMediaLinks(selectedChatbotId);
    } catch (error) {
      console.error("Error saving social link:", error);
      toast.error(error.response?.data?.message || "Failed to save social media link");
    } finally {
      setSavingSocialLink(false);
    }
  };

  const handleDeleteSocialLink = async (linkId) => {
    if (!selectedChatbotId) {
      toast.error("Please select a chatbot first");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this social media link?")) {
      return;
    }

    try {
      setDeletingSocialLink(linkId);
      await deleteSocialMediaLink(selectedChatbotId, linkId);
      toast.success("Social media link deleted successfully! ✅");
      await fetchSocialMediaLinks(selectedChatbotId);
    } catch (error) {
      console.error("Error deleting social link:", error);
      toast.error(error.response?.data?.message || "Failed to delete social media link");
    } finally {
      setDeletingSocialLink(null);
    }
  };

  // Custom Navigation Item handlers
  const handleAddCustomNavItem = () => {
    setEditingCustomNavItem(null);
    setCustomNavFormData({
      display_text: "",
      icon_name: "",
      redirect_url: "",
      is_active: true,
      order: customNavItems.length,
    });
    setShowCustomNavForm(true);
  };

  const handleEditCustomNavItem = (item) => {
    setEditingCustomNavItem(item);
    setCustomNavFormData({
      display_text: item.display_text || "",
      icon_name: item.icon_name || "",
      redirect_url: item.redirect_url || "",
      is_active: item.is_active !== undefined ? item.is_active : true,
      order: item.order || 0,
    });
    setShowCustomNavForm(true);
  };

  const handleSaveCustomNavItem = async () => {
    if (!selectedChatbotId) {
      toast.error("Please select a chatbot first");
      return;
    }

    if (!customNavFormData.display_text.trim()) {
      toast.error("Display text is required");
      return;
    }

    if (!customNavFormData.icon_name.trim()) {
      toast.error("Icon name is required");
      return;
    }

    if (!customNavFormData.redirect_url.trim()) {
      toast.error("Redirect URL is required");
      return;
    }

    try {
      setSavingCustomNavItem(true);
      if (editingCustomNavItem) {
        await updateCustomNavigationItem(selectedChatbotId, editingCustomNavItem._id, customNavFormData);
        toast.success("Custom navigation item updated successfully! ✅");
      } else {
        await createCustomNavigationItem(selectedChatbotId, customNavFormData);
        toast.success("Custom navigation item created successfully! ✅");
      }
      setShowCustomNavForm(false);
      setEditingCustomNavItem(null);
      await fetchCustomNavigationItems(selectedChatbotId);
    } catch (error) {
      console.error("Error saving custom navigation item:", error);
      toast.error(error.response?.data?.message || "Failed to save custom navigation item");
    } finally {
      setSavingCustomNavItem(false);
    }
  };

  const handleDeleteCustomNavItem = async (itemId) => {
    if (!selectedChatbotId) {
      toast.error("Please select a chatbot first");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this custom navigation item?")) {
      return;
    }

    try {
      setDeletingCustomNavItem(itemId);
      await deleteCustomNavigationItem(selectedChatbotId, itemId);
      toast.success("Custom navigation item deleted successfully! ✅");
      await fetchCustomNavigationItems(selectedChatbotId);
    } catch (error) {
      console.error("Error deleting custom navigation item:", error);
      toast.error(error.response?.data?.message || "Failed to delete custom navigation item");
    } finally {
      setDeletingCustomNavItem(null);
    }
  };

  const handleUpdateAvatar = async () => {
    if (!selectedChatbotId) {
      toast.error("Please select a chatbot first");
      return;
    }

    if (!avatarUrl.trim()) {
      toast.error("Please enter an image URL");
      return;
    }

    // Basic URL validation
    let validUrl;
    try {
      validUrl = new URL(avatarUrl.trim());
    } catch (e) {
      toast.error("Please enter a valid URL format (e.g., https://example.com/image.jpg)");
      return;
    }

    // Check if URL is http or https
    if (!['http:', 'https:'].includes(validUrl.protocol)) {
      toast.error("URL must start with http:// or https://");
      return;
    }

    try {
      setUpdatingAvatar(true);
      await updateChatbotUIAvatar(selectedChatbotId, avatarUrl.trim());
      toast.success("Avatar image updated successfully! ✅");
    } catch (error) {
      console.error("Error updating avatar:", error);
      toast.error(error.response?.data?.message || "Failed to update avatar image");
    } finally {
      setUpdatingAvatar(false);
    }
  };

  const handleUpdateWelcomeText = async () => {
    if (!selectedChatbotId) {
      toast.error("Please select a chatbot first");
      return;
    }

    if (welcomeText.length > 500) {
      toast.error("Welcome text must be 500 characters or less");
      return;
    }

    try {
      setUpdatingText(true);

      await updateChatbotUIWelcomeText(selectedChatbotId, welcomeText.trim());
      await updateChatbotUIAssistantHeader(
        selectedChatbotId,
        assistantDisplayName.trim() || null,
        assistantLogoUrl.trim() || null
      );

      toast.success("Welcome text and assistant header updated successfully! ✅");
    } catch (error) {
      console.error("Error updating welcome text/assistant header:", error);
      toast.error(error.response?.data?.message || "Failed to update welcome/assistant settings");
    } finally {
      setUpdatingText(false);
    }
  };

  // If chatbotId is in query params, show configuration view
  if (chatbotIdFromQuery) {
  return (
    <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={handleBackToTable}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Table
          </button>
          <div>
        <h1 className="text-3xl font-bold text-[#1e3a8a] mb-2">Manage Chatbot UI</h1>
        <p className="text-gray-600">Customize the avatar image, welcome message, and sidebar items for your chatbots</p>
      </div>
          </div>

        {/* Current Chatbot Info */}
        {selectedChatbot && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200 mb-6">
            <p className="text-sm text-gray-600">Current Chatbot:</p>
            <p className="text-lg font-semibold text-gray-800">{selectedChatbot.name}</p>
            {selectedChatbot.company_name && (
              <p className="text-sm text-gray-500 mt-1">Company: {selectedChatbot.company_name}</p>
        )}
      </div>
        )}

      {/* UI Configuration Section */}
      {selectedChatbotId && (
        <div className="space-y-6">
          {loadingConfig ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading UI configuration...</p>
            </div>
          ) : (
            <>
              {/* Master Sidebar Toggle */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Settings className="h-6 w-6 text-blue-600 mr-2" />
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">Enable Sidebar Items</h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Master toggle to show/hide sidebar items. Individual items must also be enabled.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      if (!selectedChatbotId) {
                        toast.error("Please select a chatbot first");
                        return;
                      }
                      try {
                        setUpdatingMaster(true);
                        await updateChatbotSidebarEnabled(selectedChatbotId, !sidebarEnabled);
                        setSidebarEnabled(!sidebarEnabled);
                        toast.success(`Sidebar ${!sidebarEnabled ? "enabled" : "disabled"} successfully! ✅`);
                      } catch (error) {
                        console.error("Error updating master toggle:", error);
                        toast.error(error.response?.data?.message || "Failed to update sidebar toggle");
                      } finally {
                        setUpdatingMaster(false);
                      }
                    }}
                    disabled={updatingMaster}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      sidebarEnabled ? "bg-[#1e3a8a]" : "bg-gray-300"
                    } ${updatingMaster ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        sidebarEnabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Horizontal Tabs */}
              <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
                <div className="flex flex-wrap gap-2 overflow-x-auto">
                <button
                    onClick={() => setActiveSection("avatar")}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                      activeSection === "avatar"
                        ? "bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] text-white shadow-md"
                        : "bg-white text-gray-700 border border-gray-300 hover:border-[#1e3a8a]"
                    }`}
                  >
                    <Image className="h-4 w-4 mr-2" />
                    Avatar
                </button>

                <button
                    onClick={() => setActiveSection("text")}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                      activeSection === "text"
                        ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md"
                        : "bg-white text-gray-700 border border-gray-300 hover:border-green-500"
                    }`}
                  >
                    <Type className="h-4 w-4 mr-2" />
                    Text
                </button>

                <button
                    onClick={() => setActiveSection("tab")}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                      activeSection === "tab"
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                        : "bg-white text-gray-700 border border-gray-300 hover:border-purple-500"
                    }`}
                  >
                    <Monitor className="h-4 w-4 mr-2" />
                    Tab
                </button>
                <button
                    onClick={() => setActiveSection("placeholders")}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                      activeSection === "placeholders"
                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md"
                        : "bg-white text-gray-700 border border-gray-300 hover:border-emerald-500"
                    }`}
                  >
                    <Type className="h-4 w-4 mr-2" />
                    Placeholders
                </button>
                <button
                    onClick={() => setActiveSection("whatsapp")}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                      activeSection === "whatsapp"
                        ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md"
                        : "bg-white text-gray-700 border border-gray-300 hover:border-green-500"
                    }`}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    WhatsApp
                </button>
                <button
                    onClick={() => setActiveSection("call")}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                      activeSection === "call"
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                        : "bg-white text-gray-700 border border-gray-300 hover:border-blue-500"
                    }`}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                </button>
                <button
                    onClick={() => setActiveSection("calendly")}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                      activeSection === "calendly"
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md"
                        : "bg-white text-gray-700 border border-gray-300 hover:border-purple-500"
                    }`}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Calendly
                </button>
                <button
                    onClick={() => setActiveSection("email")}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                      activeSection === "email"
                        ? "bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-md"
                        : "bg-white text-gray-700 border border-gray-300 hover:border-red-500"
                    }`}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                </button>
                <button
                    onClick={() => setActiveSection("whatsapp-proposal")}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                      activeSection === "whatsapp-proposal"
                        ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md"
                        : "bg-white text-gray-700 border border-gray-300 hover:border-green-500"
                    }`}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    WhatsApp Proposal
                </button>
                <button
                    onClick={() => setActiveSection("authentication")}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                      activeSection === "authentication"
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                        : "bg-white text-gray-700 border border-gray-300 hover:border-indigo-500"
                    }`}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Authentication
                </button>
                <button
                    onClick={() => setActiveSection("intent")}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                      activeSection === "intent"
                        ? "bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-md"
                        : "bg-white text-gray-700 border border-gray-300 hover:border-orange-500"
                    }`}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Intent & Proposals
                </button>
                <button
                    onClick={() => setActiveSection("transcript")}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                      activeSection === "transcript"
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                        : "bg-white text-gray-700 border border-gray-300 hover:border-blue-500"
                    }`}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Transcript
                </button>
                <button
                    onClick={() => setActiveSection("zoho")}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                      activeSection === "zoho"
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                        : "bg-white text-gray-700 border border-gray-300 hover:border-purple-500"
                    }`}
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Zoho CRM
                </button>
                <button
                    onClick={() => setActiveSection("social")}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                      activeSection === "social"
                        ? "bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md"
                        : "bg-white text-gray-700 border border-gray-300 hover:border-cyan-500"
                    }`}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Social
                </button>
                <button
                    onClick={() => setActiveSection("branding")}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                      activeSection === "branding"
                        ? "bg-gradient-to-r from-yellow-600 to-amber-600 text-white shadow-md"
                        : "bg-white text-gray-700 border border-gray-300 hover:border-yellow-500"
                    }`}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Branding
                </button>
                <button
                    onClick={() => setActiveSection("header")}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                      activeSection === "header"
                        ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md"
                        : "bg-white text-gray-700 border border-gray-300 hover:border-indigo-500"
                    }`}
                  >
                    <Heading className="h-4 w-4 mr-2" />
                    Header
                </button>
                <button
                    onClick={() => setActiveSection("custom-nav")}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                      activeSection === "custom-nav"
                        ? "bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md"
                        : "bg-white text-gray-700 border border-gray-300 hover:border-teal-500"
                    }`}
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Custom Nav
                </button>
                </div>
              </div>

              {/* Avatar Image Section */}
              {activeSection === "avatar" && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <Image className="h-6 w-6 text-blue-600 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-800">Avatar Image</h2>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Enter the full URL of the image you want to display as the chatbot avatar
                  </p>
                </div>

                <button
                  onClick={handleUpdateAvatar}
                  disabled={updatingAvatar || !avatarUrl.trim()}
                  className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                >
                  {updatingAvatar ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Image className="h-5 w-5 mr-2" />
                      Update Avatar Image
                    </>
                  )}
                </button>
              </div>
              )}

              {/* Welcome Text Section */}
              {activeSection === "text" && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <Type className="h-6 w-6 text-green-600 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-800">Welcome Message</h2>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Welcome Text
                  </label>
                  <textarea
                    value={welcomeText}
                    onChange={(e) => setWelcomeText(e.target.value)}
                    placeholder="Hi! I'm your AI Assistant - here to help..."
                    rows={4}
                    maxLength={500}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-700 resize-none"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-500">
                      Enter the welcome message that appears above the input box
                    </p>
                    <p className="text-xs text-gray-500">
                      {welcomeText.length}/500 characters
                    </p>
                  </div>

                </div>

                {/* Text Preview */}
                {welcomeText && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                    <p className="text-gray-800 italic">"{welcomeText}"</p>
                  </div>
                )}

                {/* AI Assistant Logo URL */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    AI Assistant Logo URL
                  </label>
                  <input
                    type="url"
                    value={assistantLogoUrl}
                    onChange={(e) => setAssistantLogoUrl(e.target.value)}
                    placeholder="https://example.com/logo.png"
                    maxLength={500}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-700"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Enter the URL of the image/logo to display next to the assistant name. Leave empty to use default.
                  </p>
                </div>

                {/* Assistant Display Name */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assistant Display Name (shown above replies)
                  </label>
                  <input
                    type="text"
                    value={assistantDisplayName}
                    onChange={(e) => setAssistantDisplayName(e.target.value)}
                    placeholder="e.g., AI Assistant, Admissions Advisor"
                    maxLength={100}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-700"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    {assistantDisplayName.length}/100 characters. Leave empty to use a generic assistant name.
                  </p>
                </div>

                <button
                  onClick={handleUpdateWelcomeText}
                  disabled={updatingText}
                  className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                >
                  {updatingText ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Type className="h-5 w-5 mr-2" />
                      Update Welcome Message
                    </>
                  )}
                </button>
              </div>
              )}

              {/* WhatsApp Configuration Section */}
              {activeSection === "whatsapp" && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    <MessageSquare className="h-6 w-6 text-green-600 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-800">WhatsApp Configuration</h2>
                  </div>

                  {/* Enable WhatsApp Toggle */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Show WhatsApp in Sidebar
                      </label>
                      <button
                        onClick={() => setWhatsappEnabled(!whatsappEnabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          whatsappEnabled ? "bg-green-600" : "bg-gray-300"
                        } cursor-pointer`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            whatsappEnabled ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Display Text */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Text in Sidebar
                    </label>
                    <input
                      type="text"
                      value={whatsappText}
                      onChange={(e) => setWhatsappText(e.target.value)}
                      placeholder="Connect on WhatsApp"
                      maxLength={100}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-700"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      {whatsappText.length}/100 characters
                    </p>
                  </div>

                  {/* Behavior Mode */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Behavior Mode
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="whatsappMode"
                          value="redirect"
                          checked={whatsappMode === "redirect"}
                          onChange={(e) => setWhatsappMode(e.target.value)}
                          className="mr-3 h-4 w-4 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-gray-700">Redirect to WhatsApp</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="whatsappMode"
                          value="premium_modal"
                          checked={whatsappMode === "premium_modal"}
                          onChange={(e) => setWhatsappMode(e.target.value)}
                          className="mr-3 h-4 w-4 text-green-600 focus:ring-green-500"
                        />
                        <span className="text-gray-700">Show Premium Modal</span>
                      </label>
                    </div>
                  </div>

                  {/* WhatsApp URL Input (only if redirect mode) */}
                  {whatsappMode === "redirect" && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        WhatsApp URL
                      </label>
                      <input
                        type="text"
                        value={whatsappUrl}
                        onChange={(e) => setWhatsappUrl(e.target.value)}
                        placeholder="https://wa.me/1234567890 or +1234567890"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-700"
                      />
                      <p className="mt-2 text-xs text-gray-500">
                        Enter WhatsApp URL (e.g., https://wa.me/919876543210) or phone number with country code
                      </p>
                    </div>
                  )}

                  <button
                    onClick={async () => {
                      if (!selectedChatbotId) {
                        toast.error("Please select a chatbot first");
                        return;
                      }
                      if (whatsappMode === "redirect" && !whatsappUrl.trim()) {
                        toast.error("Please enter a WhatsApp URL when mode is 'Redirect'");
                        return;
                      }
                      if (whatsappMode === "redirect" && whatsappUrl.trim()) {
                        const whatsappUrlPattern = /^(https?:\/\/)?(wa\.me\/|api\.whatsapp\.com\/send\?phone=|\+?\d{10,15})/i;
                        if (!whatsappUrlPattern.test(whatsappUrl.trim())) {
                          toast.error("Invalid WhatsApp URL format. Use format like https://wa.me/1234567890 or +1234567890");
                          return;
                        }
                      }
                      try {
                        setUpdatingWhatsApp(true);
                        await updateChatbotSidebarWhatsApp(
                          selectedChatbotId,
                          whatsappEnabled,
                          whatsappMode,
                          whatsappMode === "redirect" ? whatsappUrl.trim() : null,
                          whatsappText.trim() || "Connect on WhatsApp"
                        );
                        toast.success("WhatsApp configuration updated successfully! ✅");
                      } catch (error) {
                        console.error("Error updating WhatsApp config:", error);
                        toast.error(error.response?.data?.message || "Failed to update WhatsApp configuration");
                      } finally {
                        setUpdatingWhatsApp(false);
                      }
                    }}
                    disabled={updatingWhatsApp || !whatsappText.trim()}
                    className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                  >
                    {updatingWhatsApp ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <MessageSquare className="h-5 w-5 mr-2" />
                        Update WhatsApp Settings
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Call Configuration Section */}
              {activeSection === "call" && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    <Phone className="h-6 w-6 text-blue-600 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-800">Call Configuration</h2>
                  </div>

                  {/* Enable Call Toggle */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Show Call in Sidebar
                      </label>
                      <button
                        onClick={() => setCallEnabled(!callEnabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          callEnabled ? "bg-blue-600" : "bg-gray-300"
                        } cursor-pointer`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            callEnabled ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Display Text */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Text in Sidebar
                    </label>
                    <input
                      type="text"
                      value={callText}
                      onChange={(e) => setCallText(e.target.value)}
                      placeholder="Talk to a Counsellor"
                      maxLength={100}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      {callText.length}/100 characters
                    </p>
                  </div>

                  {/* Behavior Mode */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Behavior Mode
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="callMode"
                          value="redirect"
                          checked={callMode === "redirect"}
                          onChange={(e) => setCallMode(e.target.value)}
                          className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">Redirect to Phone</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="callMode"
                          value="premium_modal"
                          checked={callMode === "premium_modal"}
                          onChange={(e) => setCallMode(e.target.value)}
                          className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">Show Premium Modal</span>
                      </label>
                    </div>
                  </div>

                  {/* Phone Number Input (only if redirect mode) */}
                  {callMode === "redirect" && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={callNumber}
                        onChange={(e) => setCallNumber(e.target.value)}
                        placeholder="+1234567890 or 1234567890"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                      />
                      <p className="mt-2 text-xs text-gray-500">
                        Enter phone number with country code (e.g., +919876543210)
                      </p>
                    </div>
                  )}

                  <button
                    onClick={async () => {
                      if (!selectedChatbotId) {
                        toast.error("Please select a chatbot first");
                        return;
                      }
                      if (callMode === "redirect" && !callNumber.trim()) {
                        toast.error("Please enter a phone number when mode is 'Redirect'");
                        return;
                      }
                      if (callMode === "redirect" && callNumber.trim()) {
                        const phonePattern = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
                        if (!phonePattern.test(callNumber.trim())) {
                          toast.error("Invalid phone number format");
                          return;
                        }
                      }
                      try {
                        setUpdatingCall(true);
                        await updateChatbotSidebarCall(
                          selectedChatbotId,
                          callEnabled,
                          callMode,
                          callMode === "redirect" ? callNumber.trim() : null,
                          callText.trim() || "Talk to a Counsellor"
                        );
                        toast.success("Call configuration updated successfully! ✅");
                      } catch (error) {
                        console.error("Error updating Call config:", error);
                        toast.error(error.response?.data?.message || "Failed to update Call configuration");
                      } finally {
                        setUpdatingCall(false);
                      }
                    }}
                    disabled={updatingCall || !callText.trim()}
                    className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                  >
                    {updatingCall ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Phone className="h-5 w-5 mr-2" />
                        Update Call Settings
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Calendly Configuration Section */}
              {activeSection === "calendly" && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    <Calendar className="h-6 w-6 text-purple-600 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-800">Calendly Configuration</h2>
                  </div>

                  {/* Enable Calendly Toggle */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Show Calendly in Sidebar
                      </label>
                      <button
                        onClick={() => setCalendlyEnabled(!calendlyEnabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          calendlyEnabled ? "bg-purple-600" : "bg-gray-300"
                        } cursor-pointer`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            calendlyEnabled ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Display Text */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Text in Sidebar
                    </label>
                    <input
                      type="text"
                      value={calendlyText}
                      onChange={(e) => setCalendlyText(e.target.value)}
                      placeholder="Schedule a Meeting"
                      maxLength={100}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-700"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      {calendlyText.length}/100 characters
                    </p>
                  </div>

                  {/* Behavior Mode */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Behavior Mode
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="calendlyMode"
                          value="redirect"
                          checked={calendlyMode === "redirect"}
                          onChange={(e) => setCalendlyMode(e.target.value)}
                          className="mr-3 h-4 w-4 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-gray-700">Redirect to Calendly (Opens in Schedule Meeting page)</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="calendlyMode"
                          value="premium_modal"
                          checked={calendlyMode === "premium_modal"}
                          onChange={(e) => setCalendlyMode(e.target.value)}
                          className="mr-3 h-4 w-4 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-gray-700">Show Premium Modal</span>
                      </label>
                    </div>
                  </div>

                  {/* Calendly URL Input (only if redirect mode) */}
                  {calendlyMode === "redirect" && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Calendly Link
                      </label>
                      <input
                        type="url"
                        value={calendlyUrl}
                        onChange={(e) => setCalendlyUrl(e.target.value)}
                        placeholder="https://calendly.com/username/meeting-type"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-700"
                      />
                      <p className="mt-2 text-xs text-gray-500">
                        Enter your full Calendly scheduling link (e.g., https://calendly.com/company/consultation)
                      </p>
                    </div>
                  )}

                  <button
                    onClick={async () => {
                      if (!selectedChatbotId) {
                        toast.error("Please select a chatbot first");
                        return;
                      }
                      if (calendlyMode === "redirect" && !calendlyUrl.trim()) {
                        toast.error("Please enter a Calendly URL when mode is 'Redirect'");
                        return;
                      }
                      if (calendlyMode === "redirect" && calendlyUrl.trim()) {
                        try {
                          const urlObj = new URL(calendlyUrl.trim());
                          if (!urlObj.hostname.includes("calendly.com")) {
                            toast.error("URL must be a valid Calendly link (e.g., https://calendly.com/username/meeting-type)");
                            return;
                          }
                        } catch (e) {
                          toast.error("Invalid URL format. Use format like https://calendly.com/username/meeting-type");
                          return;
                        }
                      }
                      try {
                        setUpdatingCalendly(true);
                        await updateChatbotSidebarCalendly(
                          selectedChatbotId,
                          calendlyEnabled,
                          calendlyMode,
                          calendlyMode === "redirect" ? calendlyUrl.trim() : null,
                          calendlyText.trim() || "Schedule a Meeting"
                        );
                        toast.success("Calendly configuration updated successfully! ✅");
                      } catch (error) {
                        console.error("Error updating Calendly config:", error);
                        toast.error(error.response?.data?.message || "Failed to update Calendly configuration");
                      } finally {
                        setUpdatingCalendly(false);
                      }
                    }}
                    disabled={updatingCalendly || !calendlyText.trim()}
                    className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                  >
                    {updatingCalendly ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Calendar className="h-5 w-5 mr-2" />
                        Update Calendly Settings
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Email Configuration Section */}
              {activeSection === "email" && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    <Mail className="h-6 w-6 text-orange-600 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-800">Email Configuration</h2>
                  </div>

                  {/* Enable Email Toggle */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Show Email in Sidebar
                      </label>
                      <button
                        onClick={() => setEmailEnabled(!emailEnabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          emailEnabled ? "bg-orange-600" : "bg-gray-300"
                        } cursor-pointer`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            emailEnabled ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Display Text */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Text in Sidebar
                    </label>
                    <input
                      type="text"
                      value={emailText}
                      onChange={(e) => setEmailText(e.target.value)}
                      placeholder="Send an Email"
                      maxLength={100}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-700"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      {emailText.length}/100 characters
                    </p>
                  </div>

                  {/* Behavior Mode */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Behavior Mode
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="emailMode"
                          value="show_templates"
                          checked={emailMode === "show_templates"}
                          onChange={(e) => setEmailMode(e.target.value)}
                          className="mr-3 h-4 w-4 text-orange-600 focus:ring-orange-500"
                        />
                        <span className="text-gray-700">Show Email Templates (in ServiceSelection)</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="emailMode"
                          value="premium_modal"
                          checked={emailMode === "premium_modal"}
                          onChange={(e) => setEmailMode(e.target.value)}
                          className="mr-3 h-4 w-4 text-orange-600 focus:ring-orange-500"
                        />
                        <span className="text-gray-700">Show Premium Modal</span>
                      </label>
                    </div>
                  </div>

                  {/* Email Templates Management (only if show_templates mode) */}
                  {emailMode === "show_templates" && (
                    <div className="mb-6 border-t pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Email Templates</h3>
                        <button
                          onClick={handleAddTemplate}
                          className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add New Template
                        </button>
                      </div>

                      {loadingTemplates ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
                          <span className="ml-2 text-gray-600">Loading templates...</span>
                        </div>
                      ) : emailTemplates.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <Mail className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>No email templates yet. Click "Add New Template" to create one.</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {emailTemplates.map((template) => (
                            <div
                              key={template._id}
                              className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-semibold text-gray-800">{template.template_name}</h4>
                                    {!template.is_active && (
                                      <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">Inactive</span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600 mb-1">
                                    <strong>Subject:</strong> {template.email_subject}
                                  </p>
                                  <p className="text-xs text-gray-500 line-clamp-2">
                                    {template.email_body.substring(0, 100)}...
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                  <button
                                    onClick={() => handleEditTemplate(template)}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Edit template"
                                  >
                                    <Edit2 className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteTemplate(template._id)}
                                    disabled={deletingTemplate === template._id}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                    title="Delete template"
                                  >
                                    {deletingTemplate === template._id ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <Trash2 className="h-4 w-4" />
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Template Form Modal */}
                  {showTemplateForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-gray-800">
                              {editingTemplate ? "Edit Email Template" : "Add New Email Template"}
                            </h3>
                            <button
                              onClick={() => {
                                setShowTemplateForm(false);
                                setEditingTemplate(null);
                                setTemplateFormData({
                                  template_name: "",
                                  email_subject: "",
                                  email_body: "",
                                  is_active: true,
                                  order: 0,
                                });
                                setShowEmailPreview(false);
                              }}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Template Name *
                              </label>
                              <input
                                type="text"
                                value={templateFormData.template_name}
                                onChange={(e) =>
                                  setTemplateFormData({ ...templateFormData, template_name: e.target.value })
                                }
                                placeholder="Event Information"
                                maxLength={100}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-700"
                              />
                              <p className="mt-1 text-xs text-gray-500">
                                {templateFormData.template_name.length}/100 characters
                              </p>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Subject *
                              </label>
                              <input
                                type="text"
                                value={templateFormData.email_subject}
                                onChange={(e) =>
                                  setTemplateFormData({ ...templateFormData, email_subject: e.target.value })
                                }
                                placeholder="PlastiWorld 2026 Event Details"
                                maxLength={200}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-700"
                              />
                              <p className="mt-1 text-xs text-gray-500">
                                {templateFormData.email_subject.length}/200 characters
                              </p>
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                  Email Body *
                                </label>
                                <button
                                  type="button"
                                  onClick={() => setShowEmailPreview(!showEmailPreview)}
                                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors"
                                >
                                  {showEmailPreview ? (
                                    <>
                                      <Edit2 className="h-4 w-4" />
                                      Edit
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="h-4 w-4" />
                                      Preview
                                    </>
                                  )}
                                </button>
                              </div>
                              
                              {showEmailPreview ? (
                                <div className="border border-gray-300 rounded-lg bg-white overflow-hidden">
                                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                    <div className="text-sm font-medium text-gray-700 mb-1">Email Preview</div>
                                    <div className="text-xs text-gray-500">
                                      Subject: <span className="font-medium">{getEmailPreview().previewSubject || "(No subject)"}</span>
                                    </div>
                                  </div>
                                  <div 
                                    className="p-6 min-h-[300px] bg-white"
                                    style={{
                                      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                      lineHeight: '1.6',
                                      color: '#374151',
                                      fontSize: '14px'
                                    }}
                                  >
                                    <style>{`
                                      .email-preview-content h1,
                                      .email-preview-content h2,
                                      .email-preview-content h3 {
                                        margin-top: 1em;
                                        margin-bottom: 0.5em;
                                        font-weight: 600;
                                      }
                                      .email-preview-content h1 { font-size: 24px; }
                                      .email-preview-content h2 { font-size: 20px; }
                                      .email-preview-content h3 { font-size: 18px; }
                                      .email-preview-content p {
                                        margin: 0.75em 0;
                                      }
                                      .email-preview-content ul,
                                      .email-preview-content ol {
                                        margin: 0.75em 0;
                                        padding-left: 1.5em;
                                      }
                                      .email-preview-content li {
                                        margin: 0.25em 0;
                                      }
                                      .email-preview-content a {
                                        color: #ea580c;
                                        text-decoration: underline;
                                      }
                                      .email-preview-content strong {
                                        font-weight: 600;
                                      }
                                      .email-preview-content em {
                                        font-style: italic;
                                      }
                                      .email-preview-content u {
                                        text-decoration: underline;
                                      }
                                    `}</style>
                                    <div 
                                      className="email-preview-content"
                                      dangerouslySetInnerHTML={{ __html: getEmailPreview().previewBody || '<p style="color: #9ca3af; font-style: italic;">No content yet. Add some content to see the preview.</p>' }}
                                    />
                                  </div>
                                  <div className="bg-blue-50 border-t border-blue-200 px-4 py-2">
                                    <p className="text-xs text-blue-700">
                                      <strong>Note:</strong> Variables like {"{name}"}, {"{email}"}, {"{phone}"} are shown with sample values. Actual emails will use real recipient data.
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-orange-500 overflow-hidden">
                                    <style>{`
                                      .ql-container {
                                        font-family: inherit;
                                        font-size: 14px;
                                        min-height: 200px;
                                      }
                                      .ql-editor {
                                        min-height: 200px;
                                        color: #374151;
                                      }
                                      .ql-editor.ql-blank::before {
                                        color: #9ca3af;
                                        font-style: normal;
                                      }
                                      .ql-toolbar {
                                        border-top: none;
                                        border-left: none;
                                        border-right: none;
                                        border-bottom: 1px solid #e5e7eb;
                                        padding: 12px;
                                      }
                                      .ql-container {
                                        border-bottom: none;
                                        border-left: none;
                                        border-right: none;
                                        border-top: none;
                                      }
                                      .ql-editor {
                                        padding: 16px;
                                      }
                                    `}</style>
                                    <ReactQuill
                                      theme="snow"
                                      value={templateFormData.email_body}
                                      onChange={(value) =>
                                        setTemplateFormData({ ...templateFormData, email_body: value })
                                      }
                                      placeholder="Dear {name},&#10;&#10;Thank you for your interest in PlastiWorld 2026..."
                                      modules={{
                                        toolbar: [
                                          [{ 'header': [1, 2, 3, false] }],
                                          ['bold', 'italic', 'underline', 'strike'],
                                          [{ 'color': [] }, { 'background': [] }],
                                          [{ 'font': [] }],
                                          [{ 'size': ['small', false, 'large', 'huge'] }],
                                          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                          [{ 'align': [] }],
                                          ['link'],
                                          ['clean']
                                        ],
                                      }}
                                      formats={[
                                        'header', 'font', 'size',
                                        'bold', 'italic', 'underline', 'strike',
                                        'color', 'background',
                                        'list', 'bullet', 'align',
                                        'link'
                                      ]}
                                    />
                                  </div>
                                  <p className="mt-1 text-xs text-gray-500">
                                    You can use variables like {"{name}"}, {"{email}"}, {"{phone}"} in the body. Formatting (bold, colors, fonts) will be preserved when pasting from Word, emails, or web pages.
                                  </p>
                                </>
                              )}
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="templateActive"
                                checked={templateFormData.is_active}
                                onChange={(e) =>
                                  setTemplateFormData({ ...templateFormData, is_active: e.target.checked })
                                }
                                className="mr-2 h-4 w-4 text-orange-600 focus:ring-orange-500"
                              />
                              <label htmlFor="templateActive" className="text-sm text-gray-700">
                                Template is active (will be shown to users)
                              </label>
                            </div>
                          </div>

                          <div className="flex gap-3 mt-6">
                            <button
                              onClick={handleSaveTemplate}
                              disabled={savingTemplate || !templateFormData.template_name.trim() || !templateFormData.email_subject.trim() || !templateFormData.email_body.trim()}
                              className="flex-1 px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                              {savingTemplate ? (
                                <>
                                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <Mail className="h-5 w-5 mr-2" />
                                  {editingTemplate ? "Update Template" : "Create Template"}
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setShowTemplateForm(false);
                                setEditingTemplate(null);
                                setTemplateFormData({
                                  template_name: "",
                                  email_subject: "",
                                  email_body: "",
                                  is_active: true,
                                  order: 0,
                                });
                              }}
                              className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={async () => {
                      if (!selectedChatbotId) {
                        toast.error("Please select a chatbot first");
                        return;
                      }
                      try {
                        setUpdatingEmail(true);
                        await updateChatbotSidebarEmail(
                          selectedChatbotId,
                          emailEnabled,
                          emailMode,
                          emailText.trim() || "Send an Email"
                        );
                        toast.success("Email configuration updated successfully! ✅");
                      } catch (error) {
                        console.error("Error updating Email config:", error);
                        toast.error(error.response?.data?.message || "Failed to update Email configuration");
                      } finally {
                        setUpdatingEmail(false);
                      }
                    }}
                    disabled={updatingEmail || !emailText.trim()}
                    className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                  >
                    {updatingEmail ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Mail className="h-5 w-5 mr-2" />
                        Update Email Settings
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* WhatsApp Proposal Configuration Section */}
              {activeSection === "whatsapp-proposal" && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    <MessageSquare className="h-6 w-6 text-green-600 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-800">WhatsApp Sidebar Proposal Configuration</h2>
                  </div>

                  {/* Enable WhatsApp Proposal Toggle */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Show WhatsApp Proposal in Sidebar
                      </label>
                      <button
                        onClick={() => setWhatsappProposalEnabled(!whatsappProposalEnabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          whatsappProposalEnabled ? "bg-green-600" : "bg-gray-300"
                        } cursor-pointer`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            whatsappProposalEnabled ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Enable this to show a WhatsApp proposal option in the sidebar. Users can send proposals via WhatsApp using configured templates.
                    </p>
                  </div>

                  {/* Display Text */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Text in Sidebar
                    </label>
                    <input
                      type="text"
                      value={whatsappProposalText}
                      onChange={(e) => setWhatsappProposalText(e.target.value)}
                      placeholder="Send Proposal via WhatsApp"
                      maxLength={100}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-700"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      {whatsappProposalText.length}/100 characters
                    </p>
                  </div>

                  {/* Default AISensy Configuration */}
                  <div className="mb-6 border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Default AISensy Configuration</h3>
                    <p className="text-xs text-gray-500 mb-4">
                      These settings will be used as fallback if individual templates don't specify their own AISensy configuration. If not set here, environment variables will be used.
                    </p>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Default API Key (optional)
                        </label>
                        <input
                          type="text"
                          value={whatsappProposalDefaultApiKey}
                          onChange={(e) => setWhatsappProposalDefaultApiKey(e.target.value)}
                          placeholder="Leave empty to use environment variable"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-700"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Default Org Slug (optional)
                        </label>
                        <input
                          type="text"
                          value={whatsappProposalDefaultOrgSlug}
                          onChange={(e) => setWhatsappProposalDefaultOrgSlug(e.target.value)}
                          placeholder="Leave empty to use environment variable"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-700"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Default Sender Name (optional)
                        </label>
                        <input
                          type="text"
                          value={whatsappProposalDefaultSenderName}
                          onChange={(e) => setWhatsappProposalDefaultSenderName(e.target.value)}
                          placeholder="Leave empty to use environment variable"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-700"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Default Country Code
                        </label>
                        <input
                          type="text"
                          value={whatsappProposalDefaultCountryCode}
                          onChange={(e) => setWhatsappProposalDefaultCountryCode(e.target.value)}
                          placeholder="91"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-700"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Country code for phone numbers (e.g., 91 for India, 1 for USA)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Proposal Templates Management */}
                  <div className="mb-6 border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Proposal Templates</h3>
                      <button
                        onClick={handleAddProposalTemplate}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Template
                      </button>
                    </div>

                    {loadingProposalTemplates ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-green-600" />
                        <span className="ml-2 text-gray-600">Loading templates...</span>
                      </div>
                    ) : whatsappProposalTemplates.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No proposal templates yet. Click "Add New Template" to create one.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {whatsappProposalTemplates.map((template) => (
                          <div
                            key={template._id}
                            className="border border-gray-300 rounded-lg p-4 hover:border-green-500 transition-colors"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold text-gray-800">{template.display_name}</h4>
                                  {!template.is_active && (
                                    <span className="px-2 py-0.5 text-xs bg-gray-200 text-gray-600 rounded">
                                      Inactive
                                    </span>
                                  )}
                                </div>
                                {template.description && (
                                  <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                                )}
                                <div className="text-xs text-gray-500 space-y-1">
                                  <p><strong>Campaign:</strong> {template.campaign_name}</p>
                                  <p><strong>Template:</strong> {template.template_name}</p>
                                  {template.template_params && template.template_params.length > 0 && (
                                    <p><strong>Parameters:</strong> {template.template_params.length} configured</p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                <button
                                  onClick={() => handleEditProposalTemplate(template)}
                                  className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteProposalTemplate(template._id)}
                                  disabled={deletingProposalTemplate === template._id}
                                  className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                                >
                                  {deletingProposalTemplate === template._id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    "Delete"
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Template Form Modal */}
                  {showProposalTemplateForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold text-gray-800">
                              {editingProposalTemplate ? "Edit Proposal Template" : "Add New Proposal Template"}
                            </h3>
                            <button
                              onClick={() => {
                                setShowProposalTemplateForm(false);
                                setEditingProposalTemplate(null);
                              }}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Display Name <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={proposalTemplateFormData.display_name}
                                onChange={(e) =>
                                  setProposalTemplateFormData({
                                    ...proposalTemplateFormData,
                                    display_name: e.target.value,
                                  })
                                }
                                placeholder="e.g., Service Proposal"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description (optional)
                              </label>
                              <input
                                type="text"
                                value={proposalTemplateFormData.description}
                                onChange={(e) =>
                                  setProposalTemplateFormData({
                                    ...proposalTemplateFormData,
                                    description: e.target.value,
                                  })
                                }
                                placeholder="Brief description of this template"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Campaign Name <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={proposalTemplateFormData.campaign_name}
                                onChange={(e) =>
                                  setProposalTemplateFormData({
                                    ...proposalTemplateFormData,
                                    campaign_name: e.target.value,
                                  })
                                }
                                placeholder="e.g., proposalsending"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Template Name <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={proposalTemplateFormData.template_name}
                                onChange={(e) =>
                                  setProposalTemplateFormData({
                                    ...proposalTemplateFormData,
                                    template_name: e.target.value,
                                  })
                                }
                                placeholder="AISensy template name"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  API Key (optional)
                                </label>
                                <input
                                  type="text"
                                  value={proposalTemplateFormData.api_key}
                                  onChange={(e) =>
                                    setProposalTemplateFormData({
                                      ...proposalTemplateFormData,
                                      api_key: e.target.value,
                                    })
                                  }
                                  placeholder="Override default"
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Org Slug (optional)
                                </label>
                                <input
                                  type="text"
                                  value={proposalTemplateFormData.org_slug}
                                  onChange={(e) =>
                                    setProposalTemplateFormData({
                                      ...proposalTemplateFormData,
                                      org_slug: e.target.value,
                                    })
                                  }
                                  placeholder="Override default"
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Sender Name (optional)
                                </label>
                                <input
                                  type="text"
                                  value={proposalTemplateFormData.sender_name}
                                  onChange={(e) =>
                                    setProposalTemplateFormData({
                                      ...proposalTemplateFormData,
                                      sender_name: e.target.value,
                                    })
                                  }
                                  placeholder="Override default"
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Country Code
                                </label>
                                <input
                                  type="text"
                                  value={proposalTemplateFormData.country_code}
                                  onChange={(e) =>
                                    setProposalTemplateFormData({
                                      ...proposalTemplateFormData,
                                      country_code: e.target.value,
                                    })
                                  }
                                  placeholder="91"
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Order
                              </label>
                              <input
                                type="number"
                                value={proposalTemplateFormData.order}
                                onChange={(e) =>
                                  setProposalTemplateFormData({
                                    ...proposalTemplateFormData,
                                    order: parseInt(e.target.value) || 0,
                                  })
                                }
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              />
                              <p className="mt-1 text-xs text-gray-500">
                                Lower numbers appear first in the list
                              </p>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="proposalTemplateActive"
                                checked={proposalTemplateFormData.is_active}
                                onChange={(e) =>
                                  setProposalTemplateFormData({
                                    ...proposalTemplateFormData,
                                    is_active: e.target.checked,
                                  })
                                }
                                className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500"
                              />
                              <label htmlFor="proposalTemplateActive" className="text-sm text-gray-700">
                                Template is active (will be shown to users)
                              </label>
                            </div>
                          </div>

                          <div className="flex gap-3 mt-6">
                            <button
                              onClick={handleSaveProposalTemplate}
                              disabled={
                                savingTemplate ||
                                !proposalTemplateFormData.display_name.trim() ||
                                !proposalTemplateFormData.campaign_name.trim() ||
                                !proposalTemplateFormData.template_name.trim()
                              }
                              className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                              {savingTemplate ? (
                                <>
                                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="h-5 w-5 mr-2" />
                                  {editingProposalTemplate ? "Update Template" : "Create Template"}
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setShowProposalTemplateForm(false);
                                setEditingProposalTemplate(null);
                              }}
                              className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleUpdateProposalSettings}
                    disabled={updatingProposalSettings || !whatsappProposalText.trim()}
                    className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                  >
                    {updatingProposalSettings ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <MessageSquare className="h-5 w-5 mr-2" />
                        Update Proposal Settings
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Zoho CRM Integration Configuration Section */}
              {activeSection === "zoho" && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    <Database className="h-6 w-6 text-purple-600 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-800">Zoho CRM Integration</h2>
                  </div>

                  {zohoConfigLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
                      <span className="ml-2 text-gray-600">Loading Zoho configuration...</span>
                    </div>
                  ) : (
                    <>
                      {/* Enable Zoho Integration Toggle */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <label className="text-lg font-semibold text-gray-800">Enable Zoho Lead Capture</label>
                            <p className="text-sm text-gray-500 mt-1">
                              Automatically capture leads to Zoho CRM when users show interest
                            </p>
                          </div>
                          <button
                            onClick={() => setZohoConfig({ ...zohoConfig, enabled: !zohoConfig.enabled })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              zohoConfig.enabled ? "bg-purple-600" : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                zohoConfig.enabled ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {zohoConfig.enabled && (
                        <div className="space-y-6">
                          {/* Zoho Credentials */}
                          <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Zoho CRM Credentials</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Zoho Region
                                </label>
                                <select
                                  value={zohoConfig.zoho_region}
                                  onChange={(e) => setZohoConfig({ ...zohoConfig, zoho_region: e.target.value })}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                  <option value="com">United States (com)</option>
                                  <option value="eu">Europe (eu)</option>
                                  <option value="in">India (in)</option>
                                  <option value="au">Australia (au)</option>
                                  <option value="jp">Japan (jp)</option>
                                  <option value="ca">Canada (ca)</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Zoho Module
                                </label>
                                <select
                                  value={zohoConfig.zoho_module}
                                  onChange={(e) => setZohoConfig({ ...zohoConfig, zoho_module: e.target.value })}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                  <option value="Leads">Leads</option>
                                  <option value="Contacts">Contacts</option>
                                  <option value="Deals">Deals</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Client ID
                                </label>
                                <div className="relative">
                                  <input
                                    type={showZohoPassword.client_id ? "text" : "password"}
                                    value={zohoConfig.zoho_client_id}
                                    onChange={(e) => setZohoConfig({ ...zohoConfig, zoho_client_id: e.target.value })}
                                    placeholder="Enter Zoho Client ID"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowZohoPassword({ ...showZohoPassword, client_id: !showZohoPassword.client_id })}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                  >
                                    {showZohoPassword.client_id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </button>
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Client Secret
                                </label>
                                <div className="relative">
                                  <input
                                    type={showZohoPassword.client_secret ? "text" : "password"}
                                    value={zohoConfig.zoho_client_secret}
                                    onChange={(e) => setZohoConfig({ ...zohoConfig, zoho_client_secret: e.target.value })}
                                    placeholder="Enter Zoho Client Secret"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowZohoPassword({ ...showZohoPassword, client_secret: !showZohoPassword.client_secret })}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                  >
                                    {showZohoPassword.client_secret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </button>
                                </div>
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Refresh Token
                                </label>
                                <div className="relative">
                                  <input
                                    type={showZohoPassword.refresh_token ? "text" : "password"}
                                    value={zohoConfig.zoho_refresh_token}
                                    onChange={(e) => setZohoConfig({ ...zohoConfig, zoho_refresh_token: e.target.value })}
                                    placeholder="Enter Zoho Refresh Token"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowZohoPassword({ ...showZohoPassword, refresh_token: !showZohoPassword.refresh_token })}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                  >
                                    {showZohoPassword.refresh_token ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </button>
                                </div>
                                <div className="mt-2 flex items-center gap-2">
                                  <button
                                    onClick={handleGenerateRefreshToken}
                                    disabled={generatingRefreshToken || !zohoConfig.zoho_client_id || !zohoConfig.zoho_client_secret}
                                    className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                  >
                                    {generatingRefreshToken ? (
                                      <>
                                        <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />
                                        Generating...
                                      </>
                                    ) : (
                                      <>
                                        <Sparkles className="h-3 w-3 mr-1.5" />
                                        Generate Refresh Token
                                      </>
                                    )}
                                  </button>
                                  <p className="text-xs text-gray-500">
                                    or get from 
                                    <a 
                                      href="https://api-console.zoho.com/" 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-purple-600 hover:text-purple-800 underline ml-1"
                                    >
                                      Zoho Developer Console
                                    </a>
                                  </p>
                                </div>
                                {/* Manual Code Exchange */}
                                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                  <p className="text-xs text-gray-600 mb-2">
                                    <strong>Manual Exchange:</strong> If the automatic flow didn't work, copy the authorization code from the callback page and paste it here:
                                  </p>
                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      value={manualAuthCode}
                                      onChange={(e) => setManualAuthCode(e.target.value)}
                                      placeholder="Paste authorization code here..."
                                      className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                      onClick={handleManualCodeExchange}
                                      disabled={exchangingManualCode || !manualAuthCode.trim()}
                                      className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                    >
                                      {exchangingManualCode ? (
                                        <>
                                          <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />
                                          Exchanging...
                                        </>
                                      ) : (
                                        <>
                                          <Sparkles className="h-3 w-3 mr-1.5" />
                                          Exchange Code
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="mt-4">
                              <button
                                onClick={handleTestZohoConnection}
                                disabled={testingZohoConnection}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                              >
                                {testingZohoConnection ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Testing...
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    Test Connection
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Intent Keywords */}
                          <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Lead Capture Settings</h3>
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Intent Keywords <span className="text-red-500">*</span>
                              </label>
                              <p className="text-xs text-gray-500 mb-3">
                                Add keywords that trigger lead capture (e.g., "interested", "want to buy", "get quote")
                              </p>
                              <div className="flex gap-2 mb-3">
                                <input
                                  type="text"
                                  value={newZohoKeyword}
                                  onChange={(e) => setNewZohoKeyword(e.target.value)}
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      handleAddZohoKeyword();
                                    }
                                  }}
                                  placeholder="Enter keyword (e.g., interested)"
                                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                                <button
                                  onClick={handleAddZohoKeyword}
                                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                              {zohoConfig.capture_intent_keywords.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                  {zohoConfig.capture_intent_keywords.map((keyword, index) => (
                                    <span
                                      key={index}
                                      className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                                    >
                                      {keyword}
                                      <button
                                        onClick={() => handleRemoveZohoKeyword(keyword)}
                                        className="ml-2 text-purple-600 hover:text-purple-800"
                                      >
                                        <X className="h-3 w-3" />
                                      </button>
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-gray-500 italic">No keywords added yet</p>
                              )}
                            </div>

                            {/* Required Fields */}
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Required Fields
                              </label>
                              <div className="flex flex-wrap gap-3">
                                {['name', 'phone', 'email', 'company'].map((field) => (
                                  <label key={field} className="flex items-center">
                                    <input
                                      type="checkbox"
                                      checked={zohoConfig.required_fields.includes(field)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setZohoConfig({
                                            ...zohoConfig,
                                            required_fields: [...zohoConfig.required_fields, field],
                                            optional_fields: zohoConfig.optional_fields.filter(f => f !== field),
                                          });
                                        } else {
                                          setZohoConfig({
                                            ...zohoConfig,
                                            required_fields: zohoConfig.required_fields.filter(f => f !== field),
                                          });
                                        }
                                      }}
                                      className="mr-2"
                                    />
                                    <span className="text-sm text-gray-700 capitalize">{field}</span>
                                  </label>
                                ))}
                              </div>
                            </div>

                            {/* Optional Fields */}
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Optional Fields
                              </label>
                              <div className="flex flex-wrap gap-3">
                                {['name', 'phone', 'email', 'company', 'message'].map((field) => (
                                  <label key={field} className="flex items-center">
                                    <input
                                      type="checkbox"
                                      checked={zohoConfig.optional_fields.includes(field)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setZohoConfig({
                                            ...zohoConfig,
                                            optional_fields: [...zohoConfig.optional_fields, field],
                                            required_fields: zohoConfig.required_fields.filter(f => f !== field),
                                          });
                                        } else {
                                          setZohoConfig({
                                            ...zohoConfig,
                                            optional_fields: zohoConfig.optional_fields.filter(f => f !== field),
                                          });
                                        }
                                      }}
                                      className="mr-2"
                                    />
                                    <span className="text-sm text-gray-700 capitalize">{field}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Field Prompts */}
                          <div className="border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Field Prompts</h3>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Name Prompt
                                </label>
                                <input
                                  type="text"
                                  value={zohoConfig.name_prompt_text}
                                  onChange={(e) => setZohoConfig({ ...zohoConfig, name_prompt_text: e.target.value })}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Phone Prompt
                                </label>
                                <input
                                  type="text"
                                  value={zohoConfig.phone_prompt_text}
                                  onChange={(e) => setZohoConfig({ ...zohoConfig, phone_prompt_text: e.target.value })}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Email Prompt
                                </label>
                                <input
                                  type="text"
                                  value={zohoConfig.email_prompt_text}
                                  onChange={(e) => setZohoConfig({ ...zohoConfig, email_prompt_text: e.target.value })}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Company Prompt
                                </label>
                                <input
                                  type="text"
                                  value={zohoConfig.company_prompt_text}
                                  onChange={(e) => setZohoConfig({ ...zohoConfig, company_prompt_text: e.target.value })}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Success Message
                                </label>
                                <textarea
                                  value={zohoConfig.success_message}
                                  onChange={(e) => setZohoConfig({ ...zohoConfig, success_message: e.target.value })}
                                  rows={2}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                              </div>
                            </div>
                          </div>

                        </div>
                      )}

                      {/* Save Button - Always visible regardless of enabled state */}
                      <div className="flex justify-end pt-4 border-t mt-6">
                        <button
                          onClick={handleUpdateZohoConfig}
                          disabled={updatingZoho}
                          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                          {updatingZoho ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Updating...
                            </>
                          ) : (
                            "Update Zoho Configuration"
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Authentication Configuration Section */}
              {/* Intent & Proposals Configuration Section */}
              {activeSection === "intent" && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    <MessageSquare className="h-6 w-6 text-orange-600 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-800">Intent & Proposals Configuration</h2>
                  </div>

                  {intentConfigLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
                      <span className="ml-2 text-gray-600">Loading intent configuration...</span>
                    </div>
                  ) : (
                    <>
                      {/* Enable Intent Detection Toggle */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <label className="text-lg font-semibold text-gray-800">Enable Intent-Based Proposals</label>
                            <p className="text-sm text-gray-500 mt-1">
                              Automatically detect when users ask for proposals and send them via WhatsApp
                            </p>
                          </div>
                          <button
                            onClick={() => setIntentConfig({ ...intentConfig, enabled: !intentConfig.enabled })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              intentConfig.enabled ? "bg-orange-600" : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                intentConfig.enabled ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {intentConfig.enabled && (
                        <div className="space-y-6 mb-6">
                          {/* Keywords Management */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Intent Keywords <span className="text-red-500">*</span>
                            </label>
                            <p className="text-xs text-gray-500 mb-3">
                              Add keywords that trigger proposal requests (e.g., "proposal", "quote", "pricing")
                            </p>
                            <div className="flex gap-2 mb-3">
                              <input
                                type="text"
                                value={newKeyword}
                                onChange={(e) => setNewKeyword(e.target.value)}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleAddKeyword();
                                  }
                                }}
                                placeholder="Enter keyword (e.g., proposal)"
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                              />
                              <button
                                onClick={handleAddKeyword}
                                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                            {intentConfig.keywords.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {intentConfig.keywords.map((keyword, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                                  >
                                    {keyword}
                                    <button
                                      onClick={() => handleRemoveKeyword(keyword)}
                                      className="ml-2 text-orange-600 hover:text-orange-800"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500 italic">No keywords added yet</p>
                            )}
                          </div>

                          {/* Proposal Campaign Configuration */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Proposal Campaign Name
                            </label>
                            <input
                              type="text"
                              value={intentConfig.proposal_campaign_name}
                              onChange={(e) => setIntentConfig({ ...intentConfig, proposal_campaign_name: e.target.value })}
                              placeholder="proposalsending"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                              Must match the campaign name in your WhatsApp provider dashboard
                            </p>
                          </div>

                          {/* Confirmation Prompt Text */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Confirmation Prompt Text
                            </label>
                            <textarea
                              value={intentConfig.confirmation_prompt_text}
                              onChange={(e) => setIntentConfig({ ...intentConfig, confirmation_prompt_text: e.target.value })}
                              placeholder="Would you like me to send the proposal to your WhatsApp number?"
                              rows={2}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                          </div>

                          {/* Success Message */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Success Message
                            </label>
                            <textarea
                              value={intentConfig.success_message}
                              onChange={(e) => setIntentConfig({ ...intentConfig, success_message: e.target.value })}
                              placeholder="✅ Proposal sent to your WhatsApp number!"
                              rows={2}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                          </div>

                          {/* Toast Message */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Toast Notification Message
                            </label>
                            <input
                              type="text"
                              value={intentConfig.toast_message}
                              onChange={(e) => setIntentConfig({ ...intentConfig, toast_message: e.target.value })}
                              placeholder="Proposal sent successfully! 📱"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                          </div>
                        </div>
                      )}

                      {/* Save Button - Always visible */}
                      <div className="flex justify-end pt-4 border-t">
                        <button
                          onClick={handleUpdateIntentConfig}
                          disabled={updatingIntent}
                          className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                          {updatingIntent ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Updating...
                            </>
                          ) : (
                            "Update Intent Configuration"
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Transcript Configuration Section */}
              {activeSection === "transcript" && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    <FileText className="h-6 w-6 text-blue-600 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-800">Conversation Transcript Configuration</h2>
                  </div>

                  {transcriptConfigLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                      <span className="ml-2 text-gray-600">Loading transcript configuration...</span>
                    </div>
                  ) : (
                    <>
                      {/* Enable Transcript Toggle */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <label className="text-lg font-semibold text-gray-800">Enable Conversation Transcript</label>
                            <p className="text-sm text-gray-500 mt-1">
                              Automatically send conversation transcripts as PDF via WhatsApp after inactivity
                            </p>
                          </div>
                          <button
                            onClick={() => setTranscriptConfig({ ...transcriptConfig, enabled: !transcriptConfig.enabled })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              transcriptConfig.enabled ? "bg-blue-600" : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                transcriptConfig.enabled ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {transcriptConfig.enabled && (
                        <div className="space-y-6 border-t pt-6">
                          {/* Template Name */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              WhatsApp Template Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={transcriptConfig.template_name}
                              onChange={(e) => setTranscriptConfig({ ...transcriptConfig, template_name: e.target.value })}
                              placeholder="chatsummarytemp"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                              Template name configured in your WhatsApp provider dashboard
                            </p>
                          </div>

                          {/* Campaign Name */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              WhatsApp Campaign Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={transcriptConfig.campaign_name}
                              onChange={(e) => setTranscriptConfig({ ...transcriptConfig, campaign_name: e.target.value })}
                              placeholder="chatsummarytempsumm"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                              Campaign name configured in your WhatsApp provider dashboard
                            </p>
                          </div>

                          {/* Company Name */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Company Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={transcriptConfig.company_name}
                              onChange={(e) => setTranscriptConfig({ ...transcriptConfig, company_name: e.target.value })}
                              placeholder="Troika Tech Services"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                              Company name to include in the transcript template
                            </p>
                          </div>

                          {/* Inactivity Timeout */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Inactivity Timeout (milliseconds) <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              value={transcriptConfig.inactivity_timeout_ms || ""}
                              onChange={(e) => setTranscriptConfig({ ...transcriptConfig, inactivity_timeout_ms: parseInt(e.target.value) || null })}
                              placeholder="30000"
                              min="1000"
                              step="1000"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                              Time in milliseconds before sending transcript (minimum: 1000ms = 1 second)
                            </p>
                          </div>

                          {/* PDF Filename */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              PDF Filename
                            </label>
                            <input
                              type="text"
                              value={transcriptConfig.pdf_filename}
                              onChange={(e) => setTranscriptConfig({ ...transcriptConfig, pdf_filename: e.target.value })}
                              placeholder="Chat-Summary.pdf"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                              Filename for the generated PDF transcript
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Save Button - Always visible */}
                      <div className="flex justify-end pt-4 border-t mt-6">
                        <button
                          onClick={handleUpdateTranscriptConfig}
                          disabled={updatingTranscript}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                          {updatingTranscript ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Updating...
                            </>
                          ) : (
                            "Update Transcript Configuration"
                          )}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeSection === "authentication" && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    <Shield className="h-6 w-6 text-indigo-600 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-800">Authentication Configuration</h2>
                  </div>

                  {/* Enable Authentication Toggle */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Enable Authentication in Chat
                        </label>
                        <p className="text-xs text-gray-500 mt-1">
                          Require WhatsApp OTP verification before users can continue chatting
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          setAuthConfig({
                            ...authConfig,
                            auth_enabled: !authConfig.auth_enabled,
                          })
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          authConfig.auth_enabled ? "bg-indigo-600" : "bg-gray-300"
                        } cursor-pointer`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            authConfig.auth_enabled ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {authConfig.auth_enabled && (
                    <>
                      {/* Trigger Message Count */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Trigger Authentication After
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={authConfig.auth_trigger_message_count}
                          onChange={(e) =>
                            setAuthConfig({
                              ...authConfig,
                              auth_trigger_message_count: parseInt(e.target.value) || 1,
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Number of user messages before authentication is requested
                        </p>
                      </div>

                      {/* Provider Selection */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          WhatsApp Provider <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={authConfig.auth_provider}
                          onChange={(e) =>
                            setAuthConfig({
                              ...authConfig,
                              auth_provider: e.target.value,
                              provider_config: {}, // Reset config when changing provider
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="aisensy">AISensy</option>
                          <option value="twilio">Twilio</option>
                          <option value="messagebird">MessageBird</option>
                          <option value="360dialog">360dialog</option>
                          <option value="gupshup">Gupshup</option>
                        </select>
                      </div>

                      {/* Provider-Specific Configuration */}
                      <div className="mb-6 border-t pt-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                          {authConfig.auth_provider.charAt(0).toUpperCase() + authConfig.auth_provider.slice(1)} Configuration
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {authConfig.auth_provider === "aisensy" && (
                            <AISensyConfigFields
                              config={authConfig}
                              setConfig={setAuthConfig}
                              showPassword={showAuthPassword}
                              setShowPassword={setShowAuthPassword}
                            />
                          )}
                          {authConfig.auth_provider === "twilio" && (
                            <TwilioConfigFields
                              config={authConfig}
                              setConfig={setAuthConfig}
                              showPassword={showAuthPassword}
                              setShowPassword={setShowAuthPassword}
                            />
                          )}
                          {authConfig.auth_provider === "messagebird" && (
                            <MessageBirdConfigFields
                              config={authConfig}
                              setConfig={setAuthConfig}
                              showPassword={showAuthPassword}
                              setShowPassword={setShowAuthPassword}
                            />
                          )}
                          {authConfig.auth_provider === "360dialog" && (
                            <Dialog360ConfigFields
                              config={authConfig}
                              setConfig={setAuthConfig}
                              showPassword={showAuthPassword}
                              setShowPassword={setShowAuthPassword}
                            />
                          )}
                          {authConfig.auth_provider === "gupshup" && (
                            <GupshupConfigFields
                              config={authConfig}
                              setConfig={setAuthConfig}
                              showPassword={showAuthPassword}
                              setShowPassword={setShowAuthPassword}
                            />
                          )}
                        </div>
                      </div>

                      {/* Custom Messages */}
                      <div className="mb-6 border-t pt-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Custom Messages (Optional)</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Phone Prompt Text
                            </label>
                            <textarea
                              value={authConfig.auth_phone_prompt_text}
                              onChange={(e) =>
                                setAuthConfig({
                                  ...authConfig,
                                  auth_phone_prompt_text: e.target.value,
                                })
                              }
                              placeholder="To continue chat, please type your whatsapp number."
                              rows={2}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              OTP Prompt Text
                            </label>
                            <textarea
                              value={authConfig.auth_otp_prompt_text}
                              onChange={(e) =>
                                setAuthConfig({
                                  ...authConfig,
                                  auth_otp_prompt_text: e.target.value,
                                })
                              }
                              placeholder="I've sent an OTP to your whatsapp number. Please enter the 6-digit OTP code."
                              rows={2}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Success Message
                            </label>
                            <textarea
                              value={authConfig.auth_success_text}
                              onChange={(e) =>
                                setAuthConfig({
                                  ...authConfig,
                                  auth_success_text: e.target.value,
                                })
                              }
                              placeholder="Great! You're verified. How can I help you?"
                              rows={2}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                        </div>
                      </div>

                    </>
                  )}

                  {/* Save Button - Always visible */}
                  <div className="flex justify-end mt-6 border-t pt-6">
                    <button
                      onClick={async () => {
                        if (!selectedChatbotId) {
                          toast.error("Please select a chatbot first");
                          return;
                        }
                        try {
                          setUpdatingAuth(true);
                          await updateAuthConfig(selectedChatbotId, authConfig);
                          toast.success("Authentication configuration updated successfully! ✅");
                        } catch (error) {
                          console.error("Error updating auth config:", error);
                          toast.error(error.response?.data?.message || "Failed to update authentication configuration");
                        } finally {
                          setUpdatingAuth(false);
                        }
                      }}
                      disabled={updatingAuth}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {updatingAuth ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Shield className="h-4 w-4" />
                          Update Authentication Settings
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Social Media Configuration Section */}
              {activeSection === "social" && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    <Share2 className="h-6 w-6 text-indigo-600 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-800">Social Media Configuration</h2>
                  </div>

                  {/* Enable Social Media Toggle */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Show Social Media in Sidebar
                      </label>
                      <button
                        onClick={() => setSocialEnabled(!socialEnabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          socialEnabled ? "bg-indigo-600" : "bg-gray-300"
                        } cursor-pointer`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            socialEnabled ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Social Media Links Management */}
                  <div className="mb-6 border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Social Media Links</h3>
                      <button
                        onClick={handleAddSocialLink}
                        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Link
                      </button>
                    </div>

                    {loadingSocialLinks ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                        <span className="ml-2 text-gray-600">Loading links...</span>
                      </div>
                    ) : socialLinks.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Share2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No social media links yet. Click "Add New Link" to create one.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {socialLinks.map((link) => (
                          <div
                            key={link._id}
                            className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold text-gray-800">
                                    {link.platform === 'facebook' ? 'Facebook' :
                                     link.platform === 'instagram' ? 'Instagram' :
                                     link.platform === 'youtube' ? 'YouTube' :
                                     link.platform === 'linkedin' ? 'LinkedIn' :
                                     link.platform === 'twitter' ? 'Twitter/X' :
                                     link.platform === 'whatsapp' ? 'WhatsApp' :
                                     link.platform === 'telegram' ? 'Telegram' :
                                     link.platform === 'pinterest' ? 'Pinterest' :
                                     link.platform === 'tiktok' ? 'TikTok' :
                                     link.platform === 'snapchat' ? 'Snapchat' :
                                     'Custom Link'}
                                  </span>
                                  {!link.is_active && (
                                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">Inactive</span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 break-all">{link.url}</p>
                                <p className="text-xs text-gray-500 mt-1">Order: {link.order}</p>
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                <button
                                  onClick={() => handleEditSocialLink(link)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="Edit link"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteSocialLink(link._id)}
                                  disabled={deletingSocialLink === link._id}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                  title="Delete link"
                                >
                                  {deletingSocialLink === link._id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Social Link Form Modal */}
                  {showSocialLinkForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-gray-800">
                              {editingSocialLink ? "Edit Social Media Link" : "Add New Social Media Link"}
                            </h3>
                            <button
                              onClick={() => {
                                setShowSocialLinkForm(false);
                                setEditingSocialLink(null);
                                setSocialLinkFormData({
                                  url: "",
                                  platform: "custom",
                                  is_active: true,
                                  order: 0,
                                });
                                setDetectedPlatform(null);
                              }}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Social Media URL *
                              </label>
                              <input
                                type="url"
                                value={socialLinkFormData.url}
                                onChange={(e) => handleSocialLinkUrlChange(e.target.value)}
                                placeholder="https://facebook.com/yourpage"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
                              />
                              {detectedPlatform && (
                                <p className="mt-2 text-sm text-indigo-600">
                                  ✓ Detected: <strong>{detectedPlatform}</strong>
                                </p>
                              )}
                              <p className="mt-1 text-xs text-gray-500">
                                Enter the full URL. Platform will be detected automatically, or select manually below.
                              </p>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Platform *
                              </label>
                              <select
                                value={socialLinkFormData.platform}
                                onChange={(e) =>
                                  setSocialLinkFormData({ ...socialLinkFormData, platform: e.target.value })
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 bg-white"
                              >
                                <option value="facebook">Facebook</option>
                                <option value="instagram">Instagram</option>
                                <option value="youtube">YouTube</option>
                                <option value="linkedin">LinkedIn</option>
                                <option value="twitter">Twitter/X</option>
                                <option value="whatsapp">WhatsApp</option>
                                <option value="telegram">Telegram</option>
                                <option value="indiamart">IndiaMART</option>
                                <option value="justdial">JustDial</option>
                                <option value="tradeindia">TradeIndia</option>
                                <option value="exportersindia">ExportersIndia</option>
                                <option value="custom">Custom Link</option>
                              </select>
                              <p className="mt-1 text-xs text-gray-500">
                                Select the platform. Auto-detection will update this field when you enter a URL.
                              </p>
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="socialLinkActive"
                                checked={socialLinkFormData.is_active}
                                onChange={(e) =>
                                  setSocialLinkFormData({ ...socialLinkFormData, is_active: e.target.checked })
                                }
                                className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                              />
                              <label htmlFor="socialLinkActive" className="text-sm text-gray-700">
                                Link is active (will be shown in sidebar)
                              </label>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Display Order
                              </label>
                              <input
                                type="number"
                                value={socialLinkFormData.order}
                                onChange={(e) =>
                                  setSocialLinkFormData({ ...socialLinkFormData, order: parseInt(e.target.value) || 0 })
                                }
                                min="0"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
                              />
                              <p className="mt-1 text-xs text-gray-500">
                                Lower numbers appear first in the sidebar
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-3 mt-6">
                            <button
                              onClick={handleSaveSocialLink}
                              disabled={savingSocialLink || !socialLinkFormData.url.trim()}
                              className="flex-1 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                              {savingSocialLink ? (
                                <>
                                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <Share2 className="h-5 w-5 mr-2" />
                                  {editingSocialLink ? "Update Link" : "Create Link"}
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setShowSocialLinkForm(false);
                                setEditingSocialLink(null);
                                setSocialLinkFormData({
                                  url: "",
                                  platform: "custom",
                                  is_active: true,
                                  order: 0,
                                });
                                setDetectedPlatform(null);
                              }}
                              className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={async () => {
                      if (!selectedChatbotId) {
                        toast.error("Please select a chatbot first");
                        return;
                      }
                      try {
                        setUpdatingSocial(true);
                        await updateChatbotSidebarSocial(selectedChatbotId, socialEnabled);
                        toast.success("Social Media configuration updated successfully! ✅");
                      } catch (error) {
                        console.error("Error updating Social Media config:", error);
                        toast.error(error.response?.data?.message || "Failed to update Social Media configuration");
                      } finally {
                        setUpdatingSocial(false);
                      }
                    }}
                    disabled={updatingSocial}
                    className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                  >
                    {updatingSocial ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Share2 className="h-5 w-5 mr-2" />
                        Update Social Media Settings
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Branding Configuration Section */}
              {activeSection === "branding" && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    <Sparkles className="h-6 w-6 text-amber-600 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-800">Branding Configuration</h2>
                  </div>

                  {/* Enable Branding Toggle */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Show Branding in Sidebar
                      </label>
                      <button
                        onClick={() => setBrandingEnabled(!brandingEnabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          brandingEnabled ? "bg-amber-600" : "bg-gray-300"
                        } cursor-pointer`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            brandingEnabled ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Branding Text */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Branding Text
                    </label>
                    <input
                      type="text"
                      value={brandingText}
                      onChange={(e) => setBrandingText(e.target.value)}
                      placeholder="Powered by"
                      maxLength={50}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-700"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      {brandingText.length}/50 characters
                    </p>
                  </div>

                  {/* Company Name */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={brandingCompany}
                      onChange={(e) => setBrandingCompany(e.target.value)}
                      placeholder="Troika Tech"
                      maxLength={50}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-700"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      {brandingCompany.length}/50 characters
                    </p>
                  </div>

                  {/* Logo URL */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={brandingLogoUrl}
                      onChange={(e) => setBrandingLogoUrl(e.target.value)}
                      placeholder="https://example.com/logo.png"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-700"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Enter the full URL to your logo image. Leave empty to hide logo.
                    </p>
                  </div>

                  {/* Logo Link */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo Click URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={brandingLogoLink}
                      onChange={(e) => setBrandingLogoLink(e.target.value)}
                      placeholder="https://troikatech.in"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-700"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      URL to open when logo is clicked. Leave empty if logo should not be clickable.
                    </p>
                  </div>

                  <button
                    onClick={async () => {
                      if (!selectedChatbotId) {
                        toast.error("Please select a chatbot first");
                        return;
                      }
                      try {
                        setUpdatingBranding(true);
                        await updateChatbotSidebarBranding(
                          selectedChatbotId,
                          brandingEnabled,
                          brandingText.trim() || "Powered by",
                          brandingCompany.trim() || "Troika Tech",
                          brandingLogoUrl.trim() || null,
                          brandingLogoLink.trim() || null
                        );
                        toast.success("Branding configuration updated successfully! ✅");
                      } catch (error) {
                        console.error("Error updating Branding config:", error);
                        toast.error(error.response?.data?.message || "Failed to update Branding configuration");
                      } finally {
                        setUpdatingBranding(false);
                      }
                    }}
                    disabled={updatingBranding || !brandingText.trim() || !brandingCompany.trim()}
                    className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                  >
                    {updatingBranding ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5 mr-2" />
                        Update Branding Settings
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Sidebar Header Configuration Section */}
              {activeSection === "header" && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    <Heading className="h-6 w-6 text-violet-600 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-800">Sidebar Header Configuration</h2>
                  </div>

                  {/* Enable Header Toggle */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Show Sidebar Header
                      </label>
                      <button
                        onClick={() => setHeaderEnabled(!headerEnabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          headerEnabled ? "bg-violet-600" : "bg-gray-300"
                        } cursor-pointer`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            headerEnabled ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Header Text */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Header Text
                    </label>
                    <input
                      type="text"
                      value={headerText}
                      onChange={(e) => setHeaderText(e.target.value)}
                      placeholder={selectedChatbot?.name || "Enter header text or leave empty to use chatbot name"}
                      maxLength={100}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-gray-700"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      {headerText.length}/100 characters. Leave empty to use chatbot name automatically.
                    </p>
                  </div>

                  {/* Logo URL */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Header Logo URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={headerLogoUrl}
                      onChange={(e) => setHeaderLogoUrl(e.target.value)}
                      placeholder="https://example.com/logo.png"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-gray-700"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Enter the full URL to your logo image. Leave empty to show text only.
                    </p>
                  </div>

                  {/* Logo Link */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo Click URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={headerLogoLink}
                      onChange={(e) => setHeaderLogoLink(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-gray-700"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      URL to open when logo is clicked. Leave empty if logo should not be clickable.
                    </p>
                  </div>

                  <button
                    onClick={async () => {
                      if (!selectedChatbotId) {
                        toast.error("Please select a chatbot first");
                        return;
                      }
                      try {
                        setUpdatingHeader(true);
                        await updateChatbotSidebarHeader(
                          selectedChatbotId,
                          headerEnabled,
                          headerText.trim() || null,
                          headerLogoUrl.trim() || null,
                          headerLogoLink.trim() || null
                        );
                        toast.success("Sidebar Header configuration updated successfully! ✅");
                      } catch (error) {
                        console.error("Error updating Header config:", error);
                        toast.error(error.response?.data?.message || "Failed to update Sidebar Header configuration");
                      } finally {
                        setUpdatingHeader(false);
                      }
                    }}
                    disabled={updatingHeader}
                    className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                  >
                    {updatingHeader ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Heading className="h-5 w-5 mr-2" />
                        Update Sidebar Header Settings
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Custom Navigation Configuration Section */}
              {activeSection === "custom-nav" && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    <Navigation className="h-6 w-6 text-teal-600 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-800">Custom Navigation Configuration</h2>
                  </div>

                  {/* Enable Custom Navigation Toggle */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Navigation className="h-5 w-5 text-teal-600 mr-2" />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">Show Custom Navigation in Sidebar</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Enable to display custom navigation items in the chatbot sidebar
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={async () => {
                          if (!selectedChatbotId) {
                            toast.error("Please select a chatbot first");
                            return;
                          }
                          try {
                            setUpdatingCustomNav(true);
                            await updateChatbotSidebarCustomNav(selectedChatbotId, !customNavEnabled);
                            setCustomNavEnabled(!customNavEnabled);
                            toast.success(`Custom Navigation ${!customNavEnabled ? "enabled" : "disabled"} successfully! ✅`);
                          } catch (error) {
                            console.error("Error updating custom navigation toggle:", error);
                            toast.error(error.response?.data?.message || "Failed to update custom navigation toggle");
                          } finally {
                            setUpdatingCustomNav(false);
                          }
                        }}
                        disabled={updatingCustomNav}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          customNavEnabled ? "bg-teal-600" : "bg-gray-300"
                        } ${updatingCustomNav ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            customNavEnabled ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Navigation Items List */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Navigation Items</h3>
                      <button
                        onClick={handleAddCustomNavItem}
                        className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Item
                      </button>
                    </div>

                    {loadingCustomNavItems ? (
                      <div className="text-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-teal-600" />
                        <p className="text-gray-500 mt-2">Loading navigation items...</p>
                      </div>
                    ) : customNavItems.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <Navigation className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">No navigation items yet. Click "Add New Item" to create one.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {customNavItems.map((item) => (
                          <div
                            key={item._id}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-mono text-gray-500">{item.icon_name}</span>
                                <span className="font-semibold text-gray-800">{item.display_text}</span>
                                {!item.is_active && (
                                  <span className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded">Inactive</span>
                                )}
                              </div>
                              <p className="text-sm text-gray-500 mt-1 truncate">{item.redirect_url}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEditCustomNavItem(item)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteCustomNavItem(item._id)}
                                disabled={deletingCustomNavItem === item._id}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                title="Delete"
                              >
                                {deletingCustomNavItem === item._id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Add/Edit Navigation Item Modal */}
                  {showCustomNavForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-xl font-semibold text-gray-800">
                            {editingCustomNavItem ? "Edit Navigation Item" : "Add Navigation Item"}
                          </h3>
                          <button
                            onClick={() => {
                              setShowCustomNavForm(false);
                              setEditingCustomNavItem(null);
                            }}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-6 w-6" />
                          </button>
                        </div>

                        <div className="space-y-4">
                          {/* Display Text */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Display Text in Sidebar *
                            </label>
                            <input
                              type="text"
                              value={customNavFormData.display_text}
                              onChange={(e) =>
                                setCustomNavFormData({ ...customNavFormData, display_text: e.target.value })
                              }
                              placeholder="e.g., Contact Us, About Us, Services"
                              maxLength={100}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-700"
                            />
                            <p className="mt-1 text-xs text-gray-500">{customNavFormData.display_text.length}/100 characters</p>
                          </div>

                          {/* Icon Name */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Icon (Font Awesome) *
                            </label>
                            <IconSelector
                              value={customNavFormData.icon_name}
                              onChange={(iconName) =>
                                setCustomNavFormData({ ...customNavFormData, icon_name: iconName })
                              }
                            />
                          </div>

                          {/* Redirect URL */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Redirect URL *
                            </label>
                            <input
                              type="text"
                              value={customNavFormData.redirect_url}
                              onChange={(e) =>
                                setCustomNavFormData({ ...customNavFormData, redirect_url: e.target.value })
                              }
                              placeholder="https://example.com or /about or tel:+1234567890 or mailto:email@example.com"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-700"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                              Enter full URL, relative path (/about), tel: link, or mailto: link
                            </p>
                          </div>

                          {/* Display Order */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Display Order
                            </label>
                            <input
                              type="number"
                              value={customNavFormData.order}
                              onChange={(e) =>
                                setCustomNavFormData({ ...customNavFormData, order: parseInt(e.target.value) || 0 })
                              }
                              placeholder="0"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-700"
                            />
                            <p className="mt-1 text-xs text-gray-500">Lower numbers appear first in sidebar</p>
                          </div>

                          {/* Active Toggle */}
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="customNavActive"
                              checked={customNavFormData.is_active}
                              onChange={(e) =>
                                setCustomNavFormData({ ...customNavFormData, is_active: e.target.checked })
                              }
                              className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                            />
                            <label htmlFor="customNavActive" className="ml-2 text-sm text-gray-700">
                              Item is active (will be shown in sidebar)
                            </label>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 mt-6">
                          <button
                            onClick={() => {
                              setShowCustomNavForm(false);
                              setEditingCustomNavItem(null);
                            }}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSaveCustomNavItem}
                            disabled={savingCustomNavItem}
                            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                          >
                            {savingCustomNavItem ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Saving...
                              </>
                            ) : (
                              "Save Navigation Item"
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}

              {/* Browser Tab Configuration Section */}
              {activeSection === "tab" && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    <Monitor className="h-6 w-6 text-indigo-600 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-800">Browser Tab Configuration</h2>
                  </div>

                  {/* Tab Title */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Browser Tab Title
                    </label>
                    <input
                      type="text"
                      value={tabTitle}
                      onChange={(e) => setTabTitle(e.target.value)}
                      placeholder={selectedChatbot?.name || "Enter browser tab title"}
                      maxLength={100}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      {tabTitle.length}/100 characters. This will appear in the browser tab. Leave empty to use chatbot name.
                    </p>
                  </div>

                  {/* Favicon URL */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Favicon URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={faviconUrl}
                      onChange={(e) => setFaviconUrl(e.target.value)}
                      placeholder="https://example.com/favicon.png"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Enter the full URL to your favicon image. This will appear in the browser tab. Leave empty to use default.
                    </p>
                  </div>

                  <button
                    onClick={async () => {
                      if (!selectedChatbotId) {
                        toast.error("Please select a chatbot first");
                        return;
                      }
                      try {
                        setUpdatingTab(true);
                        await updateChatbotUITabConfig(
                          selectedChatbotId,
                          tabTitle.trim() || null,
                          faviconUrl.trim() || null
                        );
                        toast.success("Browser Tab configuration updated successfully! ✅");
                      } catch (error) {
                        console.error("Error updating Tab config:", error);
                        toast.error(error.response?.data?.message || "Failed to update Browser Tab configuration");
                      } finally {
                        setUpdatingTab(false);
                      }
                    }}
                    disabled={updatingTab}
                    className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                  >
                    {updatingTab ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Monitor className="h-5 w-5 mr-2" />
                        Update Browser Tab Settings
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Input Placeholder Configuration Section */}
              {activeSection === "placeholders" && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    <Type className="h-6 w-6 text-emerald-600 mr-2" />
                    <h2 className="text-xl font-semibold text-gray-800">Input Placeholder Settings</h2>
      </div>

                  {/* Enable Rotating Placeholders Toggle */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <label className="text-lg font-semibold text-gray-800">Enable Rotating Placeholders</label>
                        <p className="text-sm text-gray-500 mt-1">
                          Show animated placeholder text that cycles through multiple options
                        </p>
                      </div>
                      <button
                        onClick={() => setInputPlaceholdersEnabled(!inputPlaceholdersEnabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          inputPlaceholdersEnabled ? "bg-emerald-600" : "bg-gray-300"
                        } cursor-pointer`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            inputPlaceholdersEnabled ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {inputPlaceholdersEnabled && (
                    <>
                      {/* Placeholder List */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                          <label className="block text-sm font-medium text-gray-700">
                            Input Placeholders (Minimum 3, Maximum 10)
                          </label>
                          <button
                            onClick={() => {
                              if (inputPlaceholders.length < 10) {
                                setInputPlaceholders([...inputPlaceholders, ""]);
                              } else {
                                toast.warning("Maximum 10 placeholders allowed");
                              }
                            }}
                            disabled={inputPlaceholders.length >= 10}
                            className="flex items-center px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Placeholder
                          </button>
                        </div>

                        <div className="space-y-3">
                          {inputPlaceholders.map((placeholder, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={placeholder}
                                onChange={(e) => {
                                  const newPlaceholders = [...inputPlaceholders];
                                  newPlaceholders[index] = e.target.value;
                                  setInputPlaceholders(newPlaceholders);
                                }}
                                placeholder={`Placeholder ${index + 1}...`}
                                maxLength={100}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-700"
                              />
                              <span className="text-xs text-gray-500 w-16 text-right">
                                {placeholder.length}/100
                              </span>
                              <button
                                onClick={() => {
                                  if (inputPlaceholders.length > 3) {
                                    const newPlaceholders = inputPlaceholders.filter((_, i) => i !== index);
                                    setInputPlaceholders(newPlaceholders);
                                  } else {
                                    toast.warning("Minimum 3 placeholders required");
                                  }
                                }}
                                disabled={inputPlaceholders.length <= 3}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Remove placeholder"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Animation Speed */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Animation Speed
                        </label>
                        <select
                          value={inputPlaceholderSpeed}
                          onChange={(e) => setInputPlaceholderSpeed(parseFloat(e.target.value))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-700 bg-white"
                        >
                          <option value={1.5}>Fast (1.5s)</option>
                          <option value={2.5}>Medium (2.5s)</option>
                          <option value={3.5}>Slow (3.5s)</option>
                        </select>
                        <p className="mt-1 text-xs text-gray-500">
                          Time between placeholder changes
                        </p>
                      </div>

                      {/* Animation Type */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Animation Type
                        </label>
                        <div className="space-y-3">
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="placeholderAnimation"
                              value="fade"
                              checked={inputPlaceholderAnimation === "fade"}
                              onChange={(e) => setInputPlaceholderAnimation(e.target.value)}
                              className="mr-3 h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="text-gray-700">Fade (smooth transition)</span>
                          </label>
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="placeholderAnimation"
                              value="typewriter"
                              checked={inputPlaceholderAnimation === "typewriter"}
                              onChange={(e) => setInputPlaceholderAnimation(e.target.value)}
                              className="mr-3 h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="text-gray-700">Typewriter (character by character)</span>
                          </label>
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name="placeholderAnimation"
                              value="slide"
                              checked={inputPlaceholderAnimation === "slide"}
                              onChange={(e) => setInputPlaceholderAnimation(e.target.value)}
                              className="mr-3 h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className="text-gray-700">Slide (text slides in/out)</span>
                          </label>
                        </div>
                      </div>
                    </>
                  )}

                  <button
                    onClick={async () => {
                      if (!selectedChatbotId) {
                        toast.error("Please select a chatbot first");
                        return;
                      }
                      if (inputPlaceholdersEnabled) {
                        // Validate placeholders
                        const validPlaceholders = inputPlaceholders.filter(p => p.trim().length > 0);
                        if (validPlaceholders.length < 3) {
                          toast.error("Please provide at least 3 placeholders");
                          return;
                        }
                        if (validPlaceholders.length > 10) {
                          toast.error("Maximum 10 placeholders allowed");
                          return;
                        }
                        // Check for empty placeholders
                        if (inputPlaceholders.some(p => p.trim().length === 0)) {
                          toast.error("Please fill in all placeholder fields");
                          return;
                        }
                      }
                      try {
                        setUpdatingPlaceholders(true);
                        await updateChatbotUIInputPlaceholders(
                          selectedChatbotId,
                          inputPlaceholdersEnabled,
                          inputPlaceholders.filter(p => p.trim().length > 0),
                          inputPlaceholderSpeed,
                          inputPlaceholderAnimation
                        );
                        toast.success("Placeholder settings updated successfully! ✅");
                      } catch (error) {
                        console.error("Error updating placeholder config:", error);
                        toast.error(error.response?.data?.message || "Failed to update placeholder settings");
                      } finally {
                        setUpdatingPlaceholders(false);
                      }
                    }}
                    disabled={updatingPlaceholders}
                    className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                  >
                    {updatingPlaceholders ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Type className="h-5 w-5 mr-2" />
                        Update Placeholder Settings
                      </>
                    )}
                  </button>
                </div>
              )}

      </div>
    );
  }

  // Default table view
  // Filter table rows based on search query
  const filteredRows = tableRows.filter((row) => {
    if (!search.trim()) return true;
    const searchLower = search.toLowerCase();
    return (
      (row.companyName || "").toLowerCase().includes(searchLower) ||
      (row.userName || "").toLowerCase().includes(searchLower) ||
      (row.email || "").toLowerCase().includes(searchLower) ||
      (row.phoneNo || "").toLowerCase().includes(searchLower) ||
      (row.managedByName || "").toLowerCase().includes(searchLower) ||
      (row.chatbotName || "").toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#1e3a8a] mb-2">Manage Chatbot UI</h1>
        <p className="text-gray-600">Manage and configure chatbot UI settings</p>
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <div className="relative w-full max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by company name, username, email, phone, managed by, or chatbot name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] shadow-sm"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </div>
        {search && (
          <p className="mt-2 text-sm text-gray-600">
            Showing {filteredRows.length} of {tableRows.length} companies
          </p>
        )}
      </div>

      {loadingCompanies ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading companies...</span>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-700">
              <thead className="bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] text-white uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">#</th>
                  <th className="px-4 py-3 text-left font-semibold">Company Name</th>
                  <th className="px-4 py-3 text-left font-semibold">Username</th>
                  <th className="px-4 py-3 text-left font-semibold">Email ID</th>
                  <th className="px-4 py-3 text-left font-semibold">Password</th>
                  <th className="px-4 py-3 text-left font-semibold">Phone No</th>
                  <th className="px-4 py-3 text-left font-semibold">Managed By</th>
                  <th className="px-4 py-3 text-left font-semibold">Chatbot Name</th>
                  <th className="px-4 py-3 text-center font-semibold">Status</th>
                  <th className="px-4 py-3 text-center font-semibold">Action UI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRows.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="px-4 py-8 text-center text-gray-500">
                      {search ? "No companies found matching your search" : "No companies found"}
                    </td>
                  </tr>
                ) : (
                  filteredRows.map((row, idx) => (
                    <tr
                      key={`${row.companyId}-${row.chatbotId || 'no-chatbot'}`}
                      className={`hover:bg-gray-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-teal-50'}`}
                    >
                      <td className="px-4 py-2">{idx + 1}</td>
                      <td className="px-4 py-2 font-medium">{row.companyName}</td>
                      <td className="px-4 py-2">
                        {editingUsername[row.companyId] ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={usernameValues[row.companyId] || ""}
                              onChange={(e) => setUsernameValues(prev => ({ ...prev, [row.companyId]: e.target.value }))}
                              className="px-2 py-1 border border-gray-300 rounded text-sm w-32"
                              autoFocus
                            />
                            <button
                              onClick={() => handleUsernameSave(row.companyId)}
                              disabled={updatingUsername[row.companyId]}
                              className="text-green-600 hover:text-green-700 disabled:opacity-50"
                            >
                              ✓
                            </button>
                            <button
                              onClick={() => handleUsernameCancel(row.companyId)}
                              className="text-red-600 hover:text-red-700"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span>{row.userName || "—"}</span>
                            <button
                              onClick={() => handleUsernameEdit(row.companyId)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Edit2 size={14} />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-2">{row.email}</td>
                      <td className="px-4 py-2">
                        {editingPassword[row.companyId] ? (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <input
                                type={showPasswordInput[row.companyId] ? "text" : "password"}
                                value={passwordValues[row.companyId] || ""}
                                onChange={(e) => setPasswordValues(prev => ({ ...prev, [row.companyId]: e.target.value }))}
                                placeholder="New password"
                                className="px-2 py-1 border border-gray-300 rounded text-sm w-32"
                                autoFocus
                              />
                              <button
                                type="button"
                                onClick={() => setShowPasswordInput(prev => ({ ...prev, [row.companyId]: !prev[row.companyId] }))}
                                className="text-gray-600 hover:text-gray-800 p-1"
                                title={showPasswordInput[row.companyId] ? "Hide password" : "Show password"}
                              >
                                {showPasswordInput[row.companyId] ? (
                                  <EyeOff size={14} />
                                ) : (
                                  <Eye size={14} />
                                )}
                              </button>
                            </div>
                            <button
                              onClick={() => handlePasswordSave(row.companyId)}
                              disabled={updatingPassword[row.companyId]}
                              className="text-green-600 hover:text-green-700 disabled:opacity-50"
                            >
                              ✓
                            </button>
                            <button
                              onClick={() => handlePasswordCancel(row.companyId)}
                              className="text-red-600 hover:text-red-700"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-0.5">
                            <span className="text-sm">
                              {showPassword[row.companyId] && decryptedPasswords[row.companyId] 
                                ? decryptedPasswords[row.companyId] 
                                : "••••••••"}
                            </span>
                            {(() => {
                              const canDecrypt = canDecryptPassword[row.companyId];
                              console.log(`[Password UI] Rendering for company ${row.companyId}: canDecrypt=${canDecrypt}`);
                              return canDecrypt ? (
                                <button
                                  type="button"
                                  onClick={() => handleShowPassword(row.companyId)}
                                  disabled={loadingPassword[row.companyId]}
                                  className="text-gray-600 hover:text-gray-800 p-0 disabled:opacity-50 ml-0.5"
                                  title={showPassword[row.companyId] ? "Hide password" : "Show password"}
                                >
                                  {loadingPassword[row.companyId] ? (
                                    <Loader2 size={14} className="animate-spin" />
                                  ) : showPassword[row.companyId] ? (
                                    <EyeOff size={14} />
                                  ) : (
                                    <Eye size={14} />
                                  )}
                                </button>
                              ) : null;
                            })()}
                            <button
                              onClick={() => handlePasswordEdit(row.companyId)}
                              className="text-blue-600 hover:text-blue-700 p-0 ml-0.5"
                              title="Edit password"
                            >
                              <Edit2 size={14} />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        {editingPhone[row.companyId] ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="tel"
                              value={phoneValues[row.companyId] || ""}
                              onChange={(e) => setPhoneValues(prev => ({ ...prev, [row.companyId]: e.target.value }))}
                              placeholder="+919876543210"
                              className="px-2 py-1 border border-gray-300 rounded text-sm w-32"
                              autoFocus
                            />
                            <button
                              onClick={() => handlePhoneSave(row.companyId)}
                              disabled={updatingPhone[row.companyId]}
                              className="text-green-600 hover:text-green-700 disabled:opacity-50"
                            >
                              ✓
                            </button>
                            <button
                              onClick={() => handlePhoneCancel(row.companyId)}
                              className="text-red-600 hover:text-red-700"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span>{row.phoneNo || "—"}</span>
                            <button
                              onClick={() => handlePhoneEdit(row.companyId)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Edit2 size={14} />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        {editingManagedBy[row.companyId] ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={managedByValues[row.companyId] || ""}
                              onChange={(e) => setManagedByValues(prev => ({ ...prev, [row.companyId]: e.target.value }))}
                              className="px-2 py-1 border border-gray-300 rounded text-sm w-32"
                              autoFocus
                            />
                            <button
                              onClick={() => handleManagedByNameSave(row.companyId)}
                              disabled={updatingManagedBy[row.companyId]}
                              className="text-green-600 hover:text-green-700 disabled:opacity-50"
                            >
                              ✓
                            </button>
                            <button
                              onClick={() => handleManagedByNameCancel(row.companyId)}
                              className="text-red-600 hover:text-red-700"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span>{row.managedByName || "—"}</span>
                            <button
                              onClick={() => handleManagedByNameEdit(row.companyId)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Edit2 size={14} />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-2">{row.chatbotName}</td>
                      <td className="px-4 py-3 text-center">
                        {row.chatbotId ? (
                          <button
                            onClick={() => handleStatusToggle(row.chatbotId, row.status)}
                            disabled={updatingStatus[row.chatbotId]}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              row.status === "active" ? "bg-green-600" : "bg-gray-300"
                            } ${updatingStatus[row.chatbotId] ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                row.status === "active" ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {row.chatbotId ? (
                          <button
                            onClick={() => handleNavigateToUIConfig(row.chatbotId)}
                            className="px-4 py-2 bg-[#1e3a8a] text-white font-medium rounded-lg hover:bg-[#1e40af] transition-colors shadow-md"
                          >
                            Manage UI
                          </button>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageChatbotUIPage;


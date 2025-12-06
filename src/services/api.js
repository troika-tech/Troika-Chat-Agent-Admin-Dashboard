import axios from "axios";

const api = axios.create({
 // baseURL: "https://chat-apiv3.0804.in/api",
   baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// ✅ Automatically attach token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Handle 401 and 403 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check multiple possible locations for error message
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error ||
                        error.message || 
                        "";
    
    const isDeactivationError = errorMessage.toLowerCase().includes("deactivated") || 
                                errorMessage.toLowerCase().includes("inactive") || 
                                errorMessage.toLowerCase().includes("all chatbots are currently inactive") ||
                                errorMessage.toLowerCase().includes("currently inactive");
    
    console.log("🔍 [API INTERCEPTOR] Error check:", {
      status: error.response?.status,
      message: errorMessage,
      isDeactivationError
    });
    
    if (error.response?.status === 401) {
      // Check if it's a deactivation error (backend returns 401 for deactivated accounts)
      if (isDeactivationError) {
        console.error("🔴 [API INTERCEPTOR] 401 Unauthorized - Account deactivated");
        console.error("🔴 [API INTERCEPTOR] Error message:", errorMessage);
        console.error("🔴 [API INTERCEPTOR] Full error response:", error.response?.data);
        console.error("🔴 [API INTERCEPTOR] Current pathname:", window.location.pathname);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        // Only redirect if we're not already on the deactivated page or login page
        // If on login page, let LoginPage handle the redirect
        if (window.location.pathname !== "/account-deactivated" && window.location.pathname !== "/") {
          console.log("🔴 [API INTERCEPTOR] Redirecting to /account-deactivated");
          window.location.href = "/account-deactivated";
        } else {
          console.log("🔴 [API INTERCEPTOR] On login page, letting LoginPage handle redirect");
        }
      } else {
        console.error("401 Unauthorized - Token expired or invalid");
        localStorage.removeItem("token");
        // Only redirect if we're not already on the login page
        if (window.location.pathname !== "/" && window.location.pathname !== "/login") {
          window.location.href = "/";
        }
      }
    } else if (error.response?.status === 403) {
      // Check if it's an account deactivation error
      if (isDeactivationError) {
        console.error("403 Forbidden - Account deactivated");
        localStorage.removeItem("token");
        // Only redirect if we're not already on the deactivated page
        if (window.location.pathname !== "/account-deactivated") {
          window.location.href = "/account-deactivated";
        }
      }
    }
    return Promise.reject(error);
  }
);

export const fetchClientConfig = (chatbotId) => {
  return api.get(`/chatbot/${chatbotId}/config`);
};

export const updateClientConfig = (chatbotId, config) => {
  return api.put(`/chatbot/${chatbotId}/config`, config);
};

// Customization API endpoints
export const fetchCustomization = (chatbotId) => {
  return api.get(`/customizations/${chatbotId}`);
};

export const updateCustomization = (chatbotId, customization) => {
  return api.put(`/customizations/${chatbotId}`, customization);
};

export const resetCustomization = (chatbotId) => {
  return api.post(`/customizations/${chatbotId}/reset`);
};

// User Dashboard API endpoints
export const userLogin = (credentials) => {
  return api.post('/user/login', credentials);
};

export const fetchUserCompany = () => {
  return api.get('/user/company');
};

export const fetchUserUsage = () => {
  return api.get('/user/usage');
};

export const fetchChatbotSubscription = (chatbotId) => {
  return api.get(`/chatbot/${chatbotId}/subscription`);
};

export const fetchUserMessages = (params = {}) => {
  const queryParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== '') {
      queryParams.append(key, params[key]);
    }
  });
  return api.get(`/user/messages?${queryParams.toString()}`);
};

export const fetchUniqueEmailsAndPhones = () => {
  return api.get('/user/messages/unique-emails-and-phones');
};

export const fetchUserSessions = (params = {}) => {
  console.log("🔍 fetchUserSessions API function called");
  const queryParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== '') {
      queryParams.append(key, params[key]);
    }
  });
  const queryString = queryParams.toString();
  return api.get(`/user/sessions${queryString ? `?${queryString}` : ''}`);
};

export const fetchUserAnalytics = (params = {}) => {
  const queryParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== '') {
      queryParams.append(key, params[key]);
    }
  });
  const queryString = queryParams.toString();
  return api.get(`/user/analytics${queryString ? `?${queryString}` : ''}`);
};

export const fetchUserLeads = (params = {}) => {
  const queryParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== '') {
      queryParams.append(key, params[key]);
    }
  });
  const queryString = queryParams.toString();
  return api.get(`/user/leads${queryString ? `?${queryString}` : ''}`);
};

export const fetchCollectedLeads = (params = {}) => {
  const queryParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== '') {
      queryParams.append(key, params[key]);
    }
  });
  const queryString = queryParams.toString();
  return api.get(`/user/collected-leads${queryString ? `?${queryString}` : ''}`);
};

export const fetchTopUsers = (params = {}) => {
  const queryParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== '') {
      queryParams.append(key, params[key]);
    }
  });
  const queryString = queryParams.toString();
  return api.get(`/user/top-users${queryString ? `?${queryString}` : ''}`);
};

export const fetchUserChatHistory = (params = {}) => {
  const queryParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== '') {
      queryParams.append(key, params[key]);
    }
  });
  const queryString = queryParams.toString();
  return api.get(`/user/chat-history${queryString ? `?${queryString}` : ''}`);
};

// Admin API endpoints
export const adminLogin = (credentials) => {
  return api.post('/admin/login', credentials);
};

export const fetchAdminStats = () => {
  return api.get('/admin/stats');
};

export const fetchAllAdmins = () => {
  return api.get('/admin/all');
};

export const createAdmin = (adminData) => {
  return api.post('/admin/create', adminData);
};

export const deleteAdmin = (adminId) => {
  return api.delete(`/admin/delete/${adminId}`);
};

export const toggleAdminRole = (adminId) => {
  return api.put(`/admin/toggle-role/${adminId}`);
};

// Company Management API endpoints
export const fetchCompanies = (params = {}) => {
  const queryParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== '') {
      queryParams.append(key, params[key]);
    }
  });
  return api.get(`/companies?${queryParams.toString()}`);
};

export const fetchCompaniesWithChatbots = () => {
  return api.get('/company/all');
};

export const updateCompanyManagedByName = (companyId, managedByName) => {
  return api.put(`/company/update/${companyId}`, { managed_by_name: managedByName });
};

export const createCompany = (companyData) => {
  return api.post('/companies', companyData);
};

export const updateCompany = (companyId, companyData) => {
  return api.put(`/companies/${companyId}`, companyData);
};

export const deleteCompany = (companyId) => {
  return api.delete(`/companies/${companyId}`);
};

// Company Credit Management
export const assignCompanyCredits = (companyId, credits, reason) => {
  return api.post(`/company/${companyId}/credits`, { credits, reason });
};

export const getCompanyCreditBalance = (companyId) => {
  return api.get(`/company/${companyId}/credits`);
};

export const getCompanyCreditHistory = (companyId) => {
  return api.get(`/company/${companyId}/credits/history`);
};

export const addCompanyCredits = (companyId, credits, reason) => {
  return api.post(`/company/${companyId}/credits/add`, { credits, reason });
};

export const removeCompanyCredits = (companyId, credits, reason) => {
  return api.post(`/company/${companyId}/credits/remove`, { credits, reason });
};

// Chatbot Management API endpoints
export const fetchChatbots = (params = {}) => {
  const queryParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== '') {
      queryParams.append(key, params[key]);
    }
  });
  // Backend route is /api/chatbot/all (singular)
  const queryString = queryParams.toString();
  return api.get(`/chatbot/all${queryString ? `?${queryString}` : ''}`);
};

export const createChatbot = (chatbotData) => {
  // Backend route is /api/chatbot/create (singular)
  return api.post('/chatbot/create', chatbotData);
};

export const updateChatbot = (chatbotId, chatbotData) => {
  return api.put(`/chatbots/${chatbotId}`, chatbotData);
};

export const updateChatbotStatus = (chatbotId, status) => {
  return api.put(`/chatbot/edit/${chatbotId}`, { status });
};

export const deleteChatbot = (chatbotId) => {
  return api.delete(`/chatbots/${chatbotId}`);
};

export const fetchChatbotDetails = (chatbotId) => {
  return api.get(`/chatbots/${chatbotId}`);
};

// Authentication Configuration API endpoints
export const getAuthConfig = (chatbotId) => {
  return api.get(`/chatbot/${chatbotId}/auth-config`);
};

export const getAuthConfigAdmin = (chatbotId) => {
  return api.get(`/chatbot/${chatbotId}/auth-config/admin`);
};

export const updateAuthConfig = (chatbotId, config) => {
  return api.put(`/chatbot/${chatbotId}/auth-config`, config);
};

// Message History API endpoints
export const fetchMessageHistory = (params = {}) => {
  const queryParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== '') {
      queryParams.append(key, params[key]);
    }
  });
  return api.get(`/messages?${queryParams.toString()}`);
};

export const fetchMessageHistoryBySession = (sessionId) => {
  return api.get(`/messages/session/${sessionId}`);
};

// Download/Export API endpoints
export const downloadUserData = (params = {}) => {
  const queryParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== '') {
      queryParams.append(key, params[key]);
    }
  });
  return api.get(`/user/download-data?${queryParams.toString()}`, {
    responseType: 'blob'
  });
};

export const downloadUserReport = (params = {}) => {
  const queryParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== '') {
      queryParams.append(key, params[key]);
    }
  });
  return api.get(`/user/download-report?${queryParams.toString()}`, {
    responseType: 'blob'
  });
};

// Chatbot UI Configuration API endpoints
export const getChatbotUIConfig = (chatbotId) => {
  return api.get(`/chatbot/${chatbotId}/ui-config/admin`);
};

export const updateChatbotUIAvatar = (chatbotId, avatarUrl) => {
  return api.put(`/chatbot/${chatbotId}/ui-config/image`, { avatar_url: avatarUrl });
};

export const updateChatbotUIWelcomeText = (chatbotId, welcomeText) => {
  return api.put(`/chatbot/${chatbotId}/ui-config/text`, { welcome_text: welcomeText });
};

export const updateChatbotUIAssistantHeader = (chatbotId, assistantDisplayName, assistantLogoUrl) => {
  return api.put(`/chatbot/${chatbotId}/ui-config/assistant`, {
    assistant_display_name: assistantDisplayName || null,
    assistant_logo_url: assistantLogoUrl || null,
    assistant_subtitle: null,
  });
};

export const updateChatbotUITabConfig = (chatbotId, tabTitle, faviconUrl) => {
  return api.put(`/chatbot/${chatbotId}/ui-config/tab`, {
    tab_title: tabTitle || null,
    favicon_url: faviconUrl || null,
  });
};

export const updateChatbotUIInputPlaceholders = (chatbotId, placeholdersEnabled, placeholders, placeholderSpeed, placeholderAnimation) => {
  return api.put(`/chatbot/${chatbotId}/ui-config/placeholders`, {
    placeholders_enabled: placeholdersEnabled,
    placeholders: placeholders,
    placeholder_speed: placeholderSpeed,
    placeholder_animation: placeholderAnimation,
  });
};

// WhatsApp Proposal Template API endpoints
export const getWhatsAppProposalTemplates = (chatbotId) => {
  return api.get(`/chatbot/${chatbotId}/whatsapp-proposal-templates/admin`);
};

export const createWhatsAppProposalTemplate = (chatbotId, templateData) => {
  return api.post(`/chatbot/${chatbotId}/whatsapp-proposal-templates`, templateData);
};

export const updateWhatsAppProposalTemplate = (chatbotId, templateId, templateData) => {
  return api.put(`/chatbot/${chatbotId}/whatsapp-proposal-templates/${templateId}`, templateData);
};

export const deleteWhatsAppProposalTemplate = (chatbotId, templateId) => {
  return api.delete(`/chatbot/${chatbotId}/whatsapp-proposal-templates/${templateId}`);
};

export const updateWhatsAppProposalSettings = (chatbotId, enabled, displayText, defaultApiKey, defaultOrgSlug, defaultSenderName, defaultCountryCode) => {
  return api.put(`/chatbot/${chatbotId}/sidebar-config/whatsapp-proposal`, {
    enabled,
    display_text: displayText,
    default_api_key: defaultApiKey,
    default_org_slug: defaultOrgSlug,
    default_sender_name: defaultSenderName,
    default_country_code: defaultCountryCode,
  });
};

// Sidebar Configuration API endpoints
export const getChatbotSidebarConfig = (chatbotId) => {
  return api.get(`/chatbot/${chatbotId}/sidebar-config/admin`);
};

export const updateChatbotSidebarEnabled = (chatbotId, enabled) => {
  return api.put(`/chatbot/${chatbotId}/sidebar-config/enabled`, { enabled });
};

export const updateChatbotSidebarWhatsApp = (chatbotId, enabled, mode, url, text) => {
  return api.put(`/chatbot/${chatbotId}/sidebar-config/whatsapp`, {
    enabled,
    mode,
    url,
    text,
  });
};

export const updateChatbotSidebarCall = (chatbotId, enabled, mode, number, text) => {
  return api.put(`/chatbot/${chatbotId}/sidebar-config/call`, {
    enabled,
    mode,
    number,
    text,
  });
};

export const updateChatbotSidebarCalendly = (chatbotId, enabled, mode, url, text) => {
  return api.put(`/chatbot/${chatbotId}/sidebar-config/calendly`, {
    enabled,
    mode,
    url,
    text,
  });
};

export const updateChatbotSidebarEmail = (chatbotId, enabled, mode, text) => {
  return api.put(`/chatbot/${chatbotId}/sidebar-config/email`, {
    enabled,
    mode,
    text,
  });
};

// Embed Script API endpoint
export const getEmbedScript = (chatbotId) => {
  return api.get(`/chatbot/${chatbotId}/embed-script`);
};

// Intent Config API endpoints
export const getIntentConfig = (chatbotId) => {
  return api.get(`/intent/${chatbotId}`);
};

export const getIntentConfigAdmin = (chatbotId) => {
  return api.get(`/intent/${chatbotId}/admin`);
};

export const updateIntentConfig = (chatbotId, config) => {
  return api.put(`/intent/${chatbotId}`, config);
};

export const sendProposal = (chatbotId, phone, serviceName) => {
  return api.post(`/intent/send-proposal`, {
    chatbotId,
    phone,
    serviceName,
  });
};

// Zoho CRM Integration API endpoints
export const getZohoConfigAdmin = (chatbotId) => {
  return api.get(`/zoho/${chatbotId}/admin`);
};

export const updateZohoConfig = (chatbotId, config) => {
  return api.put(`/zoho/${chatbotId}`, config);
};

export const testZohoConnection = (chatbotId) => {
  return api.post(`/zoho/${chatbotId}/test-connection`);
};

export const getZohoAuthorizationUrl = (chatbotId, region, clientId) => {
  const params = {};
  if (region) {
    params.region = region;
  }
  if (clientId && clientId.trim()) {
    params.clientId = clientId.trim();
  }
  console.log('🔍 [Zoho Auth] Request params:', { chatbotId, region, clientId: clientId ? '***' + clientId.slice(-10) : 'none', params });
  return api.get(`/zoho/${chatbotId}/authorization-url`, {
    params
  });
};

export const exchangeZohoCodeForToken = (chatbotId, code, region) => {
  return api.post(`/zoho/${chatbotId}/exchange-code`, {
    code,
    region
  });
};

// Transcript Config API endpoints
export const getTranscriptConfig = (chatbotId) => {
  return api.get(`/transcript/${chatbotId}`);
};

export const getTranscriptConfigAdmin = (chatbotId) => {
  return api.get(`/transcript/${chatbotId}/admin`);
};

export const updateTranscriptConfig = (chatbotId, config) => {
  return api.put(`/transcript/${chatbotId}`, config);
};

// Email Template API endpoints
export const getEmailTemplates = (chatbotId) => {
  return api.get(`/chatbot/${chatbotId}/email-templates`);
};

export const createEmailTemplate = (chatbotId, templateData) => {
  return api.post(`/chatbot/${chatbotId}/email-templates`, templateData);
};

export const updateEmailTemplate = (chatbotId, templateId, templateData) => {
  return api.put(`/chatbot/${chatbotId}/email-templates/${templateId}`, templateData);
};

export const deleteEmailTemplate = (chatbotId, templateId) => {
  return api.delete(`/chatbot/${chatbotId}/email-templates/${templateId}`);
};

// Social Media API endpoints
export const getSocialMediaLinks = (chatbotId) => {
  return api.get(`/chatbot/${chatbotId}/social-media-links`);
};

export const createSocialMediaLink = (chatbotId, linkData) => {
  return api.post(`/chatbot/${chatbotId}/social-media-links`, linkData);
};

export const updateSocialMediaLink = (chatbotId, linkId, linkData) => {
  return api.put(`/chatbot/${chatbotId}/social-media-links/${linkId}`, linkData);
};

export const deleteSocialMediaLink = (chatbotId, linkId) => {
  return api.delete(`/chatbot/${chatbotId}/social-media-links/${linkId}`);
};

export const updateChatbotSidebarSocial = (chatbotId, enabled) => {
  return api.put(`/chatbot/${chatbotId}/sidebar-config/social`, { enabled });
};

export const updateChatbotSidebarBranding = (chatbotId, enabled, brandingText, brandingCompany, brandingLogoUrl, brandingLogoLink) => {
  return api.put(`/chatbot/${chatbotId}/sidebar-config/branding`, {
    enabled,
    branding_text: brandingText,
    branding_company: brandingCompany,
    branding_logo_url: brandingLogoUrl || null,
    branding_logo_link: brandingLogoLink || null,
  });
};

export const updateChatbotSidebarHeader = (chatbotId, enabled, headerText, headerLogoUrl, headerLogoLink) => {
  return api.put(`/chatbot/${chatbotId}/sidebar-config/header`, {
    enabled,
    header_text: headerText || null,
    header_logo_url: headerLogoUrl || null,
    header_logo_link: headerLogoLink || null,
  });
};

// Knowledge base / context API endpoints
export const getKnowledgeBaseFiles = (chatbotId) => {
  return api.get(`/context/files/${chatbotId}`);
};

export const deleteKnowledgeBaseFile = (fileId) => {
  return api.delete(`/context/files/${fileId}`);
};

// Custom Navigation API endpoints
export const getCustomNavigationItems = (chatbotId) => {
  return api.get(`/chatbot/${chatbotId}/custom-navigation-items`);
};

export const createCustomNavigationItem = (chatbotId, itemData) => {
  return api.post(`/chatbot/${chatbotId}/custom-navigation-items`, itemData);
};

export const updateCustomNavigationItem = (chatbotId, itemId, itemData) => {
  return api.put(`/chatbot/${chatbotId}/custom-navigation-items/${itemId}`, itemData);
};

export const deleteCustomNavigationItem = (chatbotId, itemId) => {
  return api.delete(`/chatbot/${chatbotId}/custom-navigation-items/${itemId}`);
};

export const updateChatbotSidebarCustomNav = (chatbotId, enabled) => {
  return api.put(`/chatbot/${chatbotId}/sidebar-config/custom-nav`, { enabled });
};

export default api;

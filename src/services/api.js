import axios from "axios";

const api = axios.create({
  baseURL: "https://api.0804.in/api",
  // baseURL: "http://localhost:5000/api",
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

// ✅ Handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("401 Unauthorized - Token expired or invalid");
      localStorage.removeItem("token");
      // Only redirect if we're not already on the login page
      if (window.location.pathname !== "/" && window.location.pathname !== "/login") {
        window.location.href = "/";
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

export const fetchUserSessions = () => {
  console.log("🔍 fetchUserSessions API function called");
  return api.get('/user/sessions');
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

export const createCompany = (companyData) => {
  return api.post('/companies', companyData);
};

export const updateCompany = (companyId, companyData) => {
  return api.put(`/companies/${companyId}`, companyData);
};

export const deleteCompany = (companyId) => {
  return api.delete(`/companies/${companyId}`);
};

// Chatbot Management API endpoints
export const fetchChatbots = (params = {}) => {
  const queryParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== '') {
      queryParams.append(key, params[key]);
    }
  });
  return api.get(`/chatbots?${queryParams.toString()}`);
};

export const createChatbot = (chatbotData) => {
  return api.post('/chatbots', chatbotData);
};

export const updateChatbot = (chatbotId, chatbotData) => {
  return api.put(`/chatbots/${chatbotId}`, chatbotData);
};

export const deleteChatbot = (chatbotId) => {
  return api.delete(`/chatbots/${chatbotId}`);
};

export const fetchChatbotDetails = (chatbotId) => {
  return api.get(`/chatbots/${chatbotId}`);
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

export default api;

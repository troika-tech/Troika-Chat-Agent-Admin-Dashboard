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

// Leads API endpoints
export const fetchLeadsAnalytics = (companyId, days = 30) => {
  return api.get(`/hybrid-leads/analytics?companyId=${companyId}&days=${days}`);
};

export const fetchLeadsMetrics = () => {
  return api.get('/hybrid-leads/metrics');
};

export const fetchLeadsHealth = () => {
  return api.get('/hybrid-leads/health');
};

export const processLeadsBatches = () => {
  return api.post('/hybrid-leads/process-batches');
};

export const fetchLeads = (params = {}) => {
  const queryParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== '') {
      queryParams.append(key, params[key]);
    }
  });
  return api.get(`/hybrid-leads?${queryParams.toString()}`);
};

export const exportLeads = (params = {}) => {
  const queryParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== '') {
      queryParams.append(key, params[key]);
    }
  });
  return api.get(`/hybrid-leads/export?${queryParams.toString()}`, {
    responseType: 'blob', // Important for file downloads
  });
};

export default api;

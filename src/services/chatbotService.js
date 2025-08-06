import api from "./api"; // <-- your axios instance file

// ✅ Fetch all chatbots
export const fetchAllChatbots = async () => {
  const { data } = await api.get("/chatbot/all");
  return data; // { chatbots: [...] }
};

// ✅ Fetch chatbot config
export const fetchChatbotConfig = async (chatbotId) => {
  const { data } = await api.get(`/chatbot/${chatbotId}/config`);
  return data; // { config: {...} }
};

// ✅ Update chatbot config
export const updateChatbotConfig = async (chatbotId, configData) => {
  const { data } = await api.put(`/chatbot/${chatbotId}/config`, configData);
  return data; // { message, config }
};

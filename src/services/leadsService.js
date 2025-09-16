import {
  fetchLeadsAnalytics,
  fetchLeadsMetrics,
  fetchLeadsHealth,
  processLeadsBatches,
  fetchLeads,
  exportLeads,
} from "./api";

export const leadsService = {
  // Get analytics data for leads
  getAnalytics: async (companyId, days = 30) => {
    try {
      const response = await fetchLeadsAnalytics(companyId, days);
      return response.data;
    } catch (error) {
      console.error("Error fetching leads analytics:", error);
      throw error;
    }
  },

  // Get performance metrics
  getMetrics: async () => {
    try {
      const response = await fetchLeadsMetrics();
      return response.data;
    } catch (error) {
      console.error("Error fetching leads metrics:", error);
      throw error;
    }
  },

  // Get system health status
  getHealth: async () => {
    try {
      const response = await fetchLeadsHealth();
      return response.data;
    } catch (error) {
      console.error("Error fetching leads health:", error);
      throw error;
    }
  },

  // Process pending batches
  processBatches: async () => {
    try {
      const response = await processLeadsBatches();
      return response.data;
    } catch (error) {
      console.error("Error processing batches:", error);
      throw error;
    }
  },

  // Get leads with filters
  getLeads: async (params = {}) => {
    try {
      const response = await fetchLeads(params);
      return response.data;
    } catch (error) {
      console.error("Error fetching leads:", error);
      throw error;
    }
  },

  // Export leads to CSV
  exportLeads: async (params = {}) => {
    try {
      const response = await exportLeads(params);
      return response;
    } catch (error) {
      console.error("Error exporting leads:", error);
      throw error;
    }
  },

  // Get all data at once for dashboard
  getAllData: async (companyId, days = 30, leadParams = {}) => {
    try {
      const [analytics, metrics, health, leads] = await Promise.all([
        fetchLeadsAnalytics(companyId, days),
        fetchLeadsMetrics(),
        fetchLeadsHealth(),
        fetchLeads(leadParams),
      ]);

      return {
        analytics: analytics.data,
        metrics: metrics.data,
        health: health.data,
        leads: leads.data,
      };
    } catch (error) {
      console.error("Error fetching all leads data:", error);
      throw error;
    }
  },
};

export default leadsService;

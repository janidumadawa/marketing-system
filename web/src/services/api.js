// web/src/services/api.js
const API_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;

// Helper function to get auth headers
const getAuthHeaders = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user || !user.token) {
      console.error('No authentication token found');
      throw new Error('No authentication token');
    }

    return {
      'Authorization': `Bearer ${user.token}`,
      'Content-Type': 'application/json'
    };
  } catch (error) {
    console.error('Error getting auth headers:', error);
    throw error;
  }
};

// Generic API call function
// Improve the apiCall function to get better error messages
const apiCall = async (endpoint, options = {}) => {
  try {
    const headers = getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers,
      ...options
    });

    if (response.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/auth';
      throw new Error('Authentication failed');
    }

    if (!response.ok) {
      // Try to get detailed error message from response
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error(`API call error for ${endpoint}:`, error);
    throw error;
  }
};

// Auth API calls
export const authAPI = {
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  },

  register: async (name, email, password) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    });
    return response.json();
  }
};

// Old Clients API calls
export const oldClientsAPI = {
  getOldClients: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return apiCall(`/api/old-clients?${queryParams}`);
  },

  addOldClient: async (clientData) => {
    return apiCall('/api/old-clients', {
      method: 'POST',
      body: JSON.stringify(clientData)
    });
  },

  updateOldClient: async (id, clientData) => {
    return apiCall(`/api/old-clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(clientData)
    });
  },

  deleteOldClient: async (id) => {
    return apiCall(`/api/old-clients/${id}`, {
      method: 'DELETE'
    });
  },

  calculateTotal: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return apiCall(`/api/old-clients/total?${queryParams}`);
  },

  getTopClients: async () => {
    return apiCall('/api/old-clients/top-clients');
  },

  getSalesByYear: async () => {
    return apiCall('/api/old-clients/sales-by-year');
  },

  countAllClients: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return apiCall(`/api/old-clients/count?${queryParams}`);
  },

  countUniqueClients: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return apiCall(`/api/old-clients/count-unique?${queryParams}`);
  }
};

// Old Targets API calls
export const oldTargetsAPI = {
  getOldTarget: async (year, month) => {
    return apiCall(`/api/old-targets?year=${year}&month=${month}`);
  },

  getAllOldTargets: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    return apiCall(`/api/old-targets/all?${queryParams}`);
  },

  // Create new target
  createOldTarget: async (targetData) => {
    return apiCall('/api/old-targets', {
      method: 'POST',
      body: JSON.stringify(targetData)
    });
  },

  // Update existing target
  updateOldTarget: async (targetData) => {
    return apiCall('/api/old-targets', {
      method: 'PUT',
      body: JSON.stringify(targetData)
    });
  },

  // Keep upsert for backward compatibility
  upsertOldTarget: async (targetData) => {
    return apiCall('/api/old-targets/upsert', {
      method: 'POST',
      body: JSON.stringify(targetData)
    });
  },

  deleteOldTarget: async (year, month) => {
    return apiCall(`/api/old-targets?year=${year}&month=${month}`, {
      method: 'DELETE'
    });
  },

  getTargetsByYear: async () => {
    return apiCall('/api/old-targets/targets-by-year');
  },

  getTargetsByMonth: async (year) => {
    return apiCall(`/api/old-targets/targets-by-month?year=${year}`);
  },

  getAvailableYears: async () => {
    return apiCall('/api/old-targets/available-years');
  }
};
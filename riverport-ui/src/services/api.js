import axios from 'axios';

// Set up Axios instance with the API base URL
const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  },
});

// This would normally handle authentication
// For demo purposes, we'll use a static token
const getAuthHeader = () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbjEyMyIsInVzZXJuYW1lIjoidGVzdGFkbWluIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzQyMTk3MjYwLCJleHAiOjE3NzM3NTQ4NjB9.5sfO42QlBzFK504Y1T_5Q_C1mBanQKPcbVNITCmfxQo'; // In a real app, this would come from localStorage or auth context
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

// Routes API calls
export const getRoutes = async () => {
  try {
    const response = await api.get('/routes', getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error fetching routes:', error);
    throw error;
  }
};

export const getRoute = async (routeId) => {
  try {
    const response = await api.get(`/routes/${routeId}`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error(`Error fetching route ${routeId}:`, error);
    throw error;
  }
};

export const createRoute = async (routeData) => {
  try {
    const response = await api.post('/routes', routeData, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error creating route:', error);
    throw error;
  }
};

export const updateRoute = async (routeId, routeData) => {
  try {
    const response = await api.put(`/routes/${routeId}`, routeData, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error(`Error updating route ${routeId}:`, error);
    throw error;
  }
};

export const deleteRoute = async (routeId) => {
  try {
    await api.delete(`/routes/${routeId}`, getAuthHeader());
    return true;
  } catch (error) {
    console.error(`Error deleting route ${routeId}:`, error);
    throw error;
  }
};

// Schedules API calls
export const getSchedules = async () => {
  try {
    const response = await api.get('/schedules', getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error fetching schedules:', error);
    throw error;
  }
};

export const getSchedule = async (scheduleId) => {
  try {
    const response = await api.get(`/schedules/${scheduleId}`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error(`Error fetching schedule ${scheduleId}:`, error);
    throw error;
  }
};

export const createSchedule = async (scheduleData) => {
  try {
    const response = await api.post('/schedules', scheduleData, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error creating schedule:', error);
    throw error;
  }
};

export const updateSchedule = async (scheduleId, scheduleData) => {
  try {
    const response = await api.put(`/schedules/${scheduleId}`, scheduleData, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error(`Error updating schedule ${scheduleId}:`, error);
    throw error;
  }
};

export const deleteSchedule = async (scheduleId) => {
  try {
    await api.delete(`/schedules/${scheduleId}`, getAuthHeader());
    return true;
  } catch (error) {
    console.error(`Error deleting schedule ${scheduleId}:`, error);
    throw error;
  }
};

export const updateScheduleStatus = async (scheduleId, statusData) => {
  try {
    const response = await api.patch(`/schedules/${scheduleId}/status`, statusData, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error(`Error updating schedule status ${scheduleId}:`, error);
    throw error;
  }
}; 

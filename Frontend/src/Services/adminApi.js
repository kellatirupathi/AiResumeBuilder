import axios from 'axios';
import { VITE_APP_URL } from '@/config/config';

const adminAxios = axios.create({
  baseURL: `${VITE_APP_URL.replace(/\/$/, '')}/api/admin/`,
  withCredentials: true,
});

// Create a separate instance for NIAT ID routes under the new base URL
const niatAxios = axios.create({
  baseURL: `${VITE_APP_URL.replace(/\/$/, '')}/api/niat-ids/`,
  withCredentials: true,
});

export const loginAdmin = async (credentials) => {
  try {
    const response = await adminAxios.post('/login', credentials);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Admin login failed. Please check your credentials.');
  }
};

export const logoutAdmin = async () => {
    try {
        const response = await adminAxios.post('/logout');
        return response.data;
    } catch(error) {
        throw new Error(error.response?.data?.message || 'Admin logout failed.');
    }
}

export const checkAdminSession = async () => {
    try {
        const response = await adminAxios.get('/session');
        return response.data;
    } catch(error) {
        throw new Error(error.response?.data?.message || 'Admin session invalid.');
    }
}

export const getAllUsers = async () => {
  try {
    const response = await adminAxios.get('/users');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch users.');
  }
};

export const getAllResumes = async () => {
  try {
    const response = await adminAxios.get('/resumes');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch resumes.');
  }
};

// --- NEW FUNCTIONS FOR NIAT ID MANAGEMENT ---
export const getNiatIds = async () => {
  try {
    const response = await niatAxios.get('/');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch NIAT IDs.');
  }
};

export const addSingleNiatId = async (niatId) => {
  try {
    const response = await niatAxios.post('/add', { niatId });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to add NIAT ID.');
  }
};

export const addBulkNiatIds = async (ids) => {
  try {
    const response = await niatAxios.post('/add-bulk', { ids });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to add NIAT IDs.');
  }
};

export const deleteNiatId = async (id) => {
  try {
    const response = await niatAxios.delete(`/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete NIAT ID.');
  }
};

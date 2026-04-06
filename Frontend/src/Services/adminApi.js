import axios from 'axios';
import { getApiUrl } from '@/config/config';

const adminAxios = axios.create({
  baseURL: getApiUrl("admin/"),
  withCredentials: true,
});

const niatAxios = axios.create({
  baseURL: getApiUrl("niat-ids"),
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

export const getAdminInviteDetails = async (token) => {
  try {
    const response = await adminAxios.get("/invite", { params: { token } });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to validate admin invite.");
  }
};

export const setAdminPassword = async (payload) => {
  try {
    const response = await adminAxios.post("/set-password", payload);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to set admin password.");
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

export const getAdminAccounts = async () => {
  try {
    const response = await adminAxios.get("/accounts");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch admin accounts.");
  }
};

export const createAdminAccount = async (payload) => {
  try {
    const response = await adminAxios.post("/accounts", payload);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create admin account.");
  }
};

export const updateAdminAccount = async (adminId, payload) => {
  try {
    const response = await adminAxios.put(`/accounts/${adminId}`, payload);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update admin account.");
  }
};

export const deleteAdminAccount = async (adminId) => {
  try {
    const response = await adminAxios.delete(`/accounts/${adminId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete admin account.");
  }
};

export const getAllUsers = async () => {
  try {
    const response = await adminAxios.get('/users');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch users.');
  }
};

export const createAdminUser = async (payload) => {
  try {
    const response = await adminAxios.post("/users", payload);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create user.");
  }
};

export const updateAdminUser = async (userId, payload) => {
  try {
    const response = await adminAxios.put(`/users/${userId}`, payload);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update user.");
  }
};

export const deleteAdminUser = async (userId) => {
  try {
    const response = await adminAxios.delete(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete user.");
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

export const createAdminResume = async (payload) => {
  try {
    const response = await adminAxios.post("/resumes", payload);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create resume.");
  }
};

export const updateAdminResume = async (resumeId, payload) => {
  try {
    const response = await adminAxios.put(`/resumes/${resumeId}`, payload);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update resume.");
  }
};

export const deleteAdminResume = async (resumeId) => {
  try {
    const response = await adminAxios.delete(`/resumes/${resumeId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete resume.");
  }
};

export const processPendingResumeLinks = async () => {
  try {
    const response = await adminAxios.post('/resumes/process-pending-links');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to process pending resume links.');
  }
};

export const getDashboardStats = async (days = 30) => {
  try {
    const response = await adminAxios.get('/stats', { params: { days } });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch dashboard stats.');
  }
};

export const getExternalInvites = async () => {
  try {
    const response = await adminAxios.get("/external-invites");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch external invites.");
  }
};

export const getExternalInviteById = async (inviteId) => {
  try {
    const response = await adminAxios.get(`/external-invites/${inviteId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch external invite details.");
  }
};

export const createExternalInvite = async (payload) => {
  try {
    const response = await adminAxios.post("/external-invites", payload);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create external invite.");
  }
};

export const updateExternalInvite = async (inviteId, payload) => {
  try {
    const response = await adminAxios.put(`/external-invites/${inviteId}`, payload);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update external invite.");
  }
};

export const deleteExternalInvite = async (inviteId) => {
  try {
    const response = await adminAxios.delete(`/external-invites/${inviteId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete external invite.");
  }
};

export const getExternalUsers = async () => {
  try {
    const response = await adminAxios.get("/external-users");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch external users.");
  }
};

export const getUsersPaginated = async ({
  page = 1,
  limit = 20,
  search = "",
  niatIdVerified = "",
  reminderEnabled = "",
  downloadLinkEnabled = "",
  createdFrom = "",
  createdTo = "",
  resumeCountMin = "",
  resumeCountMax = "",
} = {}) => {
  try {
    const response = await adminAxios.get("/users/paginated", {
      params: {
        page,
        limit,
        search,
        niatIdVerified,
        reminderEnabled,
        downloadLinkEnabled,
        createdFrom,
        createdTo,
        resumeCountMin,
        resumeCountMax,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch users.');
  }
};

export const getUserById = async (id) => {
  try {
    const response = await adminAxios.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user.');
  }
};

export const getResumesPaginated = async ({ page = 1, limit = 20, search = '' } = {}) => {
  try {
    const response = await adminAxios.get('/resumes/paginated', { params: { page, limit, search } });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch resumes.');
  }
};

export const getResumesByUser = async (userId) => {
  try {
    const response = await adminAxios.get(`/resumes/by-user/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user resumes.');
  }
};

// --- NOTIFICATION FUNCTIONS ---
export const getNotifications = async ({ page = 1, limit = 20, type = '', status = '', search = '' } = {}) => {
  try {
    const response = await adminAxios.get('/notifications', { params: { page, limit, type, status, search } });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch notifications.');
  }
};

export const resendNotification = async (id) => {
  try {
    const response = await adminAxios.post(`/notifications/${id}/resend`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to resend notification.');
  }
};

export const sendReminderNotification = async (userId) => {
  try {
    const response = await adminAxios.post(`/notifications/reminders/${userId}/send`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to send reminder notification.');
  }
};

export const cancelReminderNotification = async (userId) => {
  try {
    const response = await adminAxios.patch(`/notifications/reminders/${userId}/cancel`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to cancel reminder notification.');
  }
};

export const cancelNotification = async (id) => {
  try {
    const response = await adminAxios.patch(`/notifications/${id}/cancel`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to cancel notification.');
  }
};

// --- NEW FUNCTIONS FOR NIAT ID MANAGEMENT ---
export const getNiatIds = async () => {
  try {
    const response = await niatAxios.get('');
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

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  checkAdminSession,
  getAdminAccounts,
  getAllUsers,
  getDashboardStats,
  getExternalInviteById,
  getExternalInvites,
  getExternalUsers,
  getNotifications,
  getNiatIds,
  getCoverLettersPaginated,
  getResumesByUser,
  getResumesPaginated,
  getUserById,
  getUsersPaginated,
} from "@/Services/adminApi";
import { queryKeys } from "@/lib/queryKeys";

const ADMIN_STALE_TIME = 60 * 1000;
const ADMIN_LIST_STALE_TIME = 30 * 1000;

const normalizePaginationParams = (params = {}) => ({
  page: params.page ?? 1,
  limit: params.limit ?? 20,
  search: params.search ?? "",
  ...params,
});

export function useAdminSessionQuery(options = {}) {
  return useQuery({
    queryKey: queryKeys.admin.session,
    queryFn: async () => {
      const response = await checkAdminSession();
      return response?.data?.admin || null;
    },
    staleTime: ADMIN_STALE_TIME,
    retry: false,
    ...options,
  });
}

export function useAdminDashboardStatsQuery(days, options = {}) {
  return useQuery({
    queryKey: queryKeys.admin.dashboard(days),
    queryFn: async () => {
      const response = await getDashboardStats(days);
      return response?.data || {};
    },
    staleTime: ADMIN_LIST_STALE_TIME,
    ...options,
  });
}

export function useAdminAccountsQuery(options = {}) {
  return useQuery({
    queryKey: queryKeys.admin.accounts,
    queryFn: async () => {
      const response = await getAdminAccounts();
      return response?.data || [];
    },
    staleTime: ADMIN_LIST_STALE_TIME,
    ...options,
  });
}

export function useAdminUsersLiteQuery(options = {}) {
  return useQuery({
    queryKey: queryKeys.admin.usersLite,
    queryFn: async () => {
      const response = await getAllUsers();
      return response?.data || [];
    },
    staleTime: ADMIN_LIST_STALE_TIME,
    ...options,
  });
}

export function useAdminUsersQuery(params = {}, options = {}) {
  const normalizedParams = normalizePaginationParams(params);

  return useQuery({
    queryKey: queryKeys.admin.users(normalizedParams),
    queryFn: async () => {
      const response = await getUsersPaginated(normalizedParams);
      return response?.data || { users: [], pagination: { page: 1, totalPages: 1, total: 0 } };
    },
    staleTime: ADMIN_LIST_STALE_TIME,
    placeholderData: keepPreviousData,
    ...options,
  });
}

export function useAdminUserDetailQuery(userId, options = {}) {
  return useQuery({
    queryKey: queryKeys.admin.userDetail(userId),
    queryFn: async () => {
      const response = await getUserById(userId);
      return response?.data || null;
    },
    enabled: Boolean(userId),
    staleTime: ADMIN_LIST_STALE_TIME,
    ...options,
  });
}

export function useAdminResumesQuery(params = {}, options = {}) {
  const normalizedParams = normalizePaginationParams(params);

  return useQuery({
    queryKey: queryKeys.admin.resumes(normalizedParams),
    queryFn: async () => {
      const response = await getResumesPaginated(normalizedParams);
      return response?.data || { resumes: [], pagination: { page: 1, totalPages: 1, total: 0 } };
    },
    staleTime: ADMIN_LIST_STALE_TIME,
    placeholderData: keepPreviousData,
    ...options,
  });
}

export function useAdminCoverLettersQuery(params = {}, options = {}) {
  const normalizedParams = normalizePaginationParams(params);

  return useQuery({
    queryKey: queryKeys.admin.coverLetters(normalizedParams),
    queryFn: async () => {
      const response = await getCoverLettersPaginated(normalizedParams);
      return response?.data || { coverLetters: [], pagination: { page: 1, totalPages: 1, total: 0 } };
    },
    staleTime: ADMIN_LIST_STALE_TIME,
    placeholderData: keepPreviousData,
    ...options,
  });
}

export function useAdminUserResumesQuery(userId, options = {}) {
  return useQuery({
    queryKey: queryKeys.admin.resumesByUser(userId),
    queryFn: async () => {
      const response = await getResumesByUser(userId);
      return response?.data || null;
    },
    enabled: Boolean(userId),
    staleTime: ADMIN_LIST_STALE_TIME,
    ...options,
  });
}

export function useAdminInvitesQuery(options = {}) {
  return useQuery({
    queryKey: queryKeys.admin.invites,
    queryFn: async () => {
      const response = await getExternalInvites();
      return response?.data || [];
    },
    staleTime: ADMIN_LIST_STALE_TIME,
    ...options,
  });
}

export function useAdminInviteDetailQuery(inviteId, options = {}) {
  return useQuery({
    queryKey: queryKeys.admin.inviteDetail(inviteId),
    queryFn: async () => {
      const response = await getExternalInviteById(inviteId);
      return response?.data || null;
    },
    enabled: Boolean(inviteId),
    staleTime: ADMIN_LIST_STALE_TIME,
    ...options,
  });
}

export function useAdminExternalUsersQuery(options = {}) {
  return useQuery({
    queryKey: queryKeys.admin.externalUsers,
    queryFn: async () => {
      const response = await getExternalUsers();
      return response?.data || [];
    },
    staleTime: ADMIN_LIST_STALE_TIME,
    ...options,
  });
}

export function useAdminNotificationsQuery(params = {}, options = {}) {
  const normalizedParams = normalizePaginationParams(params);

  return useQuery({
    queryKey: queryKeys.admin.notifications(normalizedParams),
    queryFn: async () => {
      const response = await getNotifications(normalizedParams);
      return response?.data || {
        reminderControls: [],
        notifications: [],
        total: 0,
        totalPages: 1,
      };
    },
    staleTime: ADMIN_LIST_STALE_TIME,
    placeholderData: keepPreviousData,
    ...options,
  });
}

export function useAdminStudentIdsQuery(options = {}) {
  return useQuery({
    queryKey: queryKeys.admin.studentIds,
    queryFn: async () => {
      const response = await getNiatIds();
      return response?.data || [];
    },
    staleTime: ADMIN_LIST_STALE_TIME,
    ...options,
  });
}

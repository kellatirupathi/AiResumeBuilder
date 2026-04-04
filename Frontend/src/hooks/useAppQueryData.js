import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getNotificationPreferences,
  getProfile,
  getSessionUser,
} from "@/Services/login";
import { getAllResumeData, getResumeData } from "@/Services/resumeAPI";
import { queryKeys } from "@/lib/queryKeys";
import {
  normalizeProfileData,
  normalizeResumeData,
  normalizeResumeList,
  resolveApiData,
} from "@/lib/queryCacheUtils";

const SESSION_STALE_TIME = 60 * 1000;
const LIST_STALE_TIME = 30 * 1000;
const DETAIL_STALE_TIME = 30 * 1000;
const PROFILE_STALE_TIME = 60 * 1000;
const NOTIFICATION_STALE_TIME = 60 * 1000;

export function useSessionUserQuery(options = {}) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: queryKeys.auth.session,
    queryFn: async () => {
      const payload = await getSessionUser();
      const user = payload?.data ?? null;
      return user ? normalizeProfileData(user) : null;
    },
    initialData: () =>
      queryClient.getQueryData(queryKeys.auth.session) ??
      queryClient.getQueryData(queryKeys.auth.profile) ??
      undefined,
    staleTime: SESSION_STALE_TIME,
    retry: false,
    ...options,
  });
}

export function useResumeListQuery(options = {}) {
  return useQuery({
    queryKey: queryKeys.resumes.list,
    queryFn: async () => {
      const payload = await getAllResumeData();
      return normalizeResumeList(resolveApiData(payload) || []);
    },
    staleTime: LIST_STALE_TIME,
    ...options,
  });
}

export function useResumeQuery(resumeId, options = {}) {
  const queryClient = useQueryClient();
  const { initialData: providedInitialData, ...restOptions } = options;

  return useQuery({
    queryKey: queryKeys.resumes.detail(resumeId),
    queryFn: async () => {
      const payload = await getResumeData(resumeId);
      return normalizeResumeData(resolveApiData(payload) || {});
    },
    enabled: Boolean(resumeId),
    initialData: () => {
      if (providedInitialData) {
        return normalizeResumeData(providedInitialData);
      }

      const cachedDetail = queryClient.getQueryData(queryKeys.resumes.detail(resumeId));
      if (cachedDetail) {
        return normalizeResumeData(cachedDetail);
      }

      const cachedList = queryClient.getQueryData(queryKeys.resumes.list) || [];
      const matchedResume = cachedList.find((resume) => resume?._id === resumeId);
      return matchedResume ? normalizeResumeData(matchedResume) : undefined;
    },
    staleTime: DETAIL_STALE_TIME,
    ...restOptions,
  });
}

export function prefetchResumeQuery(queryClient, resumeId) {
  if (!resumeId) {
    return Promise.resolve();
  }

  return queryClient.prefetchQuery({
    queryKey: queryKeys.resumes.detail(resumeId),
    queryFn: async () => {
      const payload = await getResumeData(resumeId);
      return normalizeResumeData(resolveApiData(payload) || {});
    },
    staleTime: DETAIL_STALE_TIME,
  });
}

export function useProfileQuery(options = {}) {
  const queryClient = useQueryClient();
  const { initialData: providedInitialData, ...restOptions } = options;

  return useQuery({
    queryKey: queryKeys.auth.profile,
    queryFn: async () => {
      const payload = await getProfile();
      return normalizeProfileData(resolveApiData(payload) || {});
    },
    // Do NOT fall back to auth.session here — session data is minimal (no firstName,
    // lastName, jobTitle, etc.) and would cause ProfilePage to show empty fields.
    // auth.profile is now only set with full profile data (see setUserCaches).
    initialData: () => {
      if (providedInitialData !== undefined) {
        return providedInitialData ? normalizeProfileData(providedInitialData) : undefined;
      }

      return queryClient.getQueryData(queryKeys.auth.profile) ?? undefined;
    },
    staleTime: PROFILE_STALE_TIME,
    ...restOptions,
  });
}

export function useNotificationPreferencesQuery(options = {}) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: queryKeys.auth.notifications,
    queryFn: async () => {
      const payload = await getNotificationPreferences();
      return resolveApiData(payload) || {};
    },
    initialData: () =>
      queryClient.getQueryData(queryKeys.auth.notifications) ?? undefined,
    staleTime: NOTIFICATION_STALE_TIME,
    ...options,
  });
}

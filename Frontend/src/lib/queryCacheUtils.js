import { queryClient } from "./queryClient";
import { queryKeys } from "./queryKeys";

export const resolveApiData = (payload) => payload?.data ?? payload ?? null;

export const normalizeResumeData = (resume = {}) => ({
  ...resume,
  template: resume?.template || "modern",
});

export const normalizeResumeList = (resumes = []) =>
  Array.isArray(resumes) ? resumes.map((resume) => normalizeResumeData(resume)) : [];

export const normalizeProfileData = (profile = {}) => ({
  ...profile,
  experience: profile?.experience || [],
  projects: profile?.projects || [],
  education: profile?.education || [],
  skills: profile?.skills || [],
  certifications: profile?.certifications || [],
  additionalSections: profile?.additionalSections || [],
});

export const upsertResumeInCaches = (resume) => {
  if (!resume?._id) {
    return;
  }

  const normalizedResume = normalizeResumeData(resume);

  queryClient.setQueryData(queryKeys.resumes.detail(normalizedResume._id), normalizedResume);
  queryClient.setQueryData(queryKeys.resumes.list, (previous = []) => {
    const list = Array.isArray(previous) ? previous : [];
    const existingIndex = list.findIndex((item) => item?._id === normalizedResume._id);

    if (existingIndex === -1) {
      return [normalizedResume, ...list];
    }

    const next = [...list];
    next[existingIndex] = {
      ...next[existingIndex],
      ...normalizedResume,
    };
    return next;
  });
};

export const removeResumeFromCaches = (resumeId) => {
  if (!resumeId) {
    return;
  }

  queryClient.removeQueries({ queryKey: queryKeys.resumes.detail(resumeId) });
  queryClient.setQueryData(queryKeys.resumes.list, (previous = []) =>
    (Array.isArray(previous) ? previous : []).filter((resume) => resume?._id !== resumeId)
  );
};

export const setResumeListCache = (resumes) => {
  const normalizedResumes = normalizeResumeList(resumes);
  queryClient.setQueryData(queryKeys.resumes.list, normalizedResumes);
  normalizedResumes.forEach((resume) => {
    queryClient.setQueryData(queryKeys.resumes.detail(resume._id), resume);
  });
};

export const setUserCaches = (user) => {
  if (!user) {
    queryClient.setQueryData(queryKeys.auth.session, null);
    queryClient.setQueryData(queryKeys.auth.profile, null);
    return;
  }

  const normalizedProfile = normalizeProfileData(user);
  queryClient.setQueryData(queryKeys.auth.session, normalizedProfile);

  // Only update auth.profile with full profile data (from the profile/update endpoint).
  // Login/register returns minimal data { id, email, fullName, ... } — no '_id' key.
  // A full MongoDB user document always includes '_id'.
  // Polluting auth.profile with minimal session data causes ProfilePage to show
  // empty fields until the background refetch completes.
  if ('_id' in user) {
    queryClient.setQueryData(queryKeys.auth.profile, normalizedProfile);
  }
};

export const setNotificationPreferencesCache = (preferences) => {
  queryClient.setQueryData(queryKeys.auth.notifications, preferences || null);
};

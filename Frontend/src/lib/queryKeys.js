export const queryKeys = {
  auth: {
    all: ["auth"],
    session: ["auth", "session-user"],
    profile: ["auth", "profile"],
    notifications: ["auth", "notification-preferences"],
  },
  resumes: {
    all: ["resumes"],
    list: ["resumes", "list"],
    detail: (resumeId) => ["resumes", "detail", resumeId],
  },
};

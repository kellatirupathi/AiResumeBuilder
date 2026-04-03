import { QueryClient } from "@tanstack/react-query";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: DAY_IN_MS,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: 1,
    },
    mutations: {
      retry: 0,
    },
  },
});

export const queryPersister =
  typeof window !== "undefined"
    ? createSyncStoragePersister({
        storage: window.localStorage,
        key: "nxtresume-query-cache",
      })
    : undefined;

export const queryPersistOptions = {
  persister: queryPersister,
  maxAge: DAY_IN_MS,
  buster: "nxtresume-v1",
  dehydrateOptions: {
    shouldDehydrateQuery: (query) => query.state.status === "success",
  },
};

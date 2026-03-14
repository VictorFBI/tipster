import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Configure QueryClient with default options
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: how long data is considered fresh (5 minutes)
      staleTime: 5 * 60 * 1000,
      // Cache time: how long inactive data stays in cache (10 minutes)
      gcTime: 10 * 60 * 1000,
      // Retry failed requests
      retry: 1,
      // Refetch on window focus
      refetchOnWindowFocus: false,
      // Refetch on reconnect
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry failed mutations
      retry: 0,
    },
  },
});

interface QueryProviderProps {
  children: React.ReactNode;
}

/**
 * QueryProvider component
 * Wraps the app with React Query's QueryClientProvider
 */
export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryProvider;

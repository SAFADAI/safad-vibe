import React, { createContext, useContext, useCallback } from "react";
import { useGetPriceAlerts } from "@workspace/api-client-react";

interface AlertsContextValue {
  triggeredCount: number;
  totalCount: number;
  refetch: () => void;
  isLoading: boolean;
}

const AlertsContext = createContext<AlertsContextValue>({
  triggeredCount: 0,
  totalCount: 0,
  refetch: () => {},
  isLoading: false,
});

export function AlertsProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading, refetch } = useGetPriceAlerts({
    refetchInterval: 30000,
  });

  const handleRefetch = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <AlertsContext.Provider
      value={{
        triggeredCount: data?.triggeredCount ?? 0,
        totalCount: data?.total ?? 0,
        refetch: handleRefetch,
        isLoading,
      }}
    >
      {children}
    </AlertsContext.Provider>
  );
}

export function useAlerts() {
  return useContext(AlertsContext);
}

import { useContext } from "react";
import { DashboardContext } from "../(dashboard)/layout";

// Create a custom hook for using the context
export function useGetDashboardContext() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}

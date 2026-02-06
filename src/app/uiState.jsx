import { createContext, useContext, useMemo, useState } from "react";

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const value = useMemo(
    () => ({
      isSidebarCollapsed,
      toggleSidebar: () => setIsSidebarCollapsed((v) => !v),
      setSidebarCollapsed: setIsSidebarCollapsed,
    }),
    [isSidebarCollapsed]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) {
    throw new Error("useUI must be used inside UIProvider");
  }
  return ctx;
}

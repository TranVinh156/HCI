import { createContext, useContext } from "react";

type SidebarLayoutContextValue = {
  isSidebarOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
};

const SidebarLayoutContext = createContext<SidebarLayoutContextValue | null>(null);

export function SidebarLayoutProvider({
  value,
  children,
}: {
  value: SidebarLayoutContextValue;
  children: React.ReactNode;
}) {
  return <SidebarLayoutContext.Provider value={value}>{children}</SidebarLayoutContext.Provider>;
}

export function useSidebarLayout() {
  const context = useContext(SidebarLayoutContext);
  if (!context) {
    throw new Error("useSidebarLayout must be used within SidebarLayoutProvider");
  }

  return context;
}

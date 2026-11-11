"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

const AppShellNavContext = createContext(null);

export function AppShellNavProvider({ children }) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const openMobileNav = useCallback(() => setIsMobileNavOpen(true), []);
  const closeMobileNav = useCallback(() => setIsMobileNavOpen(false), []);
  const toggleMobileNav = useCallback(
    () => setIsMobileNavOpen((prev) => !prev),
    []
  );

  const value = useMemo(
    () => ({
      isMobileNavOpen,
      openMobileNav,
      closeMobileNav,
      toggleMobileNav,
    }),
    [isMobileNavOpen, openMobileNav, closeMobileNav, toggleMobileNav]
  );

  return (
    <AppShellNavContext.Provider value={value}>{children}</AppShellNavContext.Provider>
  );
}

export function useAppShellNav() {
  return useContext(AppShellNavContext);
}

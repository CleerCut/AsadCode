"use client";

import AppSidebar from "@/components/app-sidebar/app-sidebar.component";
import { AppShellNavProvider } from "@/components/app-sidebar/app-shell-nav.context";

export default function HeaderLayout({
  children,
  className = "",
  mainClassName = "",
}) {
  return (
    <AppShellNavProvider>
      <div
        className={`flex min-h-0 flex-col bg-white overflow-hidden h-[100dvh] max-h-[100dvh] ${className ?? ""}`.trim()}
      >
        <AppSidebar />
        <main
          className={`flex min-h-0 flex-1 flex-col overflow-x-hidden overscroll-contain pb-[calc(3rem+env(safe-area-inset-bottom))] pl-0 sm:pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0 md:pl-16 ${
            mainClassName || "overflow-y-auto"
          }`.trim()}
        >
          {children}
        </main>
      </div>
    </AppShellNavProvider>
  );
}

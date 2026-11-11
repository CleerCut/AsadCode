"use client";

import { Bell, Sparkle } from "lucide-react";

import useAppTopBar from "./use-app-top-bar.hook";

const iconBtnClass =
  "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors sm:h-9 sm:w-9";

export default function AppTopBar({ leftSlot = null }) {
  const { avatarUrl, initials, unreadCount, goToNotifications, goToProfile } = useAppTopBar();

  return (
    <header className="relative z-50 flex min-w-0 shrink-0 items-center justify-between gap-2 overflow-visible border-b border-gray-200 bg-white px-2.5 pb-3 pt-2.5 sm:gap-3 sm:px-4 sm:pb-4 sm:pt-3.5">
      <div className="relative z-50 min-w-0 flex-1 overflow-visible pr-1">
        {leftSlot}
      </div>

      <div className="relative z-40 flex shrink-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          disabled
          title="Clare (coming soon)"
          aria-label="Clare"
          className={`${iconBtnClass} bg-[#4552DF] text-white shadow-sm`}
        >
          <Sparkle className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={1.75} fill="currentColor" aria-hidden />
        </button>

        <button
          type="button"
          onClick={goToNotifications}
          title="Notifications"
          aria-label="Notifications"
          className={`relative ${iconBtnClass} bg-[#EEF0FF] text-[#4552DF] ring-1 ring-[#4552DF]/30 hover:bg-[#E0E4FF]`}
        >
          <Bell className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={1.75} aria-hidden />
          {unreadCount > 0 ? (
            <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold leading-none text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          ) : null}
        </button>

        <button
          type="button"
          onClick={goToProfile}
          title="Brand profile"
          aria-label="Brand profile"
          className={`${iconBtnClass} overflow-hidden bg-[#EEF0FF] ring-2 ring-[#4552DF]/35 hover:ring-[#4552DF]/55`}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="inline-flex h-full w-full items-center justify-center bg-[#4552DF] text-[10px] font-semibold text-white">
              {initials || "U"}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

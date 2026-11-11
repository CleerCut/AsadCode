"use client";

import Link from "next/link";

import useAppSidebar from "./use-app-sidebar.hook";

function NavItem({ href, label, icon: Icon, isActive, isExpanded }) {
  return (
    <Link
      href={href}
      prefetch={true}
      title={label}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white transition-colors ${
        isActive ? "bg-white/[0.17]" : "hover:bg-white/10"
      } ${isExpanded ? "justify-start" : "justify-center px-0"}`}
    >
      <Icon className="h-5 w-5 shrink-0 opacity-95" strokeWidth={1.5} aria-hidden />
      {isExpanded ? <span className="truncate whitespace-nowrap">{label}</span> : null}
    </Link>
  );
}

function BottomNavItem({ href, label, shortLabel, icon: Icon, isActive }) {
  return (
    <Link
      href={href}
      prefetch={true}
      className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-0 px-0.5 text-2xs font-medium leading-none sm:gap-0.5 sm:text-[10px] sm:leading-tight ${
        isActive ? "text-[#4552DF]" : "text-gray-600"
      }`}
    >
      <Icon
        className={`h-4 w-4 shrink-0 sm:h-[18px] sm:w-[18px] ${
          isActive ? "text-[#4552DF]" : "text-gray-500"
        }`}
        strokeWidth={1.75}
        aria-hidden
      />
      <span className="max-w-full truncate text-center">{shortLabel || label}</span>
    </Link>
  );
}

export default function AppSidebar() {
  const {
    railBg,
    isExpanded,
    topLinks,
    isNavLinkActive,
    brandName,
    planLabel,
    avatarUrl,
    accountMenuItems,
    showAccountMenu,
    toggleAccountMenu,
    closeAccountMenu,
    getUserInitials,
    handleMouseEnter,
    handleMouseLeave,
  } = useAppSidebar();

  const initials = getUserInitials(brandName);

  return (
    <>
      <aside
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`fixed bottom-0 left-0 top-0 z-[70] hidden flex-col text-white shadow-[4px_0_24px_rgba(0,0,0,0.12)] transition-[width] duration-200 ease-out md:flex ${
          isExpanded ? "md:w-[190px]" : "md:w-16"
        }`}
        style={{ backgroundColor: railBg }}
        aria-label="Main navigation"
      >
        <nav className="flex min-h-0 flex-1 flex-col overflow-x-hidden px-2 pb-3 pt-3">
          <div className="flex flex-col gap-0.5">
            {topLinks.map((item) => (
              <NavItem
                key={item.id}
                href={item.href}
                label={item.label}
                icon={item.icon}
                isActive={isNavLinkActive(item.id)}
                isExpanded={isExpanded}
              />
            ))}
          </div>

          <div className="mt-auto flex flex-col gap-0.5">
            <div className="mx-2 mb-2 border-t border-white/25" />

            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleAccountMenu();
                }}
                title="Account menu"
                aria-haspopup="true"
                aria-expanded={showAccountMenu}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10 ${
                  isExpanded ? "justify-start" : "justify-center px-0"
                }`}
              >
                {isExpanded ? (
                  <img
                    src="/assets/images/horizontal-logo-white.png"
                    alt="CleerCut"
                    className="h-7 w-auto max-w-full object-contain"
                  />
                ) : (
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white p-1">
                    <img
                      src="/assets/images/logo.png"
                      alt="CleerCut"
                      className="h-full w-full object-contain"
                    />
                  </span>
                )}
              </button>

              {showAccountMenu ? (
                <>
                  <div
                    className="fixed inset-0 z-[70]"
                    onClick={closeAccountMenu}
                    aria-hidden="true"
                  />
                  <div
                    className={`fixed bottom-3 z-[71] w-56 rounded-lg border border-gray-200 bg-white text-gray-900 shadow-lg ${
                      isExpanded ? "left-[198px]" : "left-20"
                    }`}
                    role="menu"
                  >
                    <div className="border-b border-gray-100 p-2.5 sm:p-3">
                      <div className="flex items-center space-x-3">
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt=""
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4552DF] text-sm font-semibold text-white">
                            {initials || "U"}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-semibold text-gray-900 sm:text-sm">
                            {brandName}
                          </p>
                          {planLabel ? (
                            <p className="truncate text-[10px] text-gray-500 sm:text-xs">
                              {planLabel}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <div className="py-1">
                      {accountMenuItems.map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            item.action();
                            closeAccountMenu();
                          }}
                          className={`flex w-full items-center space-x-2 px-3 py-2 text-xs transition-colors sm:text-sm ${
                            item.className || "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </nav>
      </aside>

      <nav
        className="fixed bottom-0 left-0 right-0 z-[60] flex h-[3rem] min-h-[3rem] items-stretch justify-around gap-0 border-t border-gray-200 bg-white pt-0.5 pb-[max(0.25rem,env(safe-area-inset-bottom))] shadow-[0_-4px_12px_rgba(0,0,0,0.06)] md:hidden sm:h-16 sm:min-h-16"
        aria-label="Main navigation"
      >
        {topLinks.map((item) => (
          <BottomNavItem
            key={item.id}
            href={item.href}
            label={item.label}
            shortLabel={item.shortLabel}
            icon={item.icon}
            isActive={isNavLinkActive(item.id)}
          />
        ))}
      </nav>
    </>
  );
}

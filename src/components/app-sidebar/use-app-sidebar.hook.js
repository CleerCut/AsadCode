"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Compass,
  DollarSign,
  FolderOpen,
  LayoutGrid,
  LogOut,
  Settings,
} from "lucide-react";
import { useDispatch } from "react-redux";

import ROLES from "@/common/constants/role.constant";
import { getUser, isCreatorMode, logout } from "@/common/utils/users.util";
import { resetOnboardingSession } from "@/provider/features/onboarding/onboarding.slice";
const RAIL_BG = "#4552DF";
const PAYOUTS_HREF = "/settings/payments/payment-history";
const SETTINGS_HREF = "/settings/account-settings/personal-information";
const CONTENT_LIBRARY_HREF = "/content-library";
const REPORTS_HREF = "/reports";
const DISCOVER_HREF = "/discover";

const FALLBACK_USER = {
  first_name: "CleerCut",
  last_name: "Member",
  email: "member@cleercut.com",
  role: ROLES.BRAND,
  avatar: null,
};

function isPayoutsPath(pathname) {
  return pathname?.startsWith(PAYOUTS_HREF);
}

function isSettingsPath(pathname) {
  return pathname?.includes("/settings") && !isPayoutsPath(pathname);
}

function isCampaignsPath(pathname) {
  return pathname === "/campaign" || pathname?.startsWith("/campaign/");
}

function isDiscoverPath(pathname) {
  return pathname === DISCOVER_HREF || pathname?.startsWith(`${DISCOVER_HREF}/`);
}

function isPortfolioPath(pathname, isCreator) {
  if (isCreator) {
    return (
      pathname?.includes("/creator-portfolio") || pathname?.includes("/creator-profile")
    );
  }
  return pathname?.includes("/brand-portfolio");
}

function isContentLibraryPath(pathname) {
  return pathname === CONTENT_LIBRARY_HREF || pathname?.startsWith(`${CONTENT_LIBRARY_HREF}/`);
}

function isReportsPath(pathname) {
  return pathname === REPORTS_HREF || pathname?.startsWith(`${REPORTS_HREF}/`);
}

const useAppSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [currentUser, setCurrentUser] = useState(FALLBACK_USER);
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    const user = getUser();
    setCurrentUser(user || FALLBACK_USER);
    setIsCreator(isCreatorMode());
  }, []);

  const topLinks = useMemo(() => {
    if (isCreator) {
      return [
        {
          href: "/campaign",
          label: "Campaigns",
          shortLabel: "Campaigns",
          icon: LayoutGrid,
          id: "campaigns",
        },
        {
          href: PAYOUTS_HREF,
          label: "Payouts",
          shortLabel: "Payouts",
          icon: DollarSign,
          id: "payouts",
        },
      ];
    }

    return [
      {
        href: "/campaign",
        label: "Campaigns",
        shortLabel: "Campaigns",
        icon: LayoutGrid,
        id: "campaigns",
      },
      {
        href: DISCOVER_HREF,
        label: "Discover+",
        shortLabel: "Discover+",
        icon: Compass,
        id: "discover",
      },
      {
        href: PAYOUTS_HREF,
        label: "Payouts",
        shortLabel: "Payouts",
        icon: DollarSign,
        id: "payouts",
      },
      {
        href: CONTENT_LIBRARY_HREF,
        label: "Content Library",
        shortLabel: "Content",
        icon: FolderOpen,
        id: "content-library",
      },
      {
        href: REPORTS_HREF,
        label: "Reports",
        shortLabel: "Reports",
        icon: BarChart3,
        id: "reports",
      },
    ];
  }, [isCreator]);

  const isNavLinkActive = useCallback(
    (id) => {
      switch (id) {
        case "campaigns":
          return isCampaignsPath(pathname);
        case "discover":
          return isDiscoverPath(pathname);
        case "payouts":
          return isPayoutsPath(pathname);
        case "content-library":
          return isContentLibraryPath(pathname);
        case "reports":
          return isReportsPath(pathname);
        case "settings":
          return isSettingsPath(pathname);
        case "profile":
          return isPortfolioPath(pathname, isCreator);
        default:
          return false;
      }
    },
    [pathname, isCreator]
  );

  const brandName = useMemo(() => {
    return (
      currentUser?.brand_profile?.brand_name ||
      `${currentUser?.first_name || ""} ${currentUser?.last_name || ""}`.trim() ||
      "CleerCut"
    );
  }, [currentUser]);

  const planLabel = useMemo(() => {
    return (
      currentUser?.brand_profile?.plan_name ||
      currentUser?.subscription_plan ||
      currentUser?.plan ||
      null
    );
  }, [currentUser]);

  const accountMenuItems = useMemo(
    () => [
      {
        icon: <Settings size={16} />,
        label: "Settings",
        action: () => {
          router.push(SETTINGS_HREF);
        },
      },
      {
        icon: <LogOut size={16} />,
        label: "Log out",
        action: () => {
          dispatch(resetOnboardingSession());
          logout();
        },
        className: "text-red-600 hover:text-red-700 hover:bg-red-50",
      },
    ],
    [dispatch, router]
  );

  const getUserInitials = useCallback((name = "") => {
    return name
      .split(" ")
      .map((n) => n?.[0])
      .filter(Boolean)
      .join("")
      .toUpperCase();
  }, []);

  const avatarUrl =
    currentUser?.brand_profile?.brand_logo_url ||
    currentUser?.creator_profile?.profile_photo_url ||
    currentUser?.avatar ||
    null;

  const handleMouseEnter = useCallback(() => {
    setIsExpanded(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!showAccountMenu) {
      setIsExpanded(false);
    }
  }, [showAccountMenu]);

  const toggleAccountMenu = useCallback(() => {
    setShowAccountMenu((prev) => !prev);
  }, []);

  const closeAccountMenu = useCallback(() => {
    setShowAccountMenu(false);
    setIsExpanded(false);
  }, []);

  return {
    railBg: RAIL_BG,
    isExpanded,
    topLinks,
    isNavLinkActive,
    currentUser,
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
  };
};

export default useAppSidebar;

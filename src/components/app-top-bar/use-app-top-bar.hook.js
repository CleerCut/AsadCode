"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import { getUser, isCreatorMode } from "@/common/utils/users.util";
import { getUnreadCount } from "@/provider/features/notification/notification.slice";

const FALLBACK_USER = {
  first_name: "CleerCut",
  last_name: "Member",
  brand_profile: null,
  creator_profile: null,
  avatar: null,
};

export default function useAppTopBar() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [currentUser, setCurrentUser] = useState(FALLBACK_USER);

  const unreadCountState = useSelector((state) => state.notification?.getUnreadCount);
  const unreadCount = unreadCountState?.data?.data?.count || 0;

  useEffect(() => {
    setCurrentUser(getUser() || FALLBACK_USER);
  }, []);

  useEffect(() => {
    if (isCreatorMode()) return;
    dispatch(getUnreadCount());
  }, [dispatch]);

  const avatarUrl = useMemo(
    () =>
      currentUser?.brand_profile?.brand_logo_url ||
      currentUser?.creator_profile?.profile_photo_url ||
      currentUser?.avatar ||
      null,
    [currentUser]
  );

  const initials = useMemo(() => {
    const name =
      `${currentUser?.first_name || ""} ${currentUser?.last_name || ""}`.trim() ||
      currentUser?.first_name ||
      "";
    return name
      .split(" ")
      .map((n) => n?.[0])
      .filter(Boolean)
      .join("")
      .toUpperCase();
  }, [currentUser]);

  const profileHref = isCreatorMode() ? "/creator-portfolio" : "/brand-portfolio";

  const goToNotifications = useCallback(() => {
    router.push("/notifications");
  }, [router]);

  const goToProfile = useCallback(() => {
    router.push(profileHref);
  }, [router, profileHref]);

  return {
    avatarUrl,
    initials,
    unreadCount,
    goToNotifications,
    goToProfile,
  };
}

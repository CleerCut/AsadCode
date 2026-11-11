"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export default function useReportsCampaignSelector({
  options = [],
  value = null,
  onChange,
  inProgressCount = 0,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const rootRef = useRef(null);
  const searchRef = useRef(null);

  const close = useCallback(() => {
    setIsOpen(false);
    setSearch("");
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;

    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        close();
      }
    };

    const onKeyDown = (event) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, close]);

  useEffect(() => {
    if (!isOpen) return;
    const timer = window.setTimeout(() => searchRef.current?.focus(), 0);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  const filteredOptions = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return options;
    return options.filter((option) =>
      String(option.label || "")
        .toLowerCase()
        .includes(query)
    );
  }, [options, search]);

  const realOptions = useMemo(
    () => filteredOptions.filter((option) => !option.isDemo),
    [filteredOptions]
  );

  const demoOptions = useMemo(
    () => filteredOptions.filter((option) => option.isDemo),
    [filteredOptions]
  );

  const handleSearchChange = useCallback((event) => {
    setSearch(event.target.value);
  }, []);

  const handleSelect = useCallback(
    (option) => {
      if (!option || option.disabled) return;
      onChange?.(option.campaign || option);
      close();
    },
    [onChange, close]
  );

  const footerText =
    inProgressCount > 0
      ? `Campaigns appear here once they are marked complete. ${inProgressCount} campaign${
          inProgressCount === 1 ? " is" : "s are"
        } still in progress.`
      : "Campaigns appear here once they are marked complete.";

  return {
    rootRef,
    searchRef,
    isOpen,
    search,
    realOptions,
    demoOptions,
    footerText,
    toggle,
    close,
    handleSearchChange,
    handleSelect,
    displayLabel: value?.label || "Select a campaign",
    isSelected: (option) => String(option?.value) === String(value?.value),
  };
}

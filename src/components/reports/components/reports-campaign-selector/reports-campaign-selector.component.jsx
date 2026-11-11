"use client";

import { ChevronDown, Search } from "lucide-react";
import useReportsCampaignSelector from "./use-reports-campaign-selector.hook";

function OptionRow({ option, isSelected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(option)}
      className={`flex w-full flex-col items-start gap-0.5 px-3 py-2.5 text-left transition-colors ${
        isSelected ? "bg-indigo-50" : "hover:bg-gray-50"
      }`}
    >
      <span className="flex w-full min-w-0 items-center gap-2">
        <span className="truncate text-sm font-medium text-gray-900">{option.label}</span>
        {option.isDemo ? (
          <span className="shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800">
            Demo
          </span>
        ) : null}
      </span>
      {option.meta ? (
        <span className="truncate text-[11px] text-gray-500">{option.meta}</span>
      ) : null}
      {option.isDemo ? (
        <span className="text-[11px] text-amber-700">Sample data · Not your results</span>
      ) : null}
    </button>
  );
}

export default function ReportsCampaignSelector({
  options = [],
  value = null,
  onChange,
  inProgressCount = 0,
  isLoading = false,
  className = "",
}) {
  const {
    rootRef,
    searchRef,
    isOpen,
    search,
    realOptions,
    demoOptions,
    footerText,
    toggle,
    handleSearchChange,
    handleSelect,
    displayLabel,
    isSelected,
  } = useReportsCampaignSelector({
    options,
    value,
    onChange,
    inProgressCount,
  });

  return (
    <div ref={rootRef} className={`relative w-full max-w-md ${className}`}>
      <button
        type="button"
        onClick={toggle}
        disabled={isLoading}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex w-full min-h-9 items-center justify-between gap-2 rounded-lg border border-[#E5E4DF] bg-white px-3 py-2 text-left text-xs shadow-sm transition-colors hover:border-[#D5D3CE] hover:bg-[#FAFAF8] disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-10 sm:text-sm"
      >
        <span className="min-w-0 flex-1 truncate font-medium text-gray-900">
          {isLoading ? "Loading campaigns…" : displayLabel}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen ? (
        <div
          className="absolute left-0 right-0 z-[100] mt-1 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg"
          role="listbox"
        >
          <div className="border-b border-gray-100 p-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <input
                ref={searchRef}
                type="search"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search campaigns"
                className="w-full rounded-md border border-gray-300 py-1.5 pl-8 pr-2.5 text-xs text-gray-900 outline-none focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm"
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {realOptions.length === 0 && demoOptions.length === 0 ? (
              <p className="px-3 py-3 text-sm text-gray-400">No campaigns found</p>
            ) : null}

            {realOptions.map((option) => (
              <OptionRow
                key={option.value}
                option={option}
                isSelected={isSelected(option)}
                onSelect={handleSelect}
              />
            ))}

            {demoOptions.length > 0 ? (
              <div className="border-t border-gray-100">
                <p className="px-3 pb-1 pt-2.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                  Example
                </p>
                {demoOptions.map((option) => (
                  <OptionRow
                    key={option.value}
                    option={option}
                    isSelected={isSelected(option)}
                    onSelect={handleSelect}
                  />
                ))}
              </div>
            ) : null}
          </div>

          <div className="border-t border-gray-100 bg-gray-50 px-3 py-2.5">
            <p className="text-[11px] leading-snug text-gray-500">{footerText}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

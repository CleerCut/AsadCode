"use client";

import { Check, ChevronDown, Search, User } from "lucide-react";

import { Skeleton } from "@/common/components/loader/skeleton-loader.component";
import useCampaignScopeDropdown from "./use-campaign-scope-dropdown.hook";

const TITLE_CLASS = "truncate text-xs font-semibold leading-tight text-gray-900 sm:text-sm";
const META_CLASS = "mt-0.5 block truncate text-[10px] leading-tight text-gray-500 sm:text-[11px]";
const SECTION_CLASS =
  "px-3 pb-1 pt-2.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400 sm:text-[11px]";

function CampaignOptionRow({
  title,
  meta,
  isSelected,
  onClick,
  badge,
  className = "",
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-start gap-2 px-3 py-2.5 text-left transition-colors hover:bg-gray-50 ${className}`}
    >
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className={TITLE_CLASS}>{title}</span>
          {badge ? (
            <span className="shrink-0 rounded bg-[#4552DF]/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#4552DF]">
              {badge}
            </span>
          ) : null}
        </span>
        {meta ? <span className={META_CLASS}>{meta}</span> : null}
      </span>
      {isSelected ? (
        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#4552DF]" aria-hidden />
      ) : null}
    </button>
  );
}

function CampaignOptionSkeleton() {
  return (
    <div className="flex w-full items-start gap-2 px-3 py-2.5" aria-hidden>
      <span className="min-w-0 flex-1 space-y-1.5">
        <Skeleton className="h-3.5 w-3/4" />
        <Skeleton className="h-2.5 w-1/2" />
      </span>
    </div>
  );
}

export default function CampaignScopeDropdown() {
  const {
    rootRef,
    isOpen,
    toggle,
    search,
    setSearch,
    triggerLabel,
    triggerMeta,
    showTriggerSkeleton,
    campaignsLoading,
    showIndividual,
    showDemo,
    filteredMulti,
    demoCampaign,
    isIndividualSelected,
    selectedValue,
    selectIndividualHires,
    selectCampaign,
    formatCampaignScopeMeta,
  } = useCampaignScopeDropdown();

  const showListSkeleton =
    campaignsLoading && filteredMulti.length === 0 && !showDemo;

  return (
    <div ref={rootRef} className="relative w-full min-w-0 max-w-full md:max-w-[280px] lg:max-w-[320px]">
      <button
        type="button"
        onClick={toggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-busy={showTriggerSkeleton || undefined}
        className="flex h-[46px] w-full min-w-0 items-center gap-2 rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-left transition-colors hover:bg-gray-50 sm:h-[50px]"
      >
        <span className="flex min-h-[30px] min-w-0 flex-1 flex-col justify-center">
          {showTriggerSkeleton ? (
            <span className="block space-y-1.5 py-0.5">
              <Skeleton className="h-3.5 w-36 sm:w-44" />
              <Skeleton className="h-2.5 w-24 sm:w-28" />
            </span>
          ) : (
            <>
              <span className={`block ${TITLE_CLASS}`}>{triggerLabel}</span>
              <span className={`${META_CLASS} ${triggerMeta ? "" : "invisible"}`}>
                {triggerMeta || "Select a campaign scope"}
              </span>
            </>
          )}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden
        />
      </button>

      {isOpen ? (
        <div
          className="absolute left-0 top-[calc(100%+6px)] z-[80] flex w-80 max-w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
          role="listbox"
        >
          <div className="shrink-0 border-b border-gray-100 p-2">
            <label className="relative block">
              <Search
                className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400"
                aria-hidden
              />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search campaigns"
                className="box-border h-9 w-full rounded-md border border-gray-200 bg-gray-50 py-2 pl-8 pr-2.5 text-xs text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#4552DF] focus:bg-white sm:text-sm"
                autoFocus
              />
            </label>
          </div>

          {showIndividual ? (
            <div className="sticky top-0 z-10 shrink-0 border-b border-gray-100 bg-[#F5F6FF]">
              <button
                type="button"
                onClick={selectIndividualHires}
                className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-[#EBEDFF]"
              >
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#4552DF] shadow-sm">
                  <User className="h-4 w-4" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block ${TITLE_CLASS}`}>Individual hires</span>
                  <span className={META_CLASS}>Creators hired outside a campaign</span>
                </span>
                {isIndividualSelected ? (
                  <Check className="h-4 w-4 shrink-0 text-[#4552DF]" aria-hidden />
                ) : null}
              </button>
            </div>
          ) : null}

          <div className="h-64 min-h-64 overflow-y-auto">
            {showListSkeleton ? (
              <div aria-busy="true" aria-label="Loading campaigns">
                <p className={SECTION_CLASS}>Multi-creator campaigns</p>
                <CampaignOptionSkeleton />
                <CampaignOptionSkeleton />
                <CampaignOptionSkeleton />
                <CampaignOptionSkeleton />
              </div>
            ) : null}

            {!showListSkeleton ? (
              <div>
                <p className={SECTION_CLASS}>Multi-creator campaigns</p>
                {filteredMulti.length > 0 ? (
                  filteredMulti.map((campaign) => (
                    <CampaignOptionRow
                      key={campaign.id}
                      title={campaign.campaign_title || "Untitled Campaign"}
                      meta={formatCampaignScopeMeta(campaign)}
                      isSelected={
                        !isIndividualSelected &&
                        String(selectedValue) === String(campaign.id)
                      }
                      onClick={() => selectCampaign(campaign)}
                    />
                  ))
                ) : (
                  <p className="px-3 py-3 text-xs text-gray-500">
                    {campaignsLoading
                      ? "Loading campaigns…"
                      : "No multi-creator campaigns yet."}
                  </p>
                )}
              </div>
            ) : null}

            {!showListSkeleton && showDemo && demoCampaign ? (
              <div className="border-t border-gray-100">
                <p className={SECTION_CLASS}>Example</p>
                <CampaignOptionRow
                  title={demoCampaign.campaign_title || "Demo Campaign"}
                  meta={formatCampaignScopeMeta(demoCampaign)}
                  badge="Demo"
                  isSelected={
                    !isIndividualSelected &&
                    String(selectedValue) === String(demoCampaign.id)
                  }
                  onClick={() => selectCampaign(demoCampaign)}
                />
              </div>
            ) : null}

            {!campaignsLoading &&
            filteredMulti.length === 0 &&
            !showDemo &&
            !showIndividual ? (
              <p className="px-3 py-4 text-xs text-gray-500">No campaigns match your search.</p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

"use client";

import { Suspense } from "react";
import { Download } from "lucide-react";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import FullPageLoader from "@/common/components/loader/full-page-loader.component";
import HeaderLayout from "@/common/layouts/header.layout";
import CompletedCampaignReport from "@/components/campaign-refactored/brand-campaign/completed/components/completed-campaign-report/completed-campaign-report.component";
import ReportsCampaignSelector from "./components/reports-campaign-selector/reports-campaign-selector.component";
import useReports from "./use-reports.hook";

function ReportsContent() {
  const {
    isBootstrapping,
    campaignsError,
    selectedCampaignId,
    selectedOption,
    selectorOptions,
    inProgressCount,
    isDemoSelected,
    isPdfLoading,
    pdfDemoMessage,
    handleCampaignSelect,
    handleExportPdf,
  } = useReports();

  return (
    <HeaderLayout className="bg-[#EDEDEA]" mainClassName="overflow-y-auto">
      <div className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-3 px-3 py-2.5 sm:px-4 sm:py-3">
          <ReportsCampaignSelector
            options={selectorOptions}
            value={selectedOption}
            onChange={handleCampaignSelect}
            inProgressCount={inProgressCount}
            isLoading={isBootstrapping}
            className="w-full max-w-sm sm:max-w-md"
          />
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-[960px] flex-col gap-4 px-3 pb-10 pt-5 sm:px-5 sm:pt-6">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div className="min-w-0">
            <h1 className="text-xl font-semibold tracking-tight text-[#16273F] sm:text-2xl">
              Reports
            </h1>
            <p className="mt-0.5 text-sm text-[#8A8985]">
              Results for each completed campaign.
            </p>
          </div>
          <div className="flex w-full flex-col items-stretch gap-1 sm:w-auto sm:items-end">
            {isDemoSelected ? (
              <p className="text-[11px] text-amber-700 sm:text-right">
                Sample data · Not your results
              </p>
            ) : null}
            {pdfDemoMessage ? (
              <div className="mb-1 w-full max-w-sm rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 sm:text-right">
                {pdfDemoMessage}
              </div>
            ) : null}
            <CustomButton
              text="Export as PDF"
              className="btn-outline w-full sm:min-w-[148px] sm:w-auto"
              onClick={handleExportPdf}
              disabled={isPdfLoading || !selectedCampaignId}
              loading={isPdfLoading}
              loadingText="Generating PDF…"
              startIcon={isPdfLoading ? null : <Download className="h-3.5 w-3.5" />}
            />
          </div>
        </div>

        {isBootstrapping ? <FullPageLoader /> : null}

        {!isBootstrapping && campaignsError ? (
          <div className="rounded-xl border border-[#EDECE7] bg-white p-6 text-center shadow-sm">
            <p className="text-sm font-semibold text-[#16273F]">Unable to load campaigns</p>
            <p className="mt-2 text-xs text-[#8A8985]">Please refresh and try again.</p>
          </div>
        ) : null}

        {!isBootstrapping && !campaignsError && selectedCampaignId ? (
          <CompletedCampaignReport campaignId={selectedCampaignId} embedded />
        ) : null}

        {!isBootstrapping && !campaignsError && !selectedCampaignId ? (
          <div className="rounded-xl border border-[#EDECE7] bg-white p-6 text-center shadow-sm">
            <p className="text-sm font-semibold text-[#16273F]">No report available</p>
            <p className="mt-2 text-xs text-[#8A8985]">
              Mark a campaign complete to see its results here.
            </p>
          </div>
        ) : null}
      </div>
    </HeaderLayout>
  );
}

export default function Reports() {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <ReportsContent />
    </Suspense>
  );
}

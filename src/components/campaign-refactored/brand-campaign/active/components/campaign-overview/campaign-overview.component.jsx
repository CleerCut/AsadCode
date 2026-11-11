import NotFound from "@/common/components/not-found/not-found.component";
import LeftPaneSkeleton from "@/common/components/brand-campaign-panes-skeleton/left-pane-skeleton.component";
import AudienceDemographics from "@/components/audience-demographics/audience-demographics.component";
import useCampaignOverview from "./use-campaign-overview.hook";

export default function CampaignOverview({ onCampaignSelect, onToggleChange }) {
  const {
    isMultiCreator,
    filteredCampaignOptions,
    isSelectedCampaignValid,
    showMultiCreatorUI,
    selectedCampaign,
    budgetData,
    formatCurrency,
    isLoading,
    budgetStatsLoading,
    hasData,
    demographicsData,
    demographicsLoading,
    hasDemographicsData,
  } = useCampaignOverview(onCampaignSelect, onToggleChange);

  const leftPaneAwaiting =
    isLoading ||
    budgetStatsLoading ||
    (!!selectedCampaign && demographicsLoading);

  const showNoDataNotFound =
    !hasData &&
    !leftPaneAwaiting &&
    (isMultiCreator
      ? filteredCampaignOptions.length === 0 || (isSelectedCampaignValid && !!selectedCampaign)
      : true);

  if (leftPaneAwaiting) {
    return <LeftPaneSkeleton embedded />;
  }

  const hasOverviewScrollContent =
    (showMultiCreatorUI && hasData) || (hasData && selectedCampaign);

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 max-w-full flex-1 flex-col gap-3 overflow-hidden bg-white p-3 sm:gap-4 sm:p-4">
      <div className="shrink-0 space-y-3">
        {showNoDataNotFound && (
          <div className="flex min-h-[50vh] w-full items-center justify-center px-4 text-center">
            <NotFound title="No Data Available" description="Please select a campaign and creator." />
          </div>
        )}
      </div>

      {hasOverviewScrollContent && (
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain pr-0.5">
            {showMultiCreatorUI && hasData && (
              <>
                <hr className="border-gray-200" />

                <div className="overflow-hidden rounded-lg bg-gray-100">
                  <div className="flex min-w-0 items-center justify-between">
                    <div className="min-w-0 px-2 py-2 sm:px-3 sm:py-2.5">
                      <p className="text-[10px] font-bold tracking-wide text-primary sm:text-sm">
                        Spent
                      </p>
                      <p className="break-words text-sm font-semibold tabular-nums leading-tight text-primary sm:text-base">
                        {formatCurrency(budgetData?.spent ?? 0)}
                      </p>
                    </div>
                    <div className="min-w-0 px-2 py-2 sm:px-3 sm:py-2.5">
                      <p className="text-[10px] font-bold tracking-wide text-green-600 sm:text-sm">
                        Remaining
                      </p>
                      <p className="break-words text-sm font-semibold tabular-nums leading-tight text-green-700 sm:text-base">
                        {formatCurrency(budgetData?.remaining ?? 0)}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {hasData && selectedCampaign && (
              <>
                <hr className="border-gray-200" />

                <div className="mb-1 min-w-0">
                  <div className="mb-3 sm:mb-4">
                    <h3 className="mb-1 text-sm font-semibold text-gray-800 sm:text-lg">
                      {showMultiCreatorUI ? "Combined Audience Demographics" : "Audience Demographics"}
                    </h3>
                    {showMultiCreatorUI &&
                      hasDemographicsData &&
                      demographicsData &&
                      demographicsData.has_data && (
                        <p className="text-xs leading-relaxed text-gray-500">
                          Aggregated across{" "}
                          {demographicsData.creators_with_data ?? demographicsData.total_creators ?? 0}{" "}
                          creators · {(demographicsData.total_followers ?? 0).toLocaleString()} total
                          followers
                        </p>
                      )}
                  </div>

                  <AudienceDemographics
                    audienceData={demographicsData ?? null}
                    loading={false}
                    className="flex flex-col"
                  />

                  {showMultiCreatorUI && hasDemographicsData && demographicsData && (
                    <div className="mt-4 rounded-lg border border-blue-100 bg-blue-50/90 p-3">
                      <p className="text-xs leading-relaxed text-blue-800">
                        <strong>Tip:</strong> Use this data to identify gaps in your campaign&apos;s
                        reach. Consider adding creators from underrepresented demographics.
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

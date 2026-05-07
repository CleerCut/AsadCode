import AudienceDemographics from "@/components/audience-demographics/audience-demographics.component";
import usePredictedShortlistPanel from "./use-predicted-shortlist-panel.hook";

function formatInteger(n) {
  if (n == null || !Number.isFinite(Number(n))) return null;
  const v = Math.round(Number(n));
  return v.toLocaleString();
}

const PredictedShortlistPanel = ({ creators }) => {
  const {
    audienceData,
    performance,
    viewsSampleCount,
    engagementSampleCount,
    isEmptyShortlist,
    isMetricsLoading,
  } = usePredictedShortlistPanel(creators);

  return (
    <div className="max-w-full space-y-3 rounded-lg border border-gray-100 bg-white p-3 shadow-sm sm:space-y-4 sm:p-4">
      <div>
        <h2 className="text-sm font-semibold text-gray-900 sm:text-lg md:text-xl">
          Predicted Performance & Audience
        </h2>
        <p className="mt-1 text-[10px] leading-snug text-gray-500 sm:text-xs md:text-sm">
          These metrics are estimated based on the creators currently in this shortlist. Actual
          results may vary.
        </p>
      </div>

      {isEmptyShortlist ? (
        <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-3 py-6 text-center text-[10px] text-gray-600 sm:text-xs">
          Add creators to see predicted audience insights
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
          <div className="rounded-lg border border-gray-100 bg-gray-50/60 p-3 sm:p-4 lg:col-span-3">
            <h3 className="text-[10px] font-semibold text-gray-600 sm:text-xs">
              Predicted performance
            </h3>
            <dl className="mt-2 space-y-2 sm:space-y-2.5">
              <div className="rounded-md bg-primary px-2.5 py-2 sm:px-3 sm:py-2.5">
                <dt className="text-[10px] font-semibold text-white/90 sm:text-xs">
                  Total combined followers
                </dt>
                <dd className="mt-1 text-sm font-bold tabular-nums text-white sm:text-base md:text-lg">
                  {formatInteger(performance.totalFollowers) ?? "—"}
                </dd>
              </div>
              <div className="rounded-md bg-primary px-2.5 py-2 sm:px-3 sm:py-2.5">
                <dt className="text-[10px] font-semibold text-white/90 sm:text-xs">
                  Average views
                </dt>
                <dd className="mt-1 text-sm font-bold tabular-nums text-white sm:text-base md:text-lg">
                  {isMetricsLoading ? (
                    <span className="inline-block h-5 w-20 animate-pulse rounded bg-white/30" />
                  ) : viewsSampleCount > 0 && performance.averageViews != null ? (
                    formatInteger(performance.averageViews)
                  ) : (
                    "N/A"
                  )}
                </dd>
              </div>
              <div className="rounded-md bg-primary px-2.5 py-2 sm:px-3 sm:py-2.5">
                <dt className="text-[10px] font-semibold text-white/90 sm:text-xs">
                  Average engagement rate
                </dt>
                <dd className="mt-1 text-sm font-bold tabular-nums text-white sm:text-base md:text-lg">
                  {isMetricsLoading ? (
                    <span className="inline-block h-5 w-16 animate-pulse rounded bg-white/30" />
                  ) : engagementSampleCount > 0 && performance.averageEngagementRate != null ? (
                    `${performance.averageEngagementRate}%`
                  ) : (
                    "N/A"
                  )}
                </dd>
              </div>
            </dl>
          </div>

          <div className="min-w-0 lg:col-span-9">
            <h3 className="mb-2 text-[10px] font-semibold text-gray-600 sm:text-xs">
              Predicted audience demographics
            </h3>
            <AudienceDemographics
              audienceData={audienceData}
              emptyMessage="Not enough data for audience demographics from saved creator profiles."
              className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictedShortlistPanel;

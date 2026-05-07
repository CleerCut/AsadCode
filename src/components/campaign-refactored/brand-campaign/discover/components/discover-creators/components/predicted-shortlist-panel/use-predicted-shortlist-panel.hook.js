import { useEffect, useMemo, useState } from "react";
import { buildPredictedShortlistAudienceAndPerformance } from "@/common/utils/predicted-shortlist-audience.utils";
import phylloService from "@/provider/features/phyllo/phyllo.service";

function usePredictedShortlistPanel(creators) {
  const [phylloMetricsByCreatorId, setPhylloMetricsByCreatorId] = useState({});
  const [isMetricsLoading, setIsMetricsLoading] = useState(false);

  const creatorIds = useMemo(
    () =>
      (Array.isArray(creators) ? creators : [])
        .map((c) => c?.id)
        .filter(Boolean)
        .map(String),
    [creators]
  );

  useEffect(() => {
    if (creatorIds.length === 0) {
      setPhylloMetricsByCreatorId({});
      setIsMetricsLoading(false);
      return;
    }
    let active = true;
    setIsMetricsLoading(true);
    Promise.allSettled(
      creatorIds.map((id) =>
        phylloService.fetchCreatorMetrics(id).then((res) => ({
          id,
          payload: res?.data ?? null,
        }))
      )
    ).then((results) => {
      if (!active) return;
      const next = {};
      results.forEach((r) => {
        if (r.status !== "fulfilled") return;
        const id = r.value?.id;
        const payload = r.value?.payload;
        if (id && payload?.hasData && payload?.metrics) {
          next[id] = payload;
        }
      });
      setPhylloMetricsByCreatorId(next);
      setIsMetricsLoading(false);
    });
    return () => {
      active = false;
    };
  }, [creatorIds.join("|")]);

  const { audienceData, performance, viewsSampleCount, engagementSampleCount } = useMemo(
    () => buildPredictedShortlistAudienceAndPerformance(creators, phylloMetricsByCreatorId),
    [creators, phylloMetricsByCreatorId]
  );

  const isEmptyShortlist = !Array.isArray(creators) || creators.length === 0;

  return {
    audienceData,
    performance,
    viewsSampleCount,
    engagementSampleCount,
    isEmptyShortlist,
    isMetricsLoading,
  };
}

export default usePredictedShortlistPanel;

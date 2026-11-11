"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { CAMPAIGN_STATUS } from "@/common/constants/campaign.constant";
import { CAMPAIGN_TYPE_MAP, filterCampaignsOwnedByBrand } from "@/common/utils/campaign.utils";
import {
  DEMO_MUTATION_MESSAGES,
  findDemoCampaign,
  isDemoCampaign,
  pickDefaultBrandCampaign,
} from "@/common/utils/demo-campaign.util";
import { getUser, isCreatorMode } from "@/common/utils/users.util";
import { getAllBrandCampaigns } from "@/provider/features/campaigns/campaigns.slice";
import {
  downloadCompletedCampaignReportPdf,
  selectDownloadCampaignReportPdf,
} from "@/provider/features/campaign-report/campaign-report.slice";

function isCompletedCampaign(campaign) {
  if (!campaign || campaign.is_deleted) return false;
  if (campaign.status === CAMPAIGN_STATUS.COMPLETE) return true;
  return (
    Array.isArray(campaign.creators) &&
    campaign.creators.some((creator) => creator.status === "COMPLETED")
  );
}

function getCreatorCount(campaign) {
  if (!campaign) return 0;
  if (Array.isArray(campaign.creators) && campaign.creators.length) {
    return campaign.creators.length;
  }
  return Number(campaign.creators_count || campaign.total_creators || 0);
}

function getCompletionDate(campaign) {
  return campaign?.completed_date || campaign?.updated_at || campaign?.active_date || null;
}

function formatShortDate(iso) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return null;
  }
}

function buildCampaignMeta(campaign) {
  const typeLabel =
    CAMPAIGN_TYPE_MAP[campaign?.campaign_type] || campaign?.campaign_type || "Campaign";
  const dateLabel = formatShortDate(getCompletionDate(campaign));
  const creators = getCreatorCount(campaign);
  const creatorLabel = `${creators} creator${creators === 1 ? "" : "s"}`;
  return [typeLabel, dateLabel, creatorLabel].filter(Boolean).join(" · ");
}

export default function useReports() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const campaignParam = searchParams.get("campaign");

  const {
    isLoading: campaignsLoading,
    isSuccess: campaignsSuccess,
    isError: campaignsError,
    data: campaignsData,
  } = useSelector((state) => state.campaigns.getAllBrandCampaigns || {});
  const { isLoading: isPdfLoading } = useSelector(selectDownloadCampaignReportPdf);

  const hasRequestedRef = useRef(false);
  const lastSyncedIdRef = useRef(null);
  const [pdfDemoMessage, setPdfDemoMessage] = useState("");
  const isCreator = isCreatorMode();

  useEffect(() => {
    if (isCreator) {
      router.replace("/campaign");
    }
  }, [isCreator, router]);

  useEffect(() => {
    if (
      isCreator ||
      campaignsLoading ||
      campaignsSuccess ||
      campaignsError ||
      hasRequestedRef.current
    ) {
      return;
    }
    hasRequestedRef.current = true;
    dispatch(getAllBrandCampaigns());
  }, [dispatch, campaignsLoading, campaignsSuccess, campaignsError, isCreator]);

  const ownedCampaigns = useMemo(() => {
    const list = Array.isArray(campaignsData?.data) ? campaignsData.data : [];
    return filterCampaignsOwnedByBrand(list, getUser()?.id);
  }, [campaignsData?.data]);

  const completedCampaigns = useMemo(() => {
    const completed = ownedCampaigns.filter(isCompletedCampaign);
    const real = completed
      .filter((campaign) => !isDemoCampaign(campaign))
      .sort((a, b) => {
        const aTime = new Date(getCompletionDate(a) || 0).getTime();
        const bTime = new Date(getCompletionDate(b) || 0).getTime();
        return bTime - aTime;
      });
    const demo = findDemoCampaign(completed) || findDemoCampaign(ownedCampaigns);
    return demo ? [...real, demo] : real;
  }, [ownedCampaigns]);

  const realCompletedCampaigns = useMemo(
    () => completedCampaigns.filter((campaign) => !isDemoCampaign(campaign)),
    [completedCampaigns]
  );

  const demoCampaign = useMemo(
    () => findDemoCampaign(completedCampaigns) || findDemoCampaign(ownedCampaigns),
    [completedCampaigns, ownedCampaigns]
  );

  const inProgressCount = useMemo(() => {
    return ownedCampaigns.filter((campaign) => {
      if (!campaign || campaign.is_deleted || isDemoCampaign(campaign)) return false;
      return !isCompletedCampaign(campaign);
    }).length;
  }, [ownedCampaigns]);

  const selectedCampaign = useMemo(() => {
    if (!campaignsSuccess) return null;
    if (campaignParam) {
      const fromUrl = completedCampaigns.find(
        (campaign) => String(campaign.id) === String(campaignParam)
      );
      if (fromUrl) return fromUrl;
    }
    return pickDefaultBrandCampaign(completedCampaigns);
  }, [campaignsSuccess, campaignParam, completedCampaigns]);

  const selectedCampaignId = selectedCampaign?.id || null;

  useEffect(() => {
    if (!campaignsSuccess || !selectedCampaignId) return;
    if (String(campaignParam || "") === String(selectedCampaignId)) {
      lastSyncedIdRef.current = String(selectedCampaignId);
      return;
    }
    if (lastSyncedIdRef.current === String(selectedCampaignId) && campaignParam) {
      return;
    }
    lastSyncedIdRef.current = String(selectedCampaignId);
    router.replace(`/reports?campaign=${selectedCampaignId}`, { scroll: false });
  }, [campaignsSuccess, selectedCampaignId, campaignParam, router]);

  const handleCampaignSelect = useCallback(
    (campaign) => {
      if (!campaign?.id) return;
      lastSyncedIdRef.current = String(campaign.id);
      router.replace(`/reports?campaign=${campaign.id}`, { scroll: false });
    },
    [router]
  );

  const handleExportPdf = useCallback(() => {
    if (!selectedCampaignId || isPdfLoading) return;
    if (isDemoCampaign(selectedCampaign)) {
      setPdfDemoMessage(DEMO_MUTATION_MESSAGES.pdfExport);
      return;
    }
    setPdfDemoMessage("");
    dispatch(downloadCompletedCampaignReportPdf(selectedCampaignId));
  }, [dispatch, selectedCampaignId, selectedCampaign, isPdfLoading]);

  useEffect(() => {
    setPdfDemoMessage("");
  }, [selectedCampaignId]);

  const selectorOptions = useMemo(() => {
    return completedCampaigns.map((campaign) => ({
      value: campaign.id,
      label: campaign.campaign_title || "Untitled Campaign",
      meta: buildCampaignMeta(campaign),
      isDemo: isDemoCampaign(campaign),
      campaign,
    }));
  }, [completedCampaigns]);

  const selectedOption = useMemo(() => {
    if (!selectedCampaign) return null;
    return {
      value: selectedCampaign.id,
      label: selectedCampaign.campaign_title || "Untitled Campaign",
      meta: buildCampaignMeta(selectedCampaign),
      isDemo: isDemoCampaign(selectedCampaign),
      campaign: selectedCampaign,
    };
  }, [selectedCampaign]);

  const isDemoSelected = isDemoCampaign(selectedCampaign);
  const hasRealReports = realCompletedCampaigns.length > 0;
  const isBootstrapping =
    isCreator || (!campaignsSuccess && (campaignsLoading || !campaignsError));

  return {
    isBootstrapping,
    campaignsError,
    selectedCampaign,
    selectedCampaignId,
    selectedOption,
    selectorOptions,
    realCompletedCampaigns,
    demoCampaign,
    inProgressCount,
    isDemoSelected,
    hasRealReports,
    isPdfLoading,
    pdfDemoMessage,
    handleCampaignSelect,
    handleExportPdf,
  };
}

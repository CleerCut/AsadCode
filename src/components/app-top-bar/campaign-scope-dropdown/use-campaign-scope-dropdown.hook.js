"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { COLLABORATION_TYPE } from "@/common/constants/campaign.constant";
import { INDIVIDUAL_HIRES_SCOPE_VALUE } from "@/common/constants/campaign-scope.constant";
import { filterCampaignsOwnedByBrand } from "@/common/utils/campaign.utils";
import {
  formatCampaignScopeMeta,
  partitionCampaignScopeList,
  pickDefaultCampaignScopeSelection,
} from "@/common/utils/campaign-scope.utils";
import { isDemoCampaign } from "@/common/utils/demo-campaign.util";
import { getUser } from "@/common/utils/users.util";
import { getAllBrandCampaigns } from "@/provider/features/campaigns/campaigns.slice";
import {
  setBrandCampaignMultiCreatorMode,
  setSelectedCampaign,
} from "@/provider/features/campaign-context/campaign-context.slice";

export default function useCampaignScopeDropdown() {
  const dispatch = useDispatch();
  const rootRef = useRef(null);
  const hasRequestedRef = useRef(false);
  const hasAppliedDefaultRef = useRef(false);
  const cachedCampaignsRef = useRef([]);

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const {
    data: campaignsApiData,
    isLoading: campaignsLoading,
    isSuccess: campaignsSuccess,
    isError: campaignsError,
  } = useSelector((state) => state.campaigns.getAllBrandCampaigns || {});

  const selectedCampaignId = useSelector(
    (state) => state.campaignContext?.selectedCampaignId ?? null
  );
  const isMultiCreator = useSelector(
    (state) => state.campaignContext?.isBrandCampaignMultiCreatorMode ?? true
  );

  const campaigns = useMemo(() => {
    const raw = Array.isArray(campaignsApiData?.data) ? campaignsApiData.data : [];
    const brandUserId = getUser()?.id;
    const filtered = brandUserId
      ? filterCampaignsOwnedByBrand(raw, brandUserId)
      : raw;

    if (filtered.length > 0) {
      cachedCampaignsRef.current = filtered;
      return filtered;
    }

    // Keep last known list while a refetch briefly returns empty/loading.
    if (cachedCampaignsRef.current.length > 0 && (campaignsLoading || raw.length === 0)) {
      return cachedCampaignsRef.current;
    }

    return filtered;
  }, [campaignsApiData?.data, campaignsLoading]);

  const { multiCampaigns, demoCampaign } = useMemo(
    () => partitionCampaignScopeList(campaigns),
    [campaigns]
  );

  useEffect(() => {
    if (
      campaignsLoading ||
      campaignsSuccess ||
      campaignsError ||
      hasRequestedRef.current
    ) {
      return;
    }
    hasRequestedRef.current = true;
    dispatch(getAllBrandCampaigns());
  }, [dispatch, campaignsLoading, campaignsSuccess, campaignsError]);

  useEffect(() => {
    if (!campaignsSuccess || hasAppliedDefaultRef.current) return;

    if (!isMultiCreator) {
      hasAppliedDefaultRef.current = true;
      return;
    }

    const selectedStillValid =
      selectedCampaignId &&
      campaigns.some((c) => String(c.id) === String(selectedCampaignId));

    if (selectedStillValid) {
      hasAppliedDefaultRef.current = true;
      return;
    }

    const { mode, campaign } = pickDefaultCampaignScopeSelection(campaigns);
    hasAppliedDefaultRef.current = true;

    if (mode === "individual") {
      dispatch(setBrandCampaignMultiCreatorMode(false));
      dispatch(
        setSelectedCampaign({
          campaignId: null,
          collaborationType: COLLABORATION_TYPE.INDIVIDUAL_CREATOR,
        })
      );
      return;
    }

    if (campaign?.id) {
      dispatch(setBrandCampaignMultiCreatorMode(true));
      dispatch(
        setSelectedCampaign({
          campaignId: campaign.id,
          collaborationType:
            campaign.collaboration_type || COLLABORATION_TYPE.MULTI_CREATOR,
        })
      );
    }
  }, [
    campaignsSuccess,
    campaigns,
    selectedCampaignId,
    isMultiCreator,
    dispatch,
  ]);

  const selectedCampaign = useMemo(() => {
    if (!selectedCampaignId) return null;
    return campaigns.find((c) => String(c.id) === String(selectedCampaignId)) || null;
  }, [campaigns, selectedCampaignId]);

  const triggerLabel = useMemo(() => {
    if (!isMultiCreator) return "Individual hires";
    if (selectedCampaign) {
      return selectedCampaign.campaign_title || "Untitled Campaign";
    }
    return "Select a campaign";
  }, [isMultiCreator, selectedCampaign]);

  const showTriggerSkeleton =
    campaignsLoading && isMultiCreator && !selectedCampaign && multiCampaigns.length === 0;

  const triggerMeta = useMemo(() => {
    if (!isMultiCreator) return "Creators hired outside a campaign";
    if (!selectedCampaign) return null;
    return formatCampaignScopeMeta(selectedCampaign);
  }, [isMultiCreator, selectedCampaign]);

  const normalizedSearch = search.trim().toLowerCase();

  const filteredMulti = useMemo(() => {
    if (!normalizedSearch) return multiCampaigns;
    return multiCampaigns.filter((c) =>
      (c.campaign_title || "").toLowerCase().includes(normalizedSearch)
    );
  }, [multiCampaigns, normalizedSearch]);

  const showDemo =
    !!demoCampaign &&
    (!normalizedSearch ||
      (demoCampaign.campaign_title || "").toLowerCase().includes(normalizedSearch) ||
      "demo".includes(normalizedSearch) ||
      "example".includes(normalizedSearch));

  const showIndividual =
    !normalizedSearch ||
    "individual hires".includes(normalizedSearch) ||
    "individual".includes(normalizedSearch);

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
      if (rootRef.current && !rootRef.current.contains(event.target)) {
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

  const selectIndividualHires = useCallback(() => {
    dispatch(setBrandCampaignMultiCreatorMode(false));
    dispatch(
      setSelectedCampaign({
        campaignId: null,
        collaborationType: COLLABORATION_TYPE.INDIVIDUAL_CREATOR,
      })
    );
    close();
  }, [dispatch, close]);

  const selectCampaign = useCallback(
    (campaign) => {
      if (!campaign?.id) return;
      dispatch(setBrandCampaignMultiCreatorMode(true));
      dispatch(
        setSelectedCampaign({
          campaignId: campaign.id,
          collaborationType:
            campaign.collaboration_type || COLLABORATION_TYPE.MULTI_CREATOR,
        })
      );
      close();
    },
    [dispatch, close]
  );

  const isIndividualSelected = !isMultiCreator;
  const selectedValue = isIndividualSelected
    ? INDIVIDUAL_HIRES_SCOPE_VALUE
    : selectedCampaignId;

  return {
    rootRef,
    isOpen,
    toggle,
    close,
    search,
    setSearch,
    triggerLabel,
    triggerMeta,
    showTriggerSkeleton,
    campaignsLoading,
    showIndividual,
    showDemo,
    filteredMulti,
    multiCampaigns,
    demoCampaign,
    isIndividualSelected,
    selectedValue,
    selectIndividualHires,
    selectCampaign,
    formatCampaignScopeMeta,
    isDemoCampaign,
  };
}

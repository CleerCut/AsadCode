import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isCreatorMode } from "@/common/utils/users.util";
import { useSearchParams } from "next/navigation";
import { BRAND_CAMPAIGN_TAB } from "@/common/constants/campaign.constant";
import {
  selectCampaignActiveTab,
  setCampaignActiveTab,
} from "@/provider/features/campaign-context/campaign-context.slice";

import BrandCampaignHome from "./brand-campaign/home/home.component";
import BrandApplications from "./brand-campaign/applications/applications.component";
import BrandActive from "./brand-campaign/active/active.component";
import BrandCompleted from "./brand-campaign/completed/completed.component";

import CreatorDiscover from "./creator-campaign/discover/discover.component";
import CreatorApplications from "./creator-campaign/applications/applications.component";
import CreatorActive from "./creator-campaign/active/active.component";
import CreatorCompleted from "./creator-campaign/completed/completed.component";

export default function useCampaign() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const defaultTab = isCreatorMode() ? 1 : BRAND_CAMPAIGN_TAB.HOME;
  const tab = Number(searchParams.get("tab")) || defaultTab;
  const activeTab = useSelector(selectCampaignActiveTab) || defaultTab;

  const componentMap = useMemo(
    () => ({
      brand: {
        [BRAND_CAMPAIGN_TAB.HOME]: BrandCampaignHome,
        [BRAND_CAMPAIGN_TAB.APPLICATIONS]: BrandApplications,
        [BRAND_CAMPAIGN_TAB.ACTIVE]: BrandActive,
        [BRAND_CAMPAIGN_TAB.COMPLETED]: BrandCompleted,
      },
      creator: {
        1: CreatorDiscover,
        2: CreatorActive,
        3: CreatorCompleted,
        4: CreatorApplications,
      },
    }),
    []
  );

  const mainTabs = useMemo(() => {
    const brandTabs = [
      { id: BRAND_CAMPAIGN_TAB.HOME, label: "Home" },
      { id: BRAND_CAMPAIGN_TAB.APPLICATIONS, label: "Applications" },
      { id: BRAND_CAMPAIGN_TAB.ACTIVE, label: "In Progress" },
      { id: BRAND_CAMPAIGN_TAB.COMPLETED, label: "Done" },
    ];

    const creatorTabs = [
      { id: 1, label: "Discover+" },
      { id: 2, label: "Active" },
      { id: 3, label: "Completed" },
      { id: 4, label: "Applications" },
    ];

    return isCreatorMode() ? creatorTabs : brandTabs;
  }, []);

  const userRole = useMemo(() => (isCreatorMode() ? "creator" : "brand"), []);
  const ActiveComponent = componentMap[userRole][activeTab];

  const setActiveTab = useCallback(
    (tabId) => {
      dispatch(setCampaignActiveTab(tabId));
    },
    [dispatch]
  );

  useEffect(() => {
    dispatch(setCampaignActiveTab(tab || defaultTab));
  }, [tab, dispatch, defaultTab]);

  return {
    activeTab,
    setActiveTab,
    mainTabs,
    ActiveComponent,
    isBrand: !isCreatorMode(),
  };
}

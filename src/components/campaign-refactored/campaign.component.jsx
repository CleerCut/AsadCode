"use client";

import { useEffect, useRef, useState } from "react";
import HeaderLayout from "@/common/layouts/header.layout";
import DemoCampaignBanner from "@/common/components/demo-campaign-banner/demo-campaign-banner.component";
import { isDemoCampaign } from "@/common/utils/demo-campaign.util";
import { useSelector } from "react-redux";
import AppTopBar from "@/components/app-top-bar/app-top-bar.component";
import CampaignScopeDropdown from "@/components/app-top-bar/campaign-scope-dropdown/campaign-scope-dropdown.component";
import {
  CampaignTabBarMobileSlotProvider,
  useCampaignTabBarMobileSlot,
} from "./campaign-tab-bar-mobile-slot.context";
import useCampaign from "./use-campaign.hook";

function CampaignShell() {
  const { activeTab, setActiveTab, mainTabs, ActiveComponent, isBrand } = useCampaign();
  const tabBarSlotCtx = useCampaignTabBarMobileSlot();
  const mobileSlot = tabBarSlotCtx?.mobileSlot ?? null;
  const rightSlot = tabBarSlotCtx?.rightSlot ?? null;
  const selectedCampaignId = useSelector(
    (state) => state.campaignContext?.selectedCampaignId
  );
  const brandCampaigns =
    useSelector((state) => state.campaigns?.getAllBrandCampaigns?.data?.data) || [];
  const selectedCampaign = brandCampaigns.find((c) => c.id === selectedCampaignId);
  const showDemoBanner =
    isBrand &&
    [2, 3, 4].includes(Number(activeTab)) &&
    isDemoCampaign(selectedCampaign);

  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const node = headerRef.current;
    if (!node) return undefined;

    const updateHeight = () => {
      setHeaderHeight(Math.ceil(node.getBoundingClientRect().height));
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(node);
    window.addEventListener("resize", updateHeight);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, [isBrand, showDemoBanner, rightSlot, mobileSlot, activeTab]);

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden border-b border-gray-200">
      <div
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-40 overflow-visible border-b border-gray-200 bg-white shadow-sm md:left-16"
      >
        {isBrand ? <AppTopBar leftSlot={<CampaignScopeDropdown />} /> : null}
        {showDemoBanner ? <DemoCampaignBanner /> : null}
        <nav
          className={`flex min-w-0 flex-col gap-1.5 px-2 pt-1.5 sm:px-3 sm:pt-2 md:flex-row md:items-stretch md:gap-2 md:pb-2 ${
            rightSlot ? "pb-0 md:pb-2" : "pb-1.5 sm:pb-2"
          }`}
        >
          <div className="flex min-w-0 flex-1 items-stretch gap-1.5 md:flex-none">
            {mobileSlot ? (
              <div className="flex shrink-0 items-stretch md:hidden">{mobileSlot}</div>
            ) : null}
            <div className="flex min-w-0 flex-1 items-stretch gap-1 sm:gap-1.5 md:flex-none">
              {mainTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex h-9 min-w-0 flex-1 items-center justify-center overflow-hidden rounded-md border px-1.5 text-[11px] font-semibold leading-none transition-colors sm:h-10 sm:px-2.5 sm:text-sm md:h-9 md:w-auto md:flex-none md:px-4 md:text-sm ${
                    activeTab === tab.id
                      ? "border-[#4552DF] bg-[#4552DF] text-white shadow-sm"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="truncate">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
          {rightSlot ? (
            <div className="flex w-full shrink-0 items-stretch md:ml-auto md:w-auto">
              {rightSlot}
            </div>
          ) : null}
        </nav>
      </div>

      <div
        className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
        style={{ paddingTop: headerHeight ? `${headerHeight}px` : undefined }}
      >
        {ActiveComponent ? (
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            <ActiveComponent />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function Campaign() {
  return (
    <HeaderLayout>
      <CampaignTabBarMobileSlotProvider>
        <CampaignShell />
      </CampaignTabBarMobileSlotProvider>
    </HeaderLayout>
  );
}

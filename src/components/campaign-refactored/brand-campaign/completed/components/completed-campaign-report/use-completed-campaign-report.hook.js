import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  downloadCompletedCampaignReportPdf,
  getCompletedCampaignReport,
  resetCompletedReport,
  resetDownloadPdf,
  selectCompletedCampaignReport,
  selectDownloadCampaignReportPdf,
} from "@/provider/features/campaign-report/campaign-report.slice";
import {
  DEMO_MUTATION_MESSAGES,
  isDemoCampaign,
} from "@/common/utils/demo-campaign.util";
import { formatDate } from "@/common/utils/formate-date";
import {
  formatCurrency,
  formatNumber,
  formatPercent,
} from "@/common/utils/format.utils";

export default function useCompletedCampaignReport(campaignId) {
  const dispatch = useDispatch();
  const { data, isLoading, isError, isSuccess, message } = useSelector(
    selectCompletedCampaignReport
  );
  const { isLoading: isPdfLoading } = useSelector(selectDownloadCampaignReportPdf);
  const [activeTab, setActiveTab] = useState("overview");
  const [pdfDemoMessage, setPdfDemoMessage] = useState("");
  const brandCampaigns =
    useSelector((state) => state.campaigns?.getAllBrandCampaigns?.data?.data) || [];
  const matchedBrandCampaign = brandCampaigns.find(
    (campaign) => String(campaign.id) === String(campaignId),
  );
  const isDemo =
    isDemoCampaign(matchedBrandCampaign) ||
    Boolean(data?.meta?.isDemo) ||
    isDemoCampaign({
      campaign_title: data?.header?.campaignTitle,
      is_demo: data?.meta?.isDemo,
    });

  useEffect(() => {
    if (!campaignId) return;
    dispatch(resetCompletedReport());
    dispatch(resetDownloadPdf());
    dispatch(getCompletedCampaignReport(campaignId));
    setPdfDemoMessage("");
  }, [dispatch, campaignId]);

  const showLoader = Boolean(campaignId) && (isLoading || (!isSuccess && !isError));

  const tabs = useMemo(() => {
    const items = [{ id: "overview", label: "Overview" }];
    if (data?.meta?.trackingEnabled && data?.salesAndRoi) {
      items.push({ id: "sales", label: "Sales & ROI" });
    }
    items.push(
      { id: "creators", label: "Creators & Content" },
      { id: "rehire", label: "Re-Hire Opportunities" }
    );
    return items;
  }, [data?.meta?.trackingEnabled, data?.salesAndRoi]);

  useEffect(() => {
    if (!tabs.some((t) => t.id === activeTab)) {
      setActiveTab("overview");
    }
  }, [tabs, activeTab]);

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
  }, []);

  const handleDownloadPdf = useCallback(() => {
    if (!campaignId || isPdfLoading) return;
    if (isDemo || data?.meta?.pdfExportAvailable === false) {
      setPdfDemoMessage(DEMO_MUTATION_MESSAGES.pdfExport);
      return;
    }
    dispatch(downloadCompletedCampaignReportPdf(campaignId));
  }, [campaignId, dispatch, isPdfLoading, isDemo, data?.meta?.pdfExportAvailable]);

  return {
    data,
    isLoading: showLoader,
    isError,
    message,
    activeTab,
    tabs,
    isPdfLoading,
    pdfDemoMessage,
    isDemo,
    handleTabChange,
    handleDownloadPdf,
    formatCurrency,
    formatNumber,
    formatPercent,
    formatDate,
  };
}

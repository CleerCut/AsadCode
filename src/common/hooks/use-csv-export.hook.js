import { useCallback } from "react";
import {
  downloadCSV,
  formatUtcYyyymmdd,
  generateCSV,
  sanitizeFilename,
} from "@/common/utils/csv-export.util";

function getMainPlatformHandle(creator) {
  const socialPlatforms = creator?.creator?.creator_profile?.social_platforms;
  if (Array.isArray(socialPlatforms) && socialPlatforms.length > 0) {
    const first = socialPlatforms[0];
    const u = first?.username ?? first?.handle ?? "";
    if (u) return String(u);
  }
  const accounts = creator?.creator?.social_accounts;
  if (Array.isArray(accounts) && accounts.length > 0) {
    const u = accounts[0]?.username ?? accounts[0]?.handle ?? "";
    if (u) return String(u);
  }
  const stats = creator?.creator?.platformStats;
  if (stats && typeof stats === "object") {
    const firstKey = Object.keys(stats)[0];
    if (firstKey) {
      const u = stats[firstKey]?.username ?? stats[firstKey]?.handle ?? "";
      if (u) return String(u);
    }
  }
  return "";
}

function getDeliverablesList(creator, campaign) {
  const contract = creator?.contract;
  if (contract) {
    const contentFormat = contract.contentFormat || contract.content_format;
    if (contentFormat) {
      if (typeof contentFormat === "string") return contentFormat;
      if (Array.isArray(contentFormat)) return contentFormat.join(", ");
    }
  }
  const campaignDeliverables = campaign?.deliverables;
  if (campaignDeliverables) {
    if (typeof campaignDeliverables === "string") return campaignDeliverables;
    if (Array.isArray(campaignDeliverables)) return campaignDeliverables.join(", ");
  }
  return "";
}

function getPaymentType(creator, campaign) {
  const contract = creator?.contract;
  if (contract) {
    const contractCompensationType = contract.compensationType || contract.compensation_type;
    if (contractCompensationType) {
      const typeMap = {
        PAID: "paid",
        GIFTED_PRODUCT: "gifted",
        AFFILIATE: "affiliate",
      };
      return typeMap[contractCompensationType] || String(contractCompensationType).toLowerCase();
    }
  }
  const compensationType = campaign?.compensation_type || creator?.campaign?.compensation_type;
  if (!compensationType) return "";
  const typeMap = {
    PAID: "paid",
    GIFTED_PRODUCT: "gifted",
    AFFILIATE: "affiliate",
  };
  return typeMap[compensationType] || String(compensationType).toLowerCase();
}

function getUsageRightsSummary(creator) {
  const contract = creator?.contract;
  if (!contract) return "";
  const usageRights = contract.usageRights || contract.usage_rights;
  return usageRights || "";
}

function getExclusivitySummary(creator) {
  const contract = creator?.contract;
  if (!contract) return "";
  const exclusivityClause = contract.exclusivityClause || contract.exclusivity_clause;
  return exclusivityClause || "";
}

function formatDateCsv(date) {
  if (!date) return "";
  try {
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return "";
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  } catch {
    return "";
  }
}

function resolveContractForCreator(creator, campaign) {
  let contract = creator?.contract;
  const creatorId = creator?.creatorUserId ?? creator?.creator?.id;
  if (!contract && campaign?.contracts && Array.isArray(campaign.contracts)) {
    contract = campaign.contracts.find((c) => {
      const cid = c.creator_id ?? c.creatorId ?? c.creator?.id;
      return String(cid) === String(creatorId);
    });
  }
  return contract;
}

function getCreatorMarkedCompletedAt(creator) {
  const c = creator?.contract;
  const fromContract =
    c?.completedAt ??
    c?.completed_at ??
    c?.brandMarkedCompleteAt ??
    c?.brand_marked_complete_at ??
    null;
  return (
    formatDateCsv(fromContract) ||
    formatDateCsv(creator?.completed_at) ||
    formatDateCsv(creator?.completedAt) ||
    ""
  );
}

function audienceGenderPercents(creatorProfile) {
  const dist = creatorProfile?.audience_gender_distribution;
  if (!dist || typeof dist !== "object") {
    return { female: "", male: "", other: "" };
  }
  const female = dist.female ?? dist.Female ?? dist.women;
  const male = dist.male ?? dist.Male ?? dist.men;
  const other = dist.other ?? dist.Other ?? dist.non_binary;
  const fmt = (v) =>
    v === null || v === undefined || v === "" ? "" : Number.isFinite(Number(v)) ? Number(v) : "";
  return {
    female: fmt(female),
    male: fmt(male),
    other: fmt(other),
  };
}

export default function useCSVExport() {
  const exportCompletedCreators = useCallback((creators, campaign, options = {}) => {
    const { getCreatorMetrics } = options;
    if (!creators || creators.length === 0) return;
    if (!campaign) return;

    const headers = [
      "campaign_id",
      "campaign_name",
      "creator_id",
      "creator_name",
      "creator_handle_main_platform",
      "creator_country",
      "creator_city",
      "deliverables_list",
      "payment_type",
      "payment_amount",
      "currency",
      "usage_rights_summary",
      "exclusivity_summary",
      "total_views",
      "total_engagement",
      "engagement_rate",
      "cost_per_engagement",
      "audience_primary_country",
      "audience_primary_age_range",
      "audience_gender_split_female_percent",
      "audience_gender_split_male_percent",
      "audience_gender_split_other_percent",
      "campaign_start_date",
      "campaign_end_date",
      "creator_marked_completed_at",
    ];

    const campaignStart =
      campaign.start_date ??
      campaign.startDate ??
      campaign.created_at ??
      campaign.createdAt ??
      "";
    const campaignEnd =
      campaign.end_date ??
      campaign.endDate ??
      campaign.completed_date ??
      campaign.completed_at ??
      campaign.completedDate ??
      "";

    const currency =
      campaign.currency ||
      campaign.currency_code ||
      campaign.currencyCode ||
      "USD";

    const rows = creators.map((creator) => {
      const contract = resolveContractForCreator(creator, campaign);
      const creatorRow = contract ? { ...creator, contract } : creator;
      const creatorProfile = creator?.creator?.creator_profile;
      const paymentAmountRaw =
        contract?.totalCompensation ??
        contract?.total_compensation ??
        creator?.totalSpent ??
        creator?.total_spent ??
        0;
      const paymentAmount =
        typeof paymentAmountRaw === "number"
          ? paymentAmountRaw
          : Number.parseFloat(paymentAmountRaw) || 0;

      let totalViews = "";
      let totalEngagement = "";
      let engagementRate = "";
      let costPerEngagement = "";

      if (typeof getCreatorMetrics === "function") {
        const m = getCreatorMetrics(creator);
        if (m && !m.metricsUnavailable) {
          if (m.views != null) totalViews = m.views;
          if (m.totalEngagement != null) totalEngagement = m.totalEngagement;
          if (m.engagementRate != null && Number.isFinite(m.engagementRate)) {
            engagementRate = m.engagementRate;
          }
          if (m.costPerEngagement != null && Number.isFinite(Number(m.costPerEngagement))) {
            costPerEngagement = Number(m.costPerEngagement);
          }
        }
      }

      const gender = audienceGenderPercents(creatorProfile);

      const creatorCountry = creator?.creator?.country ?? "";
      const creatorCity = creator?.creator?.city ?? "";

      return {
        campaign_id: campaign?.id ?? "",
        campaign_name: campaign?.campaign_title ?? campaign?.title ?? "",
        creator_id: creator?.creatorUserId ?? creator?.creator?.id ?? "",
        creator_name: creator?.name ?? "",
        creator_handle_main_platform: getMainPlatformHandle(creator),
        creator_country: creatorCountry,
        creator_city: creatorCity,
        deliverables_list: getDeliverablesList(creatorRow, campaign),
        payment_type: getPaymentType(creatorRow, campaign),
        payment_amount: paymentAmount,
        currency,
        usage_rights_summary: getUsageRightsSummary(creatorRow),
        exclusivity_summary: getExclusivitySummary(creatorRow),
        total_views: totalViews,
        total_engagement: totalEngagement,
        engagement_rate: engagementRate,
        cost_per_engagement: costPerEngagement,
        audience_primary_country: creatorProfile?.audience_countries?.[0] ?? "",
        audience_primary_age_range: creatorProfile?.audience_age_ranges?.[0] ?? "",
        audience_gender_split_female_percent: gender.female,
        audience_gender_split_male_percent: gender.male,
        audience_gender_split_other_percent: gender.other,
        campaign_start_date: formatDateCsv(campaignStart),
        campaign_end_date: formatDateCsv(campaignEnd),
        creator_marked_completed_at: getCreatorMarkedCompletedAt(creator),
      };
    });

    const csvContent = generateCSV(rows, headers);
    const campaignName = sanitizeFilename(campaign?.campaign_title || campaign?.title || "campaign");
    const dateStr = formatUtcYyyymmdd(new Date());
    const filename = `${campaignName}_completed_creators_${dateStr}.csv`;
    downloadCSV(csvContent, filename);
  }, []);

  return {
    exportCompletedCreators,
  };
}

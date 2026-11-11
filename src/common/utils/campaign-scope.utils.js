import { CAMPAIGN_TYPE_OPTIONS } from "@/common/constants/options.constant";
import { COLLABORATION_TYPE } from "@/common/constants/campaign.constant";
import {
  findDemoCampaign,
  isDemoCampaign,
  pickDefaultBrandCampaign,
} from "@/common/utils/demo-campaign.util";

export function getCampaignTypeLabel(campaign) {
  const type = campaign?.campaign_type;
  const match = CAMPAIGN_TYPE_OPTIONS.find((option) => option.value === type);
  if (match) return match.label;
  if (!type) return "Campaign";
  return String(type)
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getCampaignCreatorCount(campaign) {
  if (!campaign) return 0;
  const candidates = [
    campaign.creators_count,
    campaign.creator_count,
    campaign.hired_creators_count,
    campaign.total_creators,
    campaign.contracts_count,
    Array.isArray(campaign.contracts) ? campaign.contracts.length : null,
    Array.isArray(campaign.creators) ? campaign.creators.length : null,
  ];
  for (const value of candidates) {
    const n = Number(value);
    if (Number.isFinite(n) && n >= 0) return n;
  }
  return 0;
}

export function formatCampaignScopeMeta(campaign) {
  const typeLabel = getCampaignTypeLabel(campaign);
  const count = getCampaignCreatorCount(campaign);
  const creatorLabel = count === 1 ? "1 creator" : `${count} creators`;
  return `${typeLabel} · ${creatorLabel}`;
}

export function isMultiCreatorCampaign(campaign) {
  const type =
    campaign?.collaboration_type ||
    campaign?.collaborationType ||
    COLLABORATION_TYPE.MULTI_CREATOR;
  return type === COLLABORATION_TYPE.MULTI_CREATOR;
}

export function sortCampaignsNewestFirst(campaigns = []) {
  return [...(campaigns || [])].sort((a, b) => {
    const aTime = new Date(a?.created_at || a?.createdAt || 0).getTime();
    const bTime = new Date(b?.created_at || b?.createdAt || 0).getTime();
    return bTime - aTime;
  });
}

export function partitionCampaignScopeList(campaigns = []) {
  const list = (campaigns || []).filter((c) => c && !c.is_deleted);
  const demo = findDemoCampaign(list);
  const multi = sortCampaignsNewestFirst(
    list.filter((c) => isMultiCreatorCampaign(c) && !isDemoCampaign(c))
  );
  return { multiCampaigns: multi, demoCampaign: demo };
}

export function pickDefaultCampaignScopeSelection(campaigns = []) {
  const { multiCampaigns, demoCampaign } = partitionCampaignScopeList(campaigns);
  const defaultMulti = pickDefaultBrandCampaign(campaigns, multiCampaigns);
  if (defaultMulti && !isDemoCampaign(defaultMulti)) {
    return { mode: "multi", campaign: defaultMulti };
  }
  if (demoCampaign) {
    return { mode: "multi", campaign: demoCampaign };
  }
  if (defaultMulti) {
    return { mode: "multi", campaign: defaultMulti };
  }
  return { mode: "individual", campaign: null };
}

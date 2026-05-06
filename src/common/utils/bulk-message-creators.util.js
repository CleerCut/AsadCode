import { CREATOR_STATUS } from "@/common/constants/campaign.constant";

export function filterActiveCreatorsForBulk(creators, isIndividualMode) {
  if (!Array.isArray(creators)) return [];
  return creators.filter((row) => {
    const uid = row.creatorUserId || row.creator?.id;
    if (!uid) return false;
    const rowStatus = String(row.status ?? "").toUpperCase();
    if (rowStatus === CREATOR_STATUS.COMPLETED) return false;
    if (isIndividualMode) {
      const contractStatus = String(row.contract?.status ?? "").toUpperCase();
      if (contractStatus === CREATOR_STATUS.COMPLETED) return false;
    }
    return true;
  });
}

export function getCreatorUserIdForBulk(row) {
  return row.creatorUserId || row.creator?.id || null;
}

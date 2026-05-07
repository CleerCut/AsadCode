import { CREATOR_STATUS } from "@/common/constants/campaign.constant";

function platformKeysFromStats(platforms) {
  if (!platforms || typeof platforms !== "object") return [];
  return Object.keys(platforms).filter((k) => Boolean(k));
}

export function getCreatorUserIdForBulk(row) {
  if (!row || typeof row !== "object") return null;
  const nested =
    row.creatorUserId ??
    row.creator?.id ??
    (row.raw ? row.raw.creatorUserId ?? row.raw.creator?.id : null);
  return nested ?? null;
}

export function isCreatorEligibleForBulkMessage(row) {
  const status = row?.status ?? row?.application?.status;
  return status === CREATOR_STATUS.HIRED;
}

export function filterEligibleBulkMessageCreators(creators) {
  if (!Array.isArray(creators)) return [];
  return creators.filter(isCreatorEligibleForBulkMessage);
}

export function mapCreatorToBulkMessageRow(creator, index = 0) {
  const creatorUserId = getCreatorUserIdForBulk(creator);
  const name =
    creator.name ||
    `${creator.creator?.first_name || ""} ${creator.creator?.last_name || ""}`.trim() ||
    "Creator";
  const profileImage =
    creator.image ?? creator.creator?.creator_profile?.profile_photo_url ?? null;
  const platforms = platformKeysFromStats(creator.platforms);

  return {
    key: creatorUserId ? String(creatorUserId) : `creator-${index}`,
    creatorUserId,
    name,
    profileImage,
    platforms,
    status: creator.status,
    raw: creator,
  };
}

export function normalizeBulkMessageCreators(creators) {
  return filterEligibleBulkMessageCreators(creators).map((c, i) =>
    mapCreatorToBulkMessageRow(c, i)
  );
}

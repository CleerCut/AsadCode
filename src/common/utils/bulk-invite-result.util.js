export function resolveCreatorDisplayName(creator) {
  if (!creator || typeof creator !== "object") return "Unknown creator";
  const fromParts = [creator.first_name, creator.last_name].filter(Boolean).join(" ").trim();
  if (fromParts) return fromParts;
  if (typeof creator.name === "string" && creator.name.trim()) return creator.name.trim();
  return "Unknown creator";
}

export function normalizeBulkInviteResponse(apiPayload) {
  const inner = apiPayload?.data !== undefined ? apiPayload.data : apiPayload;
  const sent = typeof inner?.success === "number" ? inner.success : 0;
  const failed = typeof inner?.failed === "number" ? inner.failed : 0;
  const results = Array.isArray(inner?.results) ? inner.results : [];
  return { sent, failed, results };
}

export function buildBulkInviteResultRows(apiPayload, creators) {
  const { sent, failed, results } = normalizeBulkInviteResponse(apiPayload);
  const byId = new Map();
  if (Array.isArray(creators)) {
    creators.forEach((c) => {
      if (c?.id != null) byId.set(String(c.id), c);
    });
  }
  const rows = results.map((item) => {
    const creatorId = item?.creator_id != null ? String(item.creator_id) : "";
    const creator = byId.get(creatorId);
    const displayName = creator
      ? resolveCreatorDisplayName(creator)
      : creatorId
        ? `Creator (${creatorId.slice(0, 8)}…)`
        : "Unknown creator";
    const success = item?.success === true;
    let detailMessage = "";
    if (!success && typeof item?.error === "string" && item.error.trim()) {
      detailMessage = item.error.trim();
    } else if (success && item?.invitation_id) {
      detailMessage = "Invitation sent";
    }
    return {
      creatorId,
      displayName,
      success,
      detailMessage,
    };
  });
  const successfulRows = rows.filter((r) => r.success);
  const failedRows = rows.filter((r) => !r.success);
  return {
    summarySent: sent,
    summaryFailed: failed,
    successfulRows,
    failedRows,
    rows,
  };
}

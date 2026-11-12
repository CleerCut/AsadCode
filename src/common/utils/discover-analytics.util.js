export const DISCOVER_EVENTS = Object.freeze({
  OPENED_FROM_RAIL: "discover_opened_from_rail",
  SEARCH_PERFORMED: "discover_search_performed",
  FILTER_APPLIED: "discover_filter_applied",
  CREATOR_SAVED_TO_SHORTLIST: "discover_creator_saved_to_shortlist",
  INVITE_TO_APPLY_CLICKED: "discover_invite_to_apply_clicked",
  START_NEW_CAMPAIGN_CLICKED: "discover_start_new_campaign_clicked",
});

export function trackDiscoverEvent(eventName, properties = {}) {
  if (typeof window === "undefined" || !eventName) return;

  const payload = {
    event: eventName,
    source: "discover_plus",
    ...properties,
    timestamp: new Date().toISOString(),
  };

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push(payload);
  }

  if (typeof window.dispatchEvent === "function") {
    window.dispatchEvent(new CustomEvent("cleercut:analytics", { detail: payload }));
  }
}

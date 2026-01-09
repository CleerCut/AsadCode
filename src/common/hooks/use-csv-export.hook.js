import { useCallback } from "react";
import { generateCSV, downloadCSV, sanitizeFilename } from "@/common/utils/csv-export.util";

/**
 * Hook for exporting completed creators to CSV
 */
export const useCSVExport = () => {
  /**
   * Get main platform handle from creator's social platforms
   * @param {Object} creator - Creator object
   * @returns {string} - Main platform handle or empty string
   */
  const getMainPlatformHandle = (creator) => {
    const socialPlatforms = creator?.creator?.creator_profile?.social_platforms;
    if (!socialPlatforms || !Array.isArray(socialPlatforms) || socialPlatforms.length === 0) {
      return "";
    }
    // Use first platform's username
    const firstPlatform = socialPlatforms[0];
    return firstPlatform?.username || "";
  };

  /**
   * Get deliverables list from contract (comma-separated)
   * @param {Object} creator - Creator object with contract
   * @param {Object} campaign - Campaign object
   * @returns {string} - Comma-separated deliverables or empty string
   */
  const getDeliverablesList = (creator, campaign) => {
    // Try to get from contract first (check both camelCase and snake_case)
    const contract = creator?.contract;
    if (contract) {
      const contentFormat = contract.contentFormat || contract.content_format;
      if (contentFormat) {
        if (typeof contentFormat === "string") {
          return contentFormat;
        }
        if (Array.isArray(contentFormat)) {
          return contentFormat.join(", ");
        }
      }
    }

    // Fallback to campaign deliverables
    const campaignDeliverables = campaign?.deliverables;
    if (campaignDeliverables) {
      if (typeof campaignDeliverables === "string") {
        return campaignDeliverables;
      }
      if (Array.isArray(campaignDeliverables)) {
        return campaignDeliverables.join(", ");
      }
    }

    return "";
  };

  /**
   * Get payment type from campaign compensation_type
   * @param {Object} creator - Creator object with campaign
   * @param {Object} campaign - Campaign object
   * @returns {string} - Payment type (paid, gifted, affiliate)
   */
  const getPaymentType = (creator, campaign) => {
    // Try contract compensation type first (check both camelCase and snake_case)
    const contract = creator?.contract;
    if (contract) {
      const contractCompensationType = contract.compensationType || contract.compensation_type;
      if (contractCompensationType) {
        const typeMap = {
          PAID: "paid",
          GIFTED_PRODUCT: "gifted",
          AFFILIATE: "affiliate",
        };
        return typeMap[contractCompensationType] || contractCompensationType.toLowerCase();
      }
    }

    // Fallback to campaign compensation type
    const compensationType = campaign?.compensation_type || creator?.campaign?.compensation_type;
    if (!compensationType) return "";

    // Map compensation types
    const typeMap = {
      PAID: "paid",
      GIFTED_PRODUCT: "gifted",
      AFFILIATE: "affiliate",
    };

    return typeMap[compensationType] || compensationType.toLowerCase();
  };

  /**
   * Get usage rights summary from contract
   * @param {Object} creator - Creator object with contract
   * @returns {string} - Usage rights or empty string
   */
  const getUsageRightsSummary = (creator) => {
    const contract = creator?.contract;
    if (!contract) return "";
    const usageRights = contract.usageRights || contract.usage_rights;
    return usageRights || "";
  };

  /**
   * Get exclusivity summary from contract
   * @param {Object} creator - Creator object with contract
   * @returns {string} - Exclusivity clause or empty string
   */
  const getExclusivitySummary = (creator) => {
    const contract = creator?.contract;
    if (!contract) return "";
    const exclusivityClause = contract.exclusivityClause || contract.exclusivity_clause;
    return exclusivityClause || "";
  };

  /**
   * Format date for CSV (YYYY-MM-DD or empty)
   * @param {Date|string} date - Date to format
   * @returns {string} - Formatted date or empty string
   */
  const formatDate = (date) => {
    if (!date) return "";
    try {
      const d = new Date(date);
      if (isNaN(d.getTime())) return "";
      const year = d.getUTCFullYear();
      const month = String(d.getUTCMonth() + 1).padStart(2, "0");
      const day = String(d.getUTCDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } catch {
      return "";
    }
  };

  /**
   * Export completed creators to CSV
   * @param {Array} creators - Array of creator objects
   * @param {Object} campaign - Campaign object
   */
  const exportCompletedCreators = useCallback((creators, campaign) => {
    if (!creators || creators.length === 0) {
      console.warn("No creators to export");
      return;
    }

    if (!campaign) {
      console.warn("No campaign selected");
      return;
    }

    // Define CSV headers
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

    // Transform creators to CSV rows
    const rows = creators.map((creator) => {
      // Try to find contract from creator or campaign contracts
      // Contract might be on creator.contract or in campaign.contracts array
      const creatorId = creator?.creatorUserId || creator?.creator?.id;
      let contract = creator?.contract;

      // If not found on creator, try to find in campaign contracts
      // Contract entity has creator_id field (snake_case)
      if (!contract && campaign?.contracts && Array.isArray(campaign.contracts)) {
        contract = campaign.contracts.find((c) => {
          // Check both snake_case and camelCase, and also check nested creator relation
          const contractCreatorId = c.creator_id || c.creatorId || c.creator?.id;
          return contractCreatorId === creatorId;
        });
      }

      const creatorProfile = creator?.creator?.creator_profile;

      // Get payment amount from contract (check both camelCase and snake_case)
      const paymentAmount = contract
        ? contract.totalCompensation || contract.total_compensation || 0
        : creator?.totalSpent || creator?.total_spent || 0;

      return {
        campaign_id: campaign?.id || "",
        campaign_name: campaign?.campaign_title || "",
        creator_id: creator?.creatorUserId || creator?.creator?.id || "",
        creator_name: creator?.name || "",
        creator_handle_main_platform: getMainPlatformHandle(creator),
        creator_country: creator?.creator?.country || "",
        creator_city: creator?.creator?.city || "",
        deliverables_list: getDeliverablesList(creator, campaign),
        payment_type: getPaymentType(creator, campaign),
        payment_amount: paymentAmount,
        currency: "USD",
        usage_rights_summary: getUsageRightsSummary(creator),
        exclusivity_summary: getExclusivitySummary(creator),
        total_views: 0, // No API yet
        total_engagement: 0, // No API yet
        engagement_rate: 0, // No API yet
        cost_per_engagement: 0, // No API yet
        audience_primary_country: creatorProfile?.audience_countries?.[0] || "",
        audience_primary_age_range: creatorProfile?.audience_age_ranges?.[0] || "",
        audience_gender_split_female_percent: "", // No API yet
        audience_gender_split_male_percent: "", // No API yet
        audience_gender_split_other_percent: "", // No API yet
        campaign_start_date: formatDate(campaign?.created_at),
        campaign_end_date: formatDate(campaign?.completed_date),
        creator_marked_completed_at: formatDate(creator?.completed_at),
      };
    });

    // Generate CSV content
    const csvContent = generateCSV(rows, headers);

    // Generate filename with format: campaign-name_completed-creators_YYYY-MM-DD.csv
    const campaignName = sanitizeFilename(campaign?.campaign_title || "campaign");
    const dateStr = formatDate(new Date()); // Use formatDate to get YYYY-MM-DD format
    const filename = `${campaignName}_completed-creators_${dateStr}.csv`;

    // Download CSV
    downloadCSV(csvContent, filename);
  }, []);

  return {
    exportCompletedCreators,
  };
};

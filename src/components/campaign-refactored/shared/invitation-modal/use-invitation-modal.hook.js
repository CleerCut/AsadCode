import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  sendBulkInvitations,
  sendInvitation,
} from "@/provider/features/invitation/invitation.slice";
import { COLLABORATION_TYPE } from "@/common/constants/campaign.constant";
import { buildBulkInviteResultRows } from "@/common/utils/bulk-invite-result.util";

const CAMPAIGN_SKELETON_PLACEHOLDERS = [
  "campaign-skeleton-0",
  "campaign-skeleton-1",
  "campaign-skeleton-2",
  "campaign-skeleton-3",
];

function useInvitationModal({
  isOpen,
  onClose,
  selectedCreator,
  selectedCreators = [],
  onInviteSent,
}) {
  const dispatch = useDispatch();
  const {
    isLoading: isSingleSending,
  } = useSelector((state) => state.invitation?.sendInvitation || {});
  const { isLoading: isBulkSending } = useSelector(
    (state) => state.invitation?.sendBulkInvitations || {}
  );
  const isSending = Boolean(isSingleSending || isBulkSending);

  const [customMessage, setCustomMessage] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [invitationType, setInvitationType] = useState(COLLABORATION_TYPE.MULTI_CREATOR);
  const [bulkInviteSummary, setBulkInviteSummary] = useState(null);

  const validSelectedCreators = useMemo(
    () => (Array.isArray(selectedCreators) ? selectedCreators.filter(Boolean) : []),
    [selectedCreators]
  );

  const isBulkMode = validSelectedCreators.length > 1;

  const invitationTypeMultiSelected = invitationType === COLLABORATION_TYPE.MULTI_CREATOR;
  const invitationTypeIndividualSelected =
    invitationType === COLLABORATION_TYPE.INDIVIDUAL_CREATOR;

  const bulkInviteRows = useMemo(() => {
    if (!bulkInviteSummary?.apiPayload) {
      return null;
    }
    return buildBulkInviteResultRows(
      bulkInviteSummary.apiPayload,
      Array.isArray(bulkInviteSummary.creators) ? bulkInviteSummary.creators : []
    );
  }, [bulkInviteSummary]);

  const bulkInviteSummaryTitle = useMemo(() => {
    if (!bulkInviteRows) return "";
    const sent = bulkInviteRows.summarySent;
    const failed = bulkInviteRows.summaryFailed;
    const total = sent + failed;
    if (failed === 0) {
      return `${sent} ${sent === 1 ? "invitation" : "invitations"} sent`;
    }
    if (sent === 0) {
      return `No invitations sent (${failed} of ${total})`;
    }
    return `${sent} of ${total} invitations sent`;
  }, [bulkInviteRows]);

  const bulkInviteSummaryDescription = useMemo(() => {
    if (!bulkInviteRows) return "";
    const sent = bulkInviteRows.summarySent;
    const failed = bulkInviteRows.summaryFailed;
    if (failed === 0) {
      return "Each person below has a new invite for this campaign.";
    }
    if (sent === 0) {
      return "See the list below for each creator and the reason no invite could be sent.";
    }
    return "Successful invites are listed first; creators who were not invited and why appear after.";
  }, [bulkInviteRows]);

  const creatorHeading = useMemo(() => {
    if (isBulkMode) {
      return `${validSelectedCreators.length} creators selected`;
    }
    if (selectedCreator?.first_name && selectedCreator?.last_name) {
      return `${selectedCreator.first_name} ${selectedCreator.last_name}`;
    }
    return selectedCreator?.name || "Creator";
  }, [isBulkMode, validSelectedCreators.length, selectedCreator]);

  const creatorSubheading = useMemo(() => {
    if (isBulkMode) {
      return "Invites will be sent to selected creators only.";
    }
    return selectedCreator?.niches?.map((niche) => niche).join(", ") || "N/A";
  }, [isBulkMode, selectedCreator]);

  const customMessagePlaceholder = useMemo(() => {
    return invitationTypeIndividualSelected
      ? "Start the conversation... (Required)"
      : "Add a personal message to your invitation...";
  }, [invitationTypeIndividualSelected]);

  const resetForm = useCallback(() => {
    setCustomMessage("");
    setSelectedCampaign(null);
  }, []);

  const handleCustomMessageChange = useCallback((e) => {
    setCustomMessage(e.target.value);
  }, []);

  const handleCampaignSelect = useCallback((campaign) => {
    setSelectedCampaign(campaign);
  }, []);

  const handleModalClose = useCallback(() => {
    if (!isSending) {
      resetForm();
      setInvitationType(COLLABORATION_TYPE.MULTI_CREATOR);
      setBulkInviteSummary(null);
      onClose();
    }
  }, [isSending, onClose, resetForm]);

  const handleSendInvitation = useCallback(
    async (creator, onSuccess, collaborationType) => {
      if (!creator) return;

      if (collaborationType === COLLABORATION_TYPE.MULTI_CREATOR && !selectedCampaign) {
        return;
      }
      if (collaborationType === COLLABORATION_TYPE.INDIVIDUAL_CREATOR && !customMessage.trim()) {
        return;
      }

      const invitationData = {
        creator_id: creator.id,
        collaboration_type: collaborationType,
        campaign_id:
          collaborationType === COLLABORATION_TYPE.MULTI_CREATOR ? selectedCampaign.id : null,
        custom_message: customMessage.trim() || null,
      };

      const result = await dispatch(sendInvitation(invitationData)).unwrap();

      if (result?.success && onSuccess) {
        onSuccess(creator, selectedCampaign);
        resetForm();
      }
    },
    [customMessage, dispatch, resetForm, selectedCampaign]
  );

  const handleSendBulkInvitations = useCallback(
    async (creators, collaborationType) => {
      if (!Array.isArray(creators) || creators.length === 0) return null;

      if (collaborationType === COLLABORATION_TYPE.MULTI_CREATOR && !selectedCampaign) {
        return null;
      }
      if (collaborationType === COLLABORATION_TYPE.INDIVIDUAL_CREATOR && !customMessage.trim()) {
        return null;
      }

      const creatorIds = creators.map((creator) => creator?.id).filter(Boolean);
      if (creatorIds.length === 0) return null;

      const invitationData = {
        creator_ids: creatorIds,
        collaboration_type: collaborationType,
        campaign_id:
          collaborationType === COLLABORATION_TYPE.MULTI_CREATOR
            ? selectedCampaign?.id || null
            : null,
        custom_message: customMessage.trim() || null,
      };

      const result = await dispatch(sendBulkInvitations(invitationData)).unwrap();

      if (result?.success) {
        resetForm();
        return result;
      }
      return null;
    },
    [customMessage, dispatch, resetForm, selectedCampaign]
  );

  const handleSubmit = useCallback(
    async (onInviteClose) => {
      const creatorsList = validSelectedCreators;
      const isBulk = creatorsList.length > 1;

      if (isBulk) {
        const bulkApiResult = await handleSendBulkInvitations(creatorsList, invitationType);
        if (bulkApiResult?.success && onInviteSent) {
          onInviteSent(creatorsList, selectedCampaign, bulkApiResult);
        }
        if (!bulkApiResult?.success && onInviteClose) {
          onInviteClose();
        }
        return bulkApiResult?.success
          ? { bulk: true, apiResult: bulkApiResult, creatorsList }
          : null;
      }

      await handleSendInvitation(
        selectedCreator || creatorsList[0],
        () => {
          if (onInviteSent) {
            onInviteSent(selectedCreator || creatorsList[0], selectedCampaign);
          }
        },
        invitationType
      );

      if (onInviteClose) onInviteClose();
      return null;
    },
    [
      handleSendBulkInvitations,
      handleSendInvitation,
      invitationType,
      onInviteSent,
      selectedCampaign,
      selectedCreator,
      validSelectedCreators,
    ]
  );

  const confirmSendInvitation = useCallback(async () => {
    const outcome = await handleSubmit(handleModalClose);
    if (
      outcome?.bulk &&
      outcome.apiResult != null &&
      Array.isArray(outcome.creatorsList)
    ) {
      setBulkInviteSummary({
        apiPayload: outcome.apiResult,
        creators: outcome.creatorsList,
      });
    }
  }, [handleModalClose, handleSubmit]);

  const handleInvitationTypeChange = useCallback(
    (type) => {
      setInvitationType(type);
      setCustomMessage("");
      if (selectedCampaign) {
        handleCampaignSelect(null);
      }
    },
    [handleCampaignSelect, selectedCampaign]
  );

  const selectMultiCreatorInvitationType = useCallback(() => {
    handleInvitationTypeChange(COLLABORATION_TYPE.MULTI_CREATOR);
  }, [handleInvitationTypeChange]);

  const selectIndividualCollaborationInvitationType = useCallback(() => {
    handleInvitationTypeChange(COLLABORATION_TYPE.INDIVIDUAL_CREATOR);
  }, [handleInvitationTypeChange]);

  const canSubmit = useCallback(() => {
    const hasTargetCreator =
      (isBulkMode && validSelectedCreators.length > 0) || (!isBulkMode && Boolean(selectedCreator));
    if (!hasTargetCreator) {
      return false;
    }
    if (invitationType === COLLABORATION_TYPE.MULTI_CREATOR) {
      return selectedCampaign !== null;
    }
    return customMessage.trim().length > 0;
  }, [
    customMessage,
    invitationType,
    isBulkMode,
    selectedCampaign,
    selectedCreator,
    validSelectedCreators.length,
  ]);

  useEffect(() => {
    if (!isOpen) {
      setBulkInviteSummary(null);
    }
  }, [isOpen]);

  const showBulkInviteResults = Boolean(bulkInviteRows);
  const modalTitle = showBulkInviteResults ? "Invite results" : "Invite to Apply";
  const modalSize = showBulkInviteResults ? "lg" : "md";
  const invitePrimaryButtonText = isBulkMode ? "Send Invites" : "Send Invitation";
  const submitDisabled = isSending || !canSubmit();

  return {
    CAMPAIGN_SKELETON_PLACEHOLDERS,
    selectMultiCreatorInvitationType,
    selectIndividualCollaborationInvitationType,
    modalTitle,
    modalSize,
    showBulkInviteResults,
    bulkInviteRows,
    bulkInviteSummaryTitle,
    bulkInviteSummaryDescription,
    handleModalClose,
    confirmSendInvitation,
    invitePrimaryButtonText,
    isBulkMode,
    isSending,
    submitDisabled,
    creatorHeading,
    creatorSubheading,
    showBulkAvatarIcon: isBulkMode,
    showCreatorProfileImage: Boolean(!isBulkMode && selectedCreator?.profileImage),
    selectedCampaign,
    handleCampaignSelect,
    customMessage,
    handleCustomMessageChange,
    customMessagePlaceholder,
    customMessageRequired: invitationTypeIndividualSelected,
    invitationTypeMultiSelected,
    invitationTypeIndividualSelected,
  };
}

export default useInvitationModal;

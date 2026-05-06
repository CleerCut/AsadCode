import {
  getCreatorUserIdForBulk,
} from "@/common/utils/bulk-message-creators.util";
import { sendBulkCampaignMessages } from "@/provider/features/chat/chat.slice";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const MESSAGE_MIN = 5;
const MESSAGE_MAX = 2000;

export function useBulkMessageModal({
  show,
  onClose,
  campaignId,
  activeCreators,
  getPlatformIcon,
  getPlatformColor,
}) {
  const dispatch = useDispatch();
  const bulkSending = useSelector((state) => state.chat?.bulkCampaignMessages ?? {});

  const [messageText, setMessageText] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [topError, setTopError] = useState("");
  const [bodyError, setBodyError] = useState("");
  const [partialError, setPartialError] = useState("");
  const [failedHighlightIds, setFailedHighlightIds] = useState([]);

  const creatorRows = useMemo(() => {
    if (!Array.isArray(activeCreators)) return [];
    return activeCreators.map((row) => {
      const creatorUserId = getCreatorUserIdForBulk(row);
      const name = row.name || "Creator";
      const image = row.image || "";
      const platforms = row.platforms || {};
      const platformEntries = Object.entries(platforms).filter(
        ([p]) => p !== "twitter" && p !== "facebook"
      );
      return {
        creatorUserId,
        name,
        image,
        platformEntries,
      };
    }).filter((r) => r.creatorUserId);
  }, [activeCreators]);

  const creatorsKey = useMemo(
    () => creatorRows.map((r) => r.creatorUserId).join("|"),
    [creatorRows]
  );

  useEffect(() => {
    if (!show) {
      return;
    }
    setMessageText("");
    setTopError("");
    setBodyError("");
    setPartialError("");
    setFailedHighlightIds([]);
    setSelectedIds(creatorRows.map((r) => r.creatorUserId));
  }, [show, creatorsKey, creatorRows]);

  const selectedCount = selectedIds.length;
  const totalCount = creatorRows.length;
  const allSelected = totalCount > 0 && selectedCount === totalCount;
  const someSelected = selectedCount > 0 && selectedCount < totalCount;

  const handleToggleCreator = useCallback((id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const handleToggleSelectAll = useCallback(
    (checked) => {
      if (checked) {
        setSelectedIds(creatorRows.map((r) => r.creatorUserId));
      } else {
        setSelectedIds([]);
      }
    },
    [creatorRows]
  );

  const handleSend = useCallback(() => {
    setTopError("");
    setBodyError("");
    setPartialError("");
    setFailedHighlightIds([]);

    if (selectedIds.length === 0) {
      setTopError("Select at least one creator to send a bulk message.");
      return;
    }

    const trimmed = messageText.trim();
    if (trimmed.length < MESSAGE_MIN) {
      setBodyError("Please enter a message before sending.");
      return;
    }

    if (trimmed.length > MESSAGE_MAX) {
      setBodyError(`Message must be at most ${MESSAGE_MAX} characters.`);
      return;
    }

    if (!campaignId) {
      setTopError("Campaign is missing. Try selecting the campaign again.");
      return;
    }

    dispatch(
      sendBulkCampaignMessages({
        campaignId,
        creatorUserIds: selectedIds,
        content: trimmed,
      })
    ).then((action) => {
      if (sendBulkCampaignMessages.fulfilled.match(action)) {
        const { sent, failed, failedCreatorIds, total } = action.payload;
        if (failed === 0 && sent === total) {
          if (typeof window !== "undefined" && window.enqueueSnackbar) {
            window.enqueueSnackbar(`Bulk message sent to ${sent} creators.`, {
              variant: "success",
            });
          }
          onClose();
          return;
        }
        if (sent > 0 && failed > 0) {
          setPartialError(
            `Message sent to ${sent} creators. Failed for ${failed} creators. Please try again or contact support if this continues.`
          );
          setFailedHighlightIds(failedCreatorIds || []);
          return;
        }
        setTopError("We could not send this message. Please try again.");
        setFailedHighlightIds(failedCreatorIds || []);
        return;
      }
      if (sendBulkCampaignMessages.rejected.match(action)) {
        const msg =
          action.payload?.message ||
          action.error?.message ||
          "We could not send this message. Please try again.";
        if (
          msg.includes("Select at least one creator") ||
          msg.includes("Please enter a message")
        ) {
          if (msg.includes("message")) {
            setBodyError(msg);
          } else {
            setTopError(msg);
          }
        } else {
          setTopError(msg);
        }
      }
    });
  }, [campaignId, dispatch, messageText, onClose, selectedIds]);

  const selectAllRefProps = useMemo(
    () => ({
      checked: allSelected,
      indeterminate: someSelected,
    }),
    [allSelected, someSelected]
  );

  return {
    messageText,
    setMessageText,
    creatorRows,
    selectedIds,
    selectedCount,
    totalCount,
    handleToggleCreator,
    handleToggleSelectAll,
    selectAllRefProps,
    handleSend,
    topError,
    bodyError,
    partialError,
    failedHighlightIds,
    isSending: bulkSending.isLoading,
    getPlatformIcon,
    getPlatformColor,
    MESSAGE_MIN,
    MESSAGE_MAX,
  };
}

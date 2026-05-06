import { useCallback, useMemo, useState } from "react";

export default function useShortlistView({
  getSortedCreators,
  onBulkInviteClick,
  onRemoveManyFromShortlist,
}) {
  const sortedCreators = useMemo(() => getSortedCreators(), [getSortedCreators]);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [selectedCreatorIds, setSelectedCreatorIds] = useState([]);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  const selectedCreators = useMemo(() => {
    if (!Array.isArray(sortedCreators) || sortedCreators.length === 0) return [];
    const ids = new Set(selectedCreatorIds);
    return sortedCreators.filter((creator) => ids.has(creator.id));
  }, [sortedCreators, selectedCreatorIds]);

  const selectedCount = selectedCreatorIds.length;
  const hasSelection = selectedCount > 0;

  const selectAll = useCallback(() => {
    const allIds = sortedCreators.map((creator) => creator.id).filter(Boolean);
    setSelectedCreatorIds(allIds);
    setIsBulkMode(true);
  }, [sortedCreators]);

  const clearSelection = useCallback(() => {
    setSelectedCreatorIds([]);
    setIsBulkMode(false);
    setShowRemoveConfirm(false);
  }, []);

  const enterBulkMode = useCallback(() => {
    setIsBulkMode(true);
    setSelectedCreatorIds([]);
  }, []);

  const selectAllCreators = useCallback(() => {
    selectAll();
  }, [selectAll]);

  const toggleCreatorSelection = useCallback((creator) => {
    const creatorId = creator?.id;
    if (!creatorId) return;
    setSelectedCreatorIds((prev) =>
      prev.includes(creatorId) ? prev.filter((id) => id !== creatorId) : [...prev, creatorId]
    );
  }, []);

  const handleInviteSelected = useCallback(() => {
    if (!hasSelection) return;
    onBulkInviteClick?.(selectedCreators, clearSelection);
  }, [clearSelection, hasSelection, onBulkInviteClick, selectedCreators]);

  const confirmRemoveSelected = useCallback(async () => {
    if (!hasSelection || typeof onRemoveManyFromShortlist !== "function") return;
    const removedCount = await onRemoveManyFromShortlist(selectedCreatorIds);
    if (removedCount > 0) {
      clearSelection();
      return;
    }
    setShowRemoveConfirm(false);
  }, [clearSelection, hasSelection, onRemoveManyFromShortlist, selectedCreatorIds]);

  return {
    sortedCreators,
    isBulkMode,
    selectedCreatorIds,
    selectedCount,
    hasSelection,
    showRemoveConfirm,
    setShowRemoveConfirm,
    enterBulkMode,
    selectAllCreators,
    clearSelection,
    toggleCreatorSelection,
    handleInviteSelected,
    confirmRemoveSelected,
  };
}

import { useState, useEffect } from "react";

const useShortlistView = (sortedCreators, onBulkInvite, onRemoveFromShortlist) => {
  const [selectedCreatorIds, setSelectedCreatorIds] = useState(new Set());
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  // Reset selection when creators list changes (e.g., switching shortlists)
  useEffect(() => {
    setSelectedCreatorIds(new Set());
  }, [sortedCreators.length]);

  const selectedCount = selectedCreatorIds.size;

  const handleCreatorToggle = (creatorId) => {
    setSelectedCreatorIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(creatorId)) {
        newSet.delete(creatorId);
      } else {
        newSet.add(creatorId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    const allIds = new Set(sortedCreators.map((creator) => creator.id));
    setSelectedCreatorIds(allIds);
  };

  const handleClearSelection = () => {
    setSelectedCreatorIds(new Set());
  };

  const handleBulkInvite = () => {
    if (selectedCount === 0) return;
    const selectedCreators = sortedCreators.filter((creator) => selectedCreatorIds.has(creator.id));
    onBulkInvite(selectedCreators, () => {
      setSelectedCreatorIds(new Set());
    });
  };

  const handleBulkRemove = () => {
    if (selectedCount === 0) return;
    setShowRemoveConfirm(true);
  };

  const confirmBulkRemove = async () => {
    const creatorIds = Array.from(selectedCreatorIds);
    for (const creatorId of creatorIds) {
      await onRemoveFromShortlist(creatorId);
    }
    setSelectedCreatorIds(new Set());
    setShowRemoveConfirm(false);
  };

  const handleCreatorClick = (creator) => {
    handleCreatorToggle(creator.id);
  };

  return {
    selectedCreatorIds,
    selectedCount,
    showRemoveConfirm,
    setShowRemoveConfirm,
    handleCreatorToggle,
    handleSelectAll,
    handleClearSelection,
    handleBulkInvite,
    handleBulkRemove,
    confirmBulkRemove,
    handleCreatorClick,
  };
};

export default useShortlistView;

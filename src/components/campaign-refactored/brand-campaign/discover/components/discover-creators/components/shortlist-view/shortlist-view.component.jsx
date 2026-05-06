import CustomButton from "@/common/components/custom-button/custom-button.component";
import DeleteConfirmationModal from "@/common/components/delete-confirmation-modal/delete-confirmation-modal.component";
import { Trash2, X } from "lucide-react";
import ViewHeader from "../view-header/view-header.component";
import CreatorGrid from "../creator-grid/creator-grid.component";
import NotFound from "@/common/components/not-found/not-found.component";
import useShortlistView from "./use-shortlist-view.hook";

const ShortlistView = ({
  selectedShortlist,
  getSortedCreators,
  onBackClick,
  onCreatorPreview,
  onSaveToShortlist,
  onRemoveFromShortlist,
  onInviteClick,
  onBulkInviteClick,
  onRemoveManyFromShortlist,
}) => {
  const {
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
  } = useShortlistView({
    getSortedCreators,
    onBulkInviteClick,
    onRemoveManyFromShortlist,
  });

  return (
    <div className="space-y-4">
      <ViewHeader
        title={selectedShortlist.name}
        count={sortedCreators.length}
        showBackButton={true}
        onBackClick={onBackClick}
        rightAction={
          sortedCreators.length > 0 && !isBulkMode ? (
            <CustomButton
              text="Bulk Select"
              className="!h-8 !min-h-8 rounded-md border border-gray-300 bg-gray-200 px-3 text-xs font-medium text-gray-700"
              onClick={enterBulkMode}
            />
          ) : null
        }
      />
      {sortedCreators.length > 0 && isBulkMode ? (
        <div className="sticky top-0 z-10 pointer-events-none">
          <div className="relative p-2.5">
            <div
              className="pointer-events-none absolute inset-0 rounded-lg bg-white shadow-sm backdrop-blur"
              aria-hidden
            />
            <div className="relative flex flex-wrap items-center justify-between gap-2">
              <div className="pointer-events-auto flex flex-wrap items-center gap-2">
                <CustomButton
                  text="Select All"
                  className="!h-8 !min-h-8 rounded-md border border-gray-300 bg-gray-200 px-3 text-xs font-medium text-gray-700"
                  onClick={selectAllCreators}
                />
                <CustomButton
                  text="Invite to Apply"
                  className="!h-8 !min-h-8 rounded-md border border-gray-300 bg-gray-200 px-3 text-xs font-medium text-gray-700"
                  onClick={handleInviteSelected}
                  disabled={!hasSelection}
                />
              </div>
              <div className="pointer-events-auto flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                  {selectedCount} selected
                </span>
                <CustomButton
                  text="Remove from Shortlist"
                  className="!h-8 !min-h-8 rounded-md border border-gray-300 bg-gray-200 px-3 text-xs font-medium text-gray-700"
                  startIcon={<Trash2 className="h-3.5 w-3.5" />}
                  onClick={() => setShowRemoveConfirm(true)}
                  disabled={!hasSelection}
                />
                <CustomButton
                  text="Clear"
                  className="!h-8 !min-h-8 rounded-md border border-gray-300 bg-gray-200 px-3 text-xs font-medium text-gray-700"
                  startIcon={<X className="h-3.5 w-3.5" />}
                  onClick={clearSelection}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {sortedCreators.length === 0 ? (
        <NotFound
          title="No Creators Found"
          description="No creators found. Try adjusting your search or filters."
        />
      ) : (
        <CreatorGrid
          creators={sortedCreators}
          isShortlist={true}
          onCreatorPreview={onCreatorPreview}
          onSaveToShortlist={onSaveToShortlist}
          onRemoveFromShortlist={onRemoveFromShortlist}
          onInviteClick={onInviteClick}
          isBulkMode={isBulkMode}
          selectedCreatorIds={selectedCreatorIds}
          onCreatorSelectionToggle={toggleCreatorSelection}
        />
      )}
      <DeleteConfirmationModal
        id={selectedShortlist?.id}
        confirmationRef={null}
        openConfirmationPopup={showRemoveConfirm}
        setOpenConfirmationPopup={setShowRemoveConfirm}
        mainText={`Remove ${selectedCount} creators from ${selectedShortlist?.name}?`}
        mainStyling="text-center text-lg font-semibold text-gray-900"
        subText="This action removes selected creators from this shortlist."
        subStyling="text-center text-sm text-gray-600 mt-2"
        confirmText="Remove"
        closeText="Cancel"
        action={confirmRemoveSelected}
        type="danger"
      />
    </div>
  );
};

export default ShortlistView;

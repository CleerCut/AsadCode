import { Trash2, X, UserPlus } from "lucide-react";
import ViewHeader from "../headers/view-header.component";
import CreatorGrid from "../grid/creator-grid.component";
import NotFound from "@/common/components/not-found/not-found.component";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import Modal from "@/common/components/modal/modal.component";
import useShortlistView from "./use-shortlist-view.hook";

const ShortlistView = ({
  selectedShortlist,
  getSortedCreators,
  onBackClick,
  onCreatorPreview,
  onSaveToShortlist,
  onRemoveFromShortlist,
  onInviteClick,
  onBulkInvite,
  userCampaigns = [],
}) => {
  const sortedCreators = getSortedCreators();

  const {
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
  } = useShortlistView(sortedCreators, onBulkInvite, onRemoveFromShortlist);

  return (
    <div className="space-y-4">
      {/* Action Bar - Always visible, above header */}
      {sortedCreators.length > 0 && (
        <div className="sticky top-0 z-10 bg-white rounded-lg shadow-md border border-gray-200">
          <div className="px-3 sm:px-4 py-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
            {/* Left Section */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <CustomButton
                text="Select All"
                onClick={handleSelectAll}
                className="btn-secondary text-xs sm:text-sm"
              />
              <CustomButton
                text="Invite to Apply"
                onClick={handleBulkInvite}
                disabled={selectedCount === 0}
                startIcon={<UserPlus className="w-3 h-3 sm:w-4 sm:h-4" />}
                className="btn-secondary text-xs sm:text-sm"
              />
            </div>

            {/* Right Section */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="px-2 sm:px-3 py-1 sm:py-1.5 bg-primary/10 rounded-lg border border-primary/20">
                <span className="text-xs sm:text-sm font-semibold text-primary">
                  {selectedCount} selected
                </span>
              </div>
              <CustomButton
                text="Remove from Shortlist"
                onClick={handleBulkRemove}
                disabled={selectedCount === 0}
                startIcon={<Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />}
                className="btn-secondary text-xs sm:text-sm"
              />
              <CustomButton
                text="Clear"
                onClick={handleClearSelection}
                startIcon={<X className="w-3 h-3 sm:w-4 sm:h-4" />}
                className="btn-secondary text-xs sm:text-sm"
              />
            </div>
          </div>
        </div>
      )}

      <ViewHeader
        title={selectedShortlist.name}
        count={sortedCreators.length}
        showBackButton={true}
        onBackClick={onBackClick}
      />

      {sortedCreators.length === 0 ? (
        <NotFound
          title="No Creators Found"
          description="No creators found. Try adjusting your search or filters."
        />
      ) : (
        <CreatorGrid
          creators={sortedCreators}
          isShortlist={true}
          isBulkMode={true}
          selectedCreatorIds={selectedCreatorIds}
          onCreatorPreview={handleCreatorClick}
          onCreatorToggle={handleCreatorToggle}
          onSaveToShortlist={onSaveToShortlist}
          onRemoveFromShortlist={onRemoveFromShortlist}
          onInviteClick={onInviteClick}
        />
      )}

      {/* Remove Confirmation Modal */}
      <Modal
        title="Remove from Shortlist"
        show={showRemoveConfirm}
        onClose={() => setShowRemoveConfirm(false)}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Remove {selectedCount} creator{selectedCount !== 1 ? "s" : ""} from{" "}
            {selectedShortlist.name}?
          </p>
          <div className="flex justify-end gap-3">
            <CustomButton
              text="Cancel"
              onClick={() => setShowRemoveConfirm(false)}
              className="btn-secondary"
            />
            <CustomButton text="Remove" onClick={confirmBulkRemove} className="btn-primary" />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ShortlistView;

import ViewHeader from "../headers/view-header.component";
import CreatorGrid from "../grid/creator-grid.component";
import NotFound from "@/common/components/not-found/not-found.component";
import PredictedPerformancePanel from "../../../shortlist-view/predicted-performance-panel.component";

const ShortlistView = ({
  selectedShortlist,
  getSortedCreators,
  onBackClick,
  onCreatorPreview,
  onSaveToShortlist,
  onRemoveFromShortlist,
  onInviteClick,
}) => {
  const sortedCreators = getSortedCreators();
  const shortlistUsers = selectedShortlist?.users || [];

  return (
    <div className="space-y-4">
      <ViewHeader
        title={selectedShortlist.name}
        count={sortedCreators.length}
        showBackButton={true}
        onBackClick={onBackClick}
      />
      
      {/* Predicted Performance Panel */}
      {shortlistUsers.length > 0 && (
        <PredictedPerformancePanel shortlistUsers={shortlistUsers} />
      )}

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
        />
      )}
    </div>
  );
};

export default ShortlistView;


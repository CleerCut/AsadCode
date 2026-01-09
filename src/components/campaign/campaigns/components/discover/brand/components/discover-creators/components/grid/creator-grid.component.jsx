import CreatorCard from "@/components/campaign/campaigns/components/creator-card/creator-card.component";

const CreatorGrid = ({
  creators,
  isShortlist = false,
  isBulkMode = false,
  selectedCreatorIds = new Set(),
  onCreatorPreview,
  onCreatorToggle,
  onSaveToShortlist,
  onRemoveFromShortlist,
  onInviteClick,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {creators.map((creator) => (
        <CreatorCard
          key={creator.id}
          creator={creator}
          isShortlist={isShortlist}
          isBulkMode={isBulkMode}
          isSelected={selectedCreatorIds.has(creator.id)}
          onCreatorPreview={onCreatorPreview}
          onCreatorToggle={onCreatorToggle}
          onSaveToShortlist={onSaveToShortlist}
          onRemoveFromShortlist={onRemoveFromShortlist}
          onInviteClick={onInviteClick}
          tab="discover"
        />
      ))}
    </div>
  );
};

export default CreatorGrid;


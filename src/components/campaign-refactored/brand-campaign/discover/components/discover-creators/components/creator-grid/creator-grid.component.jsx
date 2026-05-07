import CreatorCard from "@/components/campaign-refactored/creator-card/creator-card.component";

const discoverGrid =
  "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-5 items-stretch gap-4";

const shortlistSplitGrid =
  "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 min-[1800px]:grid-cols-4 items-stretch gap-4";

const CreatorGrid = ({
  creators,
  isShortlist = false,
  shortlistSplitLayout = false,
  onCreatorPreview,
  onSaveToShortlist,
  onRemoveFromShortlist,
  onInviteClick,
}) => {
  const gridClass =
    isShortlist && shortlistSplitLayout ? shortlistSplitGrid : discoverGrid;

  return (
    <div className={gridClass}>
      {creators.map((creator) => (
        <div key={creator.id} className="flex h-full min-h-0">
          <CreatorCard
            creator={creator}
            creatorType={creator.creator_profile?.creator_type}
            isShortlist={isShortlist}
            onCreatorPreview={onCreatorPreview}
            onSaveToShortlist={onSaveToShortlist}
            onRemoveFromShortlist={onRemoveFromShortlist}
            onInviteClick={onInviteClick}
            tab="discover"
          />
        </div>
      ))}
    </div>
  );
};

export default CreatorGrid;

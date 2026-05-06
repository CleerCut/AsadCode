import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import Modal from "@/common/components/modal/modal.component";
import { CAMPAIGN_TYPE } from "@/common/constants/campaign.constant";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  RefreshCw,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import useInvitationModal from "./use-invitation-modal.hook";

const InvitationModal = ({
  isOpen,
  onClose,
  selectedCreator,
  selectedCreators = [],
  userCampaigns = [],
  isCampaignsLoading = false,
  onRefreshCampaigns,
  onInviteSent,
}) => {
  const {
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
    isBulkMode,
    isSending,
    submitDisabled,
    creatorHeading,
    creatorSubheading,
    showBulkAvatarIcon,
    showCreatorProfileImage,
    selectedCampaign,
    handleCampaignSelect,
    customMessage,
    handleCustomMessageChange,
    customMessagePlaceholder,
    customMessageRequired,
    invitationTypeMultiSelected,
    invitationTypeIndividualSelected,
    invitePrimaryButtonText,
  } = useInvitationModal({
    isOpen,
    onClose,
    selectedCreator,
    selectedCreators,
    onInviteSent,
  });

  return (
    <Modal show={isOpen} title={modalTitle} onClose={handleModalClose} size={modalSize}>
      {showBulkInviteResults ? (
        <div className="space-y-3 sm:space-y-4">
          <div className="rounded-lg bg-gray-50 px-2.5 py-2 text-left sm:px-3 sm:py-2.5">
            <p className="text-sm font-semibold text-gray-900 sm:text-base">
              {bulkInviteSummaryTitle}
            </p>
            <p className="mt-1 text-[10px] leading-snug text-gray-600 sm:text-xs">
              {bulkInviteSummaryDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            {bulkInviteRows.successfulRows.length > 0 && (
              <div className="min-w-0 rounded-lg border border-emerald-200 bg-emerald-50/70 p-2.5 sm:p-3">
                <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-900 sm:text-sm">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  Invitation sent ({bulkInviteRows.successfulRows.length})
                </div>
                <ul className="space-y-2">
                  {bulkInviteRows.successfulRows.map((row) => (
                    <li
                      key={`ok-${row.creatorId}`}
                      className="rounded-md bg-white px-2 py-1.5 text-left shadow-sm ring-1 ring-emerald-100 sm:px-2.5"
                    >
                      <p className="text-xs font-semibold text-gray-900 sm:text-sm">
                        {row.displayName}
                      </p>
                      <p className="text-[10px] text-emerald-800 sm:text-xs">{row.detailMessage}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {bulkInviteRows.failedRows.length > 0 && (
              <div className="min-w-0 rounded-lg border border-amber-200 bg-amber-50/70 p-2.5 sm:p-3">
                <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-amber-950 sm:text-sm">
                  <AlertCircle className="h-4 w-4 shrink-0 text-amber-700" />
                  Not sent ({bulkInviteRows.failedRows.length})
                </div>
                <ul className="space-y-2">
                  {bulkInviteRows.failedRows.map((row) => (
                    <li
                      key={`fail-${row.creatorId}`}
                      className="rounded-md bg-white px-2 py-1.5 text-left shadow-sm ring-1 ring-amber-100 sm:px-2.5"
                    >
                      <p className="text-xs font-semibold text-gray-900 sm:text-sm">
                        {row.displayName}
                      </p>
                      <p className="text-[10px] leading-snug text-amber-900 sm:text-xs">
                        {row.detailMessage}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <CustomButton
              text="Done"
              className="btn-primary w-full sm:w-auto sm:min-w-[106px]"
              onClick={handleModalClose}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center space-x-2.5 rounded-lg bg-gray-50 p-2 sm:space-x-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary">
              {showBulkAvatarIcon ? (
                <Users className="h-5 w-5 text-white" />
              ) : showCreatorProfileImage ? (
                <img
                  src={selectedCreator.profileImage}
                  alt="Creator"
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-5 w-5 text-white" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-xs font-medium text-gray-900 sm:text-sm">{creatorHeading}</h3>
              <p className="text-[10px] text-gray-500 sm:text-xs">{creatorSubheading}</p>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-gray-700">
              Select Invitation Type
            </label>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
              <button
                type="button"
                onClick={selectMultiCreatorInvitationType}
                className={`rounded-lg border-2 p-2.5 text-left transition-all duration-200 sm:p-3 ${
                  invitationTypeMultiSelected
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start gap-2">
                  <Users
                    className={`mt-0.5 h-5 w-5 shrink-0 ${
                      invitationTypeMultiSelected ? "text-primary" : "text-gray-400"
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="mb-1 text-[10px] font-medium text-gray-900 sm:text-xs">
                      Multi Creator Campaign
                    </h4>
                    <p className="text-[10px] text-gray-500 sm:text-xs">
                      Invite to an existing campaign
                    </p>
                  </div>
                  {invitationTypeMultiSelected && (
                    <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary">
                      <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
                    </div>
                  )}
                </div>
              </button>

              <button
                type="button"
                onClick={selectIndividualCollaborationInvitationType}
                className={`rounded-lg border-2 p-2.5 text-left transition-all duration-200 sm:p-3 ${
                  invitationTypeIndividualSelected
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start gap-2">
                  <UserPlus
                    className={`mt-0.5 h-5 w-5 shrink-0 ${
                      invitationTypeIndividualSelected ? "text-primary" : "text-gray-400"
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="mb-1 text-[10px] font-medium text-gray-900 sm:text-xs">
                      Individual Collaboration
                    </h4>
                    <p className="text-[10px] text-gray-500 sm:text-xs">One-off collaboration</p>
                  </div>
                  {invitationTypeIndividualSelected && (
                    <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary">
                      <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
                    </div>
                  )}
                </div>
              </button>
            </div>
          </div>

          {invitationTypeMultiSelected && (
            <div>
              <div className="mb-2 flex items-center justify-between gap-2">
                <label className="block text-xs font-medium text-gray-700">
                  Select Campaign ({userCampaigns.length} available)
                </label>
                <button
                  type="button"
                  onClick={onRefreshCampaigns}
                  disabled={isCampaignsLoading}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-50 hover:text-primary"
                  aria-label="Refresh campaigns"
                  title="Refresh campaigns"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isCampaignsLoading ? "animate-spin" : ""}`} />
                </button>
              </div>
              <div className="max-h-52 space-y-1.5 overflow-y-auto pr-1">
                {isCampaignsLoading ? (
                  CAMPAIGN_SKELETON_PLACEHOLDERS.map((skeletonKey) => (
                    <div key={skeletonKey} className="rounded-lg border border-gray-200 p-2.5">
                      <div className="h-3 w-3/4 rounded bg-gray-200 animate-pulse" />
                      <div className="mt-2 flex items-center gap-3">
                        <div className="h-2.5 w-28 rounded bg-gray-200 animate-pulse" />
                        <div className="h-2.5 w-14 rounded bg-gray-200 animate-pulse" />
                      </div>
                    </div>
                  ))
                ) : userCampaigns.length === 0 ? (
                  <div className="rounded-lg border-2 border-dashed border-gray-200 p-3 text-center">
                    <Calendar className="mx-auto mb-1 h-6 w-6 text-gray-400" />
                    <p className="text-xs font-medium text-gray-500">No active campaigns available</p>
                    <p className="mt-0.5 text-[10px] text-gray-400 sm:text-xs">
                      Create a campaign first to invite creators
                    </p>
                  </div>
                ) : (
                  userCampaigns.map((campaign) => (
                    <div
                      key={campaign.id}
                      className={`cursor-pointer rounded-lg border p-2.5 transition-all duration-200 ${
                        selectedCampaign?.id === campaign.id
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                      onClick={() => handleCampaignSelect(campaign)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h4 className="truncate text-[10px] font-medium leading-tight text-gray-900 sm:text-xs">
                            {campaign.campaign_title}
                          </h4>
                          {campaign.compensation_type === CAMPAIGN_TYPE.SPONSORED_POST ||
                            (campaign.compensation_type === CAMPAIGN_TYPE.UGC && (
                              <div className="mt-1 flex items-center gap-3">
                                <span className="text-[10px] font-medium text-primary sm:text-xs">
                                  Budget Remaining: ${campaign.remaining_budget || 0}
                                </span>
                                {campaign.total_collaborators && (
                                  <span className="text-[10px] text-gray-500 sm:text-xs">
                                    {campaign.total_collaborators} spots
                                  </span>
                                )}
                              </div>
                            ))}
                        </div>

                        {selectedCampaign?.id === campaign.id && (
                          <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary">
                            <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          <div>
            <label className="mb-2 block text-xs font-medium text-gray-700">
              {invitationTypeIndividualSelected ? (
                <>
                  Message <span className="text-red-500">*</span>
                </>
              ) : (
                "Custom Message (Optional)"
              )}
            </label>
            <CustomInput
              type="textarea"
              name="customMessage"
              placeholder={customMessagePlaceholder}
              value={customMessage}
              onChange={handleCustomMessageChange}
              maxLength={500}
              rows={3}
              disabled={isSending}
              required={customMessageRequired}
            />
            <p className="mt-1 text-[10px] text-gray-500 sm:text-xs">
              {customMessage.length}/500 characters
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:items-center sm:justify-end sm:space-x-2">
            <CustomButton
              text="Cancel"
              className="btn-secondary w-full sm:w-auto"
              onClick={handleModalClose}
              disabled={isSending}
            />
            <CustomButton
              text={invitePrimaryButtonText}
              className="btn-primary w-full sm:w-auto"
              loading={isSending}
              onClick={confirmSendInvitation}
              disabled={submitDisabled}
            />
          </div>
        </div>
      )}
    </Modal>
  );
};

export default InvitationModal;

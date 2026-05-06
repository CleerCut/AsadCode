import CustomButton from "@/common/components/custom-button/custom-button.component";
import Modal from "@/common/components/modal/modal.component";
import TextArea from "@/common/components/text-area/text-area.component";

const BulkMessageModal = ({
  show,
  onClose,
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
  isSending,
  getPlatformIcon,
  getPlatformColor,
  MESSAGE_MAX,
}) => {
  return (
    <Modal
      show={show}
      onClose={onClose}
      title="Bulk message to creators in this campaign"
      size="lg"
      fullScreenOnMobile
    >
      <div className="flex max-h-[min(78dvh,720px)] flex-col gap-3 overflow-hidden px-3 pb-3 pt-0 sm:gap-4 sm:px-4 sm:pb-4">
        <p className="text-[10px] leading-snug text-gray-600 sm:text-xs">
          This message will be sent as a direct message to each selected creator separately.
        </p>

        {topError ? (
          <p className="rounded-lg border border-red-100 bg-red-50 px-2.5 py-2 text-[10px] font-medium text-red-800 sm:text-xs">
            {topError}
          </p>
        ) : null}

        {partialError ? (
          <p className="rounded-lg border border-amber-100 bg-amber-50 px-2.5 py-2 text-[10px] font-medium text-amber-900 sm:text-xs">
            {partialError}
          </p>
        ) : null}

        <div className="flex min-h-0 flex-1 flex-col gap-2 rounded-lg border border-gray-200 bg-gray-50/80">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 px-2.5 py-2 sm:px-3">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                ref={(el) => {
                  if (el) {
                    el.indeterminate = selectAllRefProps.indeterminate;
                  }
                }}
                checked={selectAllRefProps.checked}
                onChange={(e) => handleToggleSelectAll(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-[10px] font-semibold text-gray-800 sm:text-xs">Select all</span>
            </label>
            <span className="text-[10px] font-medium tabular-nums text-gray-600 sm:text-xs">
              Selected: {selectedCount} of {totalCount} creators
            </span>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-2 sm:px-3">
            <ul className="divide-y divide-gray-100">
              {creatorRows.map((row) => {
                const checked = selectedIds.includes(row.creatorUserId);
                const failed = failedHighlightIds.includes(row.creatorUserId);
                return (
                  <li
                    key={row.creatorUserId}
                    className={`flex gap-2 py-2 sm:gap-3 sm:py-2.5 ${
                      failed ? "bg-red-50/80" : ""
                    }`}
                  >
                    <label className="flex min-w-0 flex-1 cursor-pointer items-start gap-2 sm:gap-3">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleToggleCreator(row.creatorUserId)}
                        className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      {row.image ? (
                        <img
                          src={row.image}
                          alt=""
                          className="h-10 w-10 shrink-0 rounded-full border border-gray-200 object-cover sm:h-11 sm:w-11"
                        />
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 sm:h-11 sm:w-11 sm:text-sm">
                          {(row.name || "?").charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0 flex-1 text-left">
                        <div className="text-xs font-semibold text-gray-900 sm:text-sm">{row.name}</div>
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          {row.platformEntries.map(([platform]) => (
                            <span
                              key={platform}
                              className={`inline-flex items-center rounded p-0.5 ${getPlatformColor(platform)}`}
                            >
                              {getPlatformIcon(platform)}
                            </span>
                          ))}
                        </div>
                      </div>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-semibold text-gray-700 sm:text-xs">Message to send</span>
          <TextArea
            name="bulkMessageBody"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type your message…"
            minRows={4}
            maxRows={12}
            className="text-xs sm:text-sm"
          />
          <div className="flex justify-between gap-2 text-[10px] text-gray-500 sm:text-xs">
            <span className="min-w-0">
              This message will appear in each creator chat thread for this campaign.
            </span>
            <span className="shrink-0 tabular-nums">
              {messageText.length}/{MESSAGE_MAX}
            </span>
          </div>
          {bodyError ? (
            <p className="text-[10px] font-medium text-red-600 sm:text-xs">{bodyError}</p>
          ) : null}
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-gray-100 pt-3 sm:flex-row sm:justify-end sm:gap-3">
          <CustomButton
            text="Cancel"
            className="btn-outline w-full sm:w-auto sm:min-w-[106px]"
            onClick={onClose}
            disabled={isSending}
          />
          <CustomButton
            text="Send message"
            className="btn-primary w-full sm:w-auto sm:min-w-[106px]"
            onClick={handleSend}
            loading={isSending}
            disabled={isSending || totalCount === 0}
          />
        </div>
      </div>
    </Modal>
  );
};

export default BulkMessageModal;

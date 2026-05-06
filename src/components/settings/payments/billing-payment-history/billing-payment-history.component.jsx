import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomDataTable from "@/common/components/custom-data-table/custom-data-table.component";
import Loader from "@/common/components/loader/loader.component";
import NotFound from "@/common/components/not-found/not-found.component";
import useBillingPaymentHistory from "./use-billing-payment-history.hook";

const BillingPaymentHistoryPage = () => {
  const {
    isCreator,
    isLoading,
    isError,
    rows,
    hasMore,
    errorMessage,
    showEmpty,
    handleLoadMore,
    billingColumns,
    billingTableData,
  } = useBillingPaymentHistory();

  if (isCreator) {
    return null;
  }

  return (
    <>
      <div className="mb-3 rounded-lg bg-primary p-3 text-white sm:mb-4 sm:p-4">
        <h1 className="text-sm font-semibold text-white sm:text-lg md:text-xl">
          Billing &amp; Payment History
        </h1>
        <p className="mt-1 text-[10px] leading-snug text-white/90 sm:text-xs md:text-sm">
          View all payments, receipts, and invoices for your CleerCut activity.
        </p>
      </div>

      {isLoading && rows.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <Loader loading />
        </div>
      ) : null}

      {isError ? (
        <div className="rounded-xl border border-red-100 bg-red-50/80 px-3 py-4 text-center sm:px-4">
          <p className="text-xs font-medium text-red-800 sm:text-sm">
            {errorMessage || "Could not load billing history."}
          </p>
        </div>
      ) : null}

      {showEmpty ? (
        <div className="rounded-xl border border-gray-200 bg-white py-8 shadow-sm sm:py-10">
          <NotFound
            title="No payments found"
            description="When you fund your first collaboration, your receipt and payment details will appear here."
            className="py-0"
            showAnimation={false}
          />
        </div>
      ) : null}

      {!isLoading && !isError && rows.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <CustomDataTable
            columns={billingColumns}
            data={billingTableData}
            loading={false}
            selectable={false}
            searchable={false}
            paginated={false}
            externalPagination
            totalRecords={billingTableData.length}
            showHeader
            emptyMessage="No payments found"
          />

          {hasMore ? (
            <div className="border-t border-gray-100 px-3 py-3 sm:flex sm:justify-center sm:px-4 sm:py-4">
              <CustomButton
                text="Load more"
                className="btn-outline w-full sm:w-auto sm:min-w-[106px]"
                onClick={handleLoadMore}
                loading={isLoading}
                disabled={isLoading}
              />
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
};

export default BillingPaymentHistoryPage;

"use client";

import CustomDataTable from "@/common/components/custom-data-table/custom-data-table.component";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import NotFound from "@/common/components/not-found/not-found.component";
import { ExternalLink, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import useBillingPayments from "./use-billing-payments.hook";

const BillingPaymentsPage = () => {
  const router = useRouter();
  const {
    charges,
    allCharges,
    currentPage,
    totalPages,
    searchTerm,
    formatDate,
    formatAmount,
    formatPaymentMethod,
    getCampaignLabel,
    getPaymentType,
    handlePageChange,
    handleSearchChange,
  } = useBillingPayments();

  // Handle view receipt click
  const handleViewReceipt = (receiptUrl) => {
    if (receiptUrl) {
      window.open(receiptUrl, "_blank", "noopener,noreferrer");
    }
  };

  // Define table columns
  const columns = [
    {
      key: "date",
      title: "Date",
    },
    {
      key: "campaign",
      title: "Campaign / Collaboration",
    },
    {
      key: "type",
      title: "Type",
    },
    {
      key: "amount",
      title: "Amount Paid",
    },
    {
      key: "paymentMethod",
      title: "Payment Method",
    },
    {
      key: "receipt",
      title: "Receipt / Invoice",
    },
  ];

  // Custom cell renderers
  const customCellRenderer = {
    date: (value, row) => <div className="text-sm text-gray-900">{formatDate(row.created)}</div>,
    campaign: (value, row) => {
      const campaignLabel = getCampaignLabel(row);
      if (campaignLabel.link) {
        return (
          <button
            onClick={() => router.push(campaignLabel.link)}
            className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline text-left"
          >
            {campaignLabel.label}
          </button>
        );
      }
      return <div className="text-sm text-gray-900">{campaignLabel.label}</div>;
    },
    type: (value, row) => {
      const type = getPaymentType(row);
      const typeColors = {
        "Escrow Payment": "bg-blue-100 text-blue-700",
        "Individual Creator Hire": "bg-purple-100 text-purple-700",
        "Platform Fee": "bg-gray-100 text-gray-700",
        Payment: "bg-gray-100 text-gray-700",
      };
      const colorClass = typeColors[type] || typeColors.Payment;

      return (
        <span className={`px-2 py-1 text-xs font-medium rounded-md ${colorClass}`}>{type}</span>
      );
    },
    amount: (value, row) => (
      <div className="text-sm font-semibold text-gray-900">
        {formatAmount(row.amount, row.currency)}
      </div>
    ),
    paymentMethod: (value, row) => (
      <div className="text-sm text-gray-700">{formatPaymentMethod(row.payment_method_details)}</div>
    ),
    receipt: (value, row) => {
      const receiptUrl = row.receipt_url;
      if (!receiptUrl) {
        return (
          <span className="text-sm text-gray-400 italic">
            Receipt unavailable — contact support
          </span>
        );
      }

      return (
        <CustomButton
          text="View Receipt"
          className="btn-secondary text-xs px-3 py-1.5"
          icon={ExternalLink}
          onClick={() => handleViewReceipt(receiptUrl)}
        />
      );
    },
  };

  // Empty state
  if (allCharges.length === 0) {
    return (
      <>
        {/* Header */}
        <div className="bg-primary p-4 rounded-lg text-white mb-4">
          <h1 className="text-xl font-bold text-white">Billing & Payment History</h1>
          <p className="text-sm mt-1">
            View all payments, receipts, and invoices for your CleerCut activity.
          </p>
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <NotFound
            title="No payments found"
            description="When you fund your first collaboration, your receipt and payment details will appear here."
            icon={CreditCard}
            showAnimation={false}
            className="p-12"
          />
        </div>
      </>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="bg-primary p-4 rounded-lg text-white mb-4">
        <h1 className="text-xl font-bold text-white">Billing & Payment History</h1>
        <p className="text-sm mt-1">
          View all payments, receipts, and invoices for your CleerCut activity.
        </p>
      </div>

      {/* Payment History Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Payments ({allCharges.length})</h3>
          </div>
        </div>

        {/* Custom Data Table */}
        <CustomDataTable
          columns={columns}
          data={charges}
          selectable={false}
          searchValue={searchTerm}
          onSearchChange={handleSearchChange}
          customCellRenderer={customCellRenderer}
          emptyMessage="No payments found"
          externalPagination={true}
          currentPage={currentPage}
          totalRecords={allCharges.length}
          pageSize={10}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default BillingPaymentsPage;

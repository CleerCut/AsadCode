import CustomButton from "@/common/components/custom-button/custom-button.component";
import { isCreatorMode } from "@/common/utils/users.util";
import { getBrandPayments } from "@/provider/features/collaboration-payment/collaboration-payment.slice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const PAGE_SIZE = 15;

function formatDisplayDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatMoneyAmount(amount, currencyCode) {
  const code = (currencyCode || "USD").toUpperCase();
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: code,
    }).format(Number(amount) || 0);
  } catch {
    return `${code} ${Number(amount) || 0}`;
  }
}

function mapPaymentToBillingRow(payment) {
  const campaignName =
    payment.collaboration?.campaign?.campaign_title ||
    payment.collaboration?.campaign?.title ||
    payment.campaign?.campaign_title ||
    "Unknown campaign";

  const creatorName =
    payment.creator?.first_name && payment.creator?.last_name
      ? `${payment.creator.first_name} ${payment.creator.last_name}`
      : payment.creator?.first_name ||
        payment.creator?.user?.first_name ||
        "Unknown creator";

  const campaignId =
    payment.collaboration?.campaign?.id ?? payment.collaboration?.campaign_id ?? null;
  const creatorUserId = payment.creator_id || payment.creator?.id || null;

  const occurredAt =
    payment.funded_at || payment.created_at
      ? new Date(payment.funded_at || payment.created_at).toISOString()
      : null;

  const amount = payment.gross_amount_cents
    ? Number(payment.gross_amount_cents) / 100
    : 0;

  return {
    id: payment.id,
    occurredAt,
    collaborationLabel: `${campaignName} · ${creatorName}`,
    campaignId,
    creatorUserId,
    typeLabel: "Collaboration payment",
    amount,
    currency: payment.currency || "USD",
    paymentMethodLabel: "Stripe",
    receiptAvailable: false,
    receiptUrl: null,
  };
}

export default function useBillingPaymentHistory() {
  const dispatch = useDispatch();
  const router = useRouter();
  const isCreator = isCreatorMode();
  const [visibleLimit, setVisibleLimit] = useState(PAGE_SIZE);

  const { data: rawPayments, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.collaborationPayment?.getBrandPayments ?? {}
  );

  const paymentsList = useMemo(() => {
    if (!rawPayments || !Array.isArray(rawPayments)) return [];
    return rawPayments;
  }, [rawPayments]);

  const billingRows = useMemo(
    () => paymentsList.map((p) => mapPaymentToBillingRow(p)),
    [paymentsList]
  );

  useEffect(() => {
    if (isCreator) {
      router.replace("/");
      return;
    }
    dispatch(getBrandPayments());
  }, [dispatch, isCreator, router]);

  useEffect(() => {
    setVisibleLimit(PAGE_SIZE);
  }, [paymentsList.length]);

  const handleLoadMore = useCallback(() => {
    setVisibleLimit((n) => n + PAGE_SIZE);
  }, []);

  const billingTableData = useMemo(
    () => billingRows.slice(0, visibleLimit),
    [billingRows, visibleLimit]
  );

  const hasMore = visibleLimit < billingRows.length;

  const showEmpty = useMemo(
    () =>
      isSuccess &&
      !isError &&
      Array.isArray(paymentsList) &&
      paymentsList.length === 0 &&
      !isLoading,
    [isSuccess, isError, paymentsList, isLoading]
  );

  const billingColumns = useMemo(
    () => [
      {
        key: "occurredAt",
        title: "Date",
        sortable: false,
        customRender: (row) => formatDisplayDate(row.occurredAt),
      },
      {
        key: "collaborationLabel",
        title: "Campaign / Collaboration",
        sortable: false,
        customRender: (row) => (
          <>
            <div className="font-medium leading-snug">{row.collaborationLabel}</div>
            <div className="mt-1 flex flex-wrap gap-x-2 gap-y-0.5">
              {row.campaignId ? (
                <Link
                  href="/campaign"
                  className="text-[10px] font-medium text-primary underline decoration-primary/40 underline-offset-2 hover:text-primary/90 sm:text-xs"
                >
                  Campaign
                </Link>
              ) : null}
              {row.creatorUserId ? (
                <Link
                  href={`/creator-profile/${row.creatorUserId}`}
                  className="text-[10px] font-medium text-primary underline decoration-primary/40 underline-offset-2 hover:text-primary/90 sm:text-xs"
                >
                  Creator profile
                </Link>
              ) : null}
            </div>
            <span className="mt-1 inline-flex text-[10px] text-gray-500 sm:hidden">
              {row.typeLabel}
            </span>
          </>
        ),
      },
      {
        key: "typeLabel",
        title: "Type",
        sortable: false,
        customRender: (row) => row.typeLabel,
      },
      {
        key: "amount",
        title: "Amount",
        sortable: false,
        customRender: (row) => formatMoneyAmount(row.amount, row.currency),
      },
      {
        key: "paymentMethodLabel",
        title: "Payment method",
        sortable: false,
        customRender: (row) => row.paymentMethodLabel,
      },
      {
        key: "receiptUrl",
        title: "Receipt",
        sortable: false,
        customRender: (row) =>
          row.receiptAvailable && row.receiptUrl ? (
            <CustomButton
              text="View Receipt"
              className="btn-outline !h-8 !min-h-8 px-2 text-[10px] sm:text-xs"
              onClick={() => {
                window.open(row.receiptUrl, "_blank", "noopener,noreferrer");
              }}
            />
          ) : (
            <span className="text-[10px] leading-snug text-gray-500 sm:text-xs">
              Receipt unavailable — contact support
            </span>
          ),
      },
    ],
    []
  );

  return {
    isCreator,
    isLoading,
    isError,
    rows: billingRows,
    hasMore,
    errorMessage: message,
    showEmpty,
    formatDisplayDate,
    formatMoneyAmount,
    handleLoadMore,
    billingColumns,
    billingTableData,
  };
}

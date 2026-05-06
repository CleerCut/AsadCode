"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import BillingPaymentHistoryPage from "@/components/settings/payments/billing-payment-history/billing-payment-history.component";

export default function Page() {
  return <Auth component={<BillingPaymentHistoryPage />} type={AUTH.PRIVATE} />;
}

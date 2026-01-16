"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import BillingPaymentsPage from "@/components/settings/payments/billing-payments/billing-payments.component";

export default function Page() {
  return <Auth component={<BillingPaymentsPage />} type={AUTH.PRIVATE} />;
}

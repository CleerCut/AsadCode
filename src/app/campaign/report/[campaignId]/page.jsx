"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

function CompletedCampaignReportRedirect() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params?.campaignId;
  const user = useSelector((state) => state.auth?.user);
  const role = user?.role || user?.data?.role;

  useEffect(() => {
    if (role === "CREATOR") {
      router.replace("/campaign");
      return;
    }
    if (!campaignId) {
      router.replace("/reports");
      return;
    }
    router.replace(`/reports?campaign=${campaignId}`);
  }, [role, campaignId, router]);

  return (
    <div className="flex min-h-screen items-center justify-center text-sm text-gray-500">
      Redirecting…
    </div>
  );
}

export default function Page() {
  return <Auth component={<CompletedCampaignReportRedirect />} type={AUTH.PRIVATE} />;
}

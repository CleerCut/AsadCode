"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import HeaderLayout from "@/common/layouts/header.layout";
import { isCreatorMode } from "@/common/utils/users.util";
import BrandDiscover from "@/components/campaign-refactored/brand-campaign/discover/discover.component";

export default function DiscoverPage() {
  const router = useRouter();

  useEffect(() => {
    if (isCreatorMode()) {
      router.replace("/campaign");
    }
  }, [router]);

  if (isCreatorMode()) {
    return null;
  }

  return (
    <HeaderLayout>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <BrandDiscover />
      </div>
    </HeaderLayout>
  );
}

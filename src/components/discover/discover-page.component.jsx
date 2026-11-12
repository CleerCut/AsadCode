"use client";

import HeaderLayout from "@/common/layouts/header.layout";
import BrandDiscover from "@/components/campaign-refactored/brand-campaign/discover/discover.component";
import useDiscoverPage from "./use-discover-page.hook";

export default function DiscoverPage() {
  const { isCreator } = useDiscoverPage();

  if (isCreator) {
    return null;
  }

  return (
    <HeaderLayout mainClassName="overflow-hidden">
      <BrandDiscover />
    </HeaderLayout>
  );
}

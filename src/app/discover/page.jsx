"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import DiscoverPage from "@/components/discover/discover-page.component";

export default function Page() {
  return <Auth component={<DiscoverPage />} type={AUTH.PRIVATE} />;
}

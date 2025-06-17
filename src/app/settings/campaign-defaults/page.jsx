import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import CampaignDefaults from "@/components/settings/campaign-defaults/campaign-defaults.component";

export default function Page() {
  return <Auth component={<CampaignDefaults />} type={AUTH.AUTH_MAIN_ROUTES} />;
}

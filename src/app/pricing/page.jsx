import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import PricingPage from "@/components/pricing/pricing.component";
import JsonLd from "@/components/seo/json-ld.component";
import { buildWebPageSchema } from "@/common/constants/seo-schema.constant";
import { SITE_NAME, SITE_URL } from "@/common/constants/site.constant";
import CrawlableContent from "@/components/seo/crawlable-content.component";

export const metadata = {
  title: `Pricing | ${SITE_NAME}`,
  description:
    "CleerCut pricing — 30-day free trial, Pay-As-You-Go at 9.9% commission, Unlimited Gifting at $99/mo, and zero-commission plans from $359/mo.",
  alternates: { canonical: `${SITE_URL}/pricing` },
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={buildWebPageSchema({
          name: `${SITE_NAME} Pricing`,
          description:
            "Flexible influencer marketing pricing with a 30-day trial, Pay-As-You-Go, and zero-commission plans from $359/mo.",
          url: `${SITE_URL}/pricing`,
        })}
      />
      <CrawlableContent>
        <h1>CleerCut Pricing</h1>
        <p>30-day trial: unlimited commission-free campaigns, no credit card required.</p>
        <p>Pay-As-You-Go: 9.9% commission, 3 gifted collaborations per month.</p>
        <p>Unlimited Gifting Add-On: $99/month.</p>
        <p>Starter: from $359/mo (quarterly), zero commission up to $5,000/month.</p>
        <p>Growth: from $629/mo (quarterly), zero commission up to $12,500/month.</p>
        <p>Pro: from $899/mo (quarterly), zero commission up to $30,000/month.</p>
        <p>Enterprise: custom pricing for limits above $30,000/month.</p>
      </CrawlableContent>
      <Auth component={<PricingPage />} type={AUTH.PUBLIC} />
    </>
  );
}

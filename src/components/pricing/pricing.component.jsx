"use client";

import HeaderFooterLayout from "@/common/layouts/header-footer.layout";
import BrandPricing from "./components/brand-pricing/brand-pricing";
import CreatorPricing from "./components/creator-pricing/creator-pricing";
import PricingOptions from "./components/pricing-options/pricing-options.component";
import usePricingHook from "./use-pricing.hook";

export default function PricingPage() {
  const { creatorMode, animateTable } = usePricingHook();

  return (
    <HeaderFooterLayout>
      <div className="min-h-screen bg-white">
        {creatorMode && (
          <header className="bg-gradient-to-br from-primary to-primary text-white text-left md:text-center">
            <div className="max-w-8xl mx-auto py-4 md:py-8 px-4 sm:px-6 lg:px-8 text-sm md:text-lg xl:text-xl text-white">
              <div className="flex flex-col gap-3">
                <p>
                  Unlike most platforms that take 15–30% or inflate your rate, CleerCut charges
                  creators only the standard 3.2% payment processing fee.
                </p>
                <p className="text-sm md:text-lg">
                  No subscription fees. No hidden cuts. No surprise margins. <br />
                  Just transparent payouts and protection built for creators.
                </p>
              </div>
            </div>
          </header>
        )}

        <div className="flex flex-col gap-6 p-3 md:p-12">
          {!creatorMode && (
            <>
              <div className="text-center">
                <h1 className="text-sm font-semibold text-gray-900 sm:text-lg md:text-xl">
                  Drive ROI With Influencers
                </h1>
                <p className="mt-2 text-[10px] leading-snug text-gray-500 sm:text-xs md:text-sm">
                  Simple, flexible pricing for brands of every size — no long-term contracts required.
                </p>
              </div>
              <PricingOptions />
            </>
          )}

          <div
            className={`container transition-all duration-500 transform ${animateTable ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
          >
            <h2 className="text-sm md:text-lg xl:text-xl font-bold text-center py-6 text-indigo-900">
              How CleerCut Compares to Other Platforms
            </h2>
            {creatorMode ? <CreatorPricing /> : <BrandPricing />}
          </div>
        </div>
      </div>
    </HeaderFooterLayout>
  );
}

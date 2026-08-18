import CustomButton from "@/common/components/custom-button/custom-button.component";
import { Check } from "lucide-react";
import {
  BRIDGING_LINE_COPY,
  FOOTER_NOTE_COPY,
  ROW_ONE_PLANS,
  TIER_FEATURE_ROW_KEYS,
  TRIAL_BANNER_COPY,
} from "../../pricing.config";
import usePricingOptionsHook from "./use-pricing-options.hook";

function PricingCardRowOne({ plan }) {
  const isHighlighted = plan.highlighted;

  return (
    <div
      className={`flex h-full flex-col rounded-2xl border p-5 sm:p-6 ${
        isHighlighted
          ? "border-primary bg-primary text-white shadow-lg"
          : "border-gray-200 bg-white shadow-md"
      }`}
    >
      <h2
        className={`text-base font-bold sm:text-lg ${isHighlighted ? "text-white" : "text-gray-900"}`}
      >
        {plan.name}
      </h2>

      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-3xl font-bold tabular-nums sm:text-4xl">{plan.price}</span>
        <span className={`text-sm ${isHighlighted ? "text-indigo-100" : "text-gray-500"}`}>
          {plan.priceSuffix}
        </span>
      </div>

      <div
        className={`my-4 border-t ${isHighlighted ? "border-indigo-400/50" : "border-gray-200"}`}
      />

      <ul className="mb-6 flex flex-1 flex-col gap-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-left">
            <Check
              className={`mt-0.5 h-4 w-4 shrink-0 sm:h-5 sm:w-5 ${
                isHighlighted ? "text-white" : "text-primary"
              }`}
            />
            <span
              className={`text-[11px] leading-snug sm:text-xs md:text-sm ${
                isHighlighted ? "text-indigo-50" : "text-gray-600"
              }`}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <CustomButton
        text="Get Started"
        href="/onboarding"
        className={`w-full ${
          isHighlighted
            ? "bg-white text-primary hover:bg-indigo-50"
            : "btn-primary"
        }`}
      />
    </div>
  );
}

function BillingToggle({ billingCycle, billingCycleOptions, onBillingCycleChange }) {
  return (
    <div className="flex justify-center">
      <div className="inline-flex flex-wrap items-center justify-center gap-1 rounded-full border border-gray-200 bg-gray-100 p-1">
        {billingCycleOptions.map((option) => {
          const isActive = billingCycle === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onBillingCycleChange(option.id)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors sm:px-4 sm:text-xs ${
                isActive
                  ? "bg-white text-primary shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <span>{option.label}</span>
              {option.saveBadge && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold sm:text-[11px] ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  {option.saveBadge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TierFeatureRows({ plan, isHighlighted }) {
  return (
    <ul className="flex flex-1 flex-col">
      {TIER_FEATURE_ROW_KEYS.map((rowKey) => {
        const featureText = plan.featureRows[rowKey];

        return (
          <li
            key={rowKey}
            className="flex min-h-[2.75rem] items-start gap-2.5 border-b border-transparent py-2 sm:min-h-[3rem]"
          >
            {featureText ? (
              <>
                <Check
                  className={`mt-0.5 h-4 w-4 shrink-0 sm:h-5 sm:w-5 ${
                    isHighlighted ? "text-white" : "text-primary"
                  }`}
                />
                <span
                  className={`text-[11px] leading-snug sm:text-xs md:text-sm ${
                    isHighlighted ? "text-indigo-50" : "text-gray-600"
                  }`}
                >
                  {featureText}
                </span>
              </>
            ) : (
              <span className="invisible select-none text-[11px] sm:text-xs" aria-hidden="true">
                —
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function PricingCardRowTwo({ plan }) {
  const isHighlighted = plan.popular;

  return (
    <div
      className={`relative flex h-full flex-col rounded-2xl border p-5 sm:p-6 ${
        isHighlighted
          ? "border-primary bg-primary text-white shadow-lg"
          : "border-gray-200 bg-white shadow-md"
      }`}
    >
      {isHighlighted && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-2.5 py-0.5 text-[10px] font-semibold text-primary shadow sm:text-xs">
          ★ Most Popular
        </span>
      )}

      <h2
        className={`text-base font-bold sm:text-lg ${isHighlighted ? "text-white" : "text-gray-900"}`}
      >
        {plan.name}
      </h2>

      <div className="mt-3">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold tabular-nums sm:text-4xl">
            {plan.displayPrice}
          </span>
          {!plan.isCustom && (
            <span className={`text-sm ${isHighlighted ? "text-indigo-100" : "text-gray-500"}`}>
              /mo
            </span>
          )}
        </div>
        {plan.displayBilled && (
          <p
            className={`mt-1 text-[10px] sm:text-xs ${
              isHighlighted ? "text-indigo-100" : "text-gray-500"
            }`}
          >
            {plan.displayBilled}
          </p>
        )}
      </div>

      <div
        className={`my-4 border-t ${isHighlighted ? "border-indigo-400/50" : "border-gray-200"}`}
      />

      <TierFeatureRows plan={plan} isHighlighted={isHighlighted} />

      <CustomButton
        text={plan.isCustom ? "Contact Sales" : "Choose Plan"}
        href="/onboarding"
        className={`mt-4 w-full ${
          isHighlighted
            ? "bg-white text-primary hover:bg-indigo-50"
            : "btn-primary"
        }`}
      />
    </div>
  );
}

export default function PricingOptions() {
  const {
    billingCycle,
    billingCycleOptions,
    tierPlansWithPricing,
    handleBillingCycleChange,
  } = usePricingOptionsHook();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-1 sm:gap-10">
      <div className="rounded-xl bg-primary px-4 py-4 text-left text-white sm:px-6 sm:py-5 sm:text-center">
        <p className="text-xs leading-snug sm:text-sm md:text-base">{TRIAL_BANNER_COPY}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 md:gap-8">
        {ROW_ONE_PLANS.map((plan) => (
          <PricingCardRowOne key={plan.id} plan={plan} />
        ))}
      </div>

      <p className="text-center text-sm font-medium text-gray-700 sm:text-base md:text-lg">
        {BRIDGING_LINE_COPY}
      </p>

      <BillingToggle
        billingCycle={billingCycle}
        billingCycleOptions={billingCycleOptions}
        onBillingCycleChange={handleBillingCycleChange}
      />

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {tierPlansWithPricing.map((plan) => (
          <PricingCardRowTwo key={plan.id} plan={plan} />
        ))}
      </div>

      <p className="text-center text-[11px] leading-snug text-gray-500 sm:text-xs md:text-sm">
        {FOOTER_NOTE_COPY}
      </p>
    </div>
  );
}

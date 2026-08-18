import { useCallback, useMemo, useState } from "react";
import {
  BILLING_CYCLES,
  DEFAULT_BILLING_CYCLE,
  ROW_TWO_PLANS,
} from "../../pricing.config";

function usePricingOptionsHook() {
  const [billingCycle, setBillingCycle] = useState(DEFAULT_BILLING_CYCLE);

  const billingCycleOptions = useMemo(() => Object.values(BILLING_CYCLES), []);

  const tierPlansWithPricing = useMemo(
    () =>
      ROW_TWO_PLANS.map((plan) => {
        if (plan.isCustom) {
          return { ...plan, displayPrice: "Custom", displayBilled: null };
        }

        const cyclePricing = plan.pricing[billingCycle];
        return {
          ...plan,
          displayPrice: `$${cyclePricing.amount}`,
          displayBilled: cyclePricing.billed,
        };
      }),
    [billingCycle]
  );

  const handleBillingCycleChange = useCallback((cycleId) => {
    setBillingCycle(cycleId);
  }, []);

  return {
    billingCycle,
    billingCycleOptions,
    tierPlansWithPricing,
    handleBillingCycleChange,
  };
}

export default usePricingOptionsHook;

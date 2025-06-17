"use client";

import { useSelector } from "react-redux";
import BrandOnboardingFlow from "./brand/brand-onboarding.component";

export default function CreatorOnboardingFlow() {
  const isCreatorMode = useSelector(({ auth }) => auth.isCreatorMode);

  return (
    <div className="min-h-screen">
      {isCreatorMode ? <CreatorOnboardingFlow /> : <BrandOnboardingFlow />}
    </div>
  );
}

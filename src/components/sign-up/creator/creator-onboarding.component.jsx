"use client";

import { setIsCreatorModeMode } from "@/provider/features/auth/auth.slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import AccountType from "../components/account-type/account-type.component";
import EmailVerification from "../components/email-verification/email-verification";
import SignUp from "../components/sign-up/sign-up.component";
import CampaignPreferences from "./campaign-preferences/campaign-preferences.component";
import ProfileSetup from "./profile-setup/profile-setup.component";

export default function CreatorOnboardingFlow() {
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAccountType, setSelectedAccountType] = useState("");

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const completeOnboarding = () => {
    // dispatch(setIsCreatorModeMode(selectedAccountType === "creator"));
  };

  const handleSelectMode = (type) => {
    setSelectedAccountType(type);
    // dispatch(setIsCreatorModeMode(type === "creator"));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <AccountType
            selectedType={selectedAccountType}
            handleSelectMode={handleSelectMode}
            onNext={nextStep}
          />
        );
      case 2:
        return <SignUp onNext={nextStep} onBack={prevStep} />;
      case 3:
        return <EmailVerification onNext={nextStep} onBack={prevStep} />;
      case 4:
        return <ProfileSetup onNext={nextStep} onBack={prevStep} />;
      case 5:
        return <CampaignPreferences onNext={completeOnboarding} onBack={prevStep} />;
      default:
        return (
          <AccountType
            selectedType={selectedAccountType}
            handleSelectMode={handleSelectMode}
            onNext={nextStep}
          />
        );
    }
  };

  return <div className="min-h-screen">{renderStep()}</div>;
}

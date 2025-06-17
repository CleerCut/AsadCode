import React from "react";
import {
  User,
  Building2,
  CheckCircle,
  ArrowRight,
  Star,
  TrendingUp,
  Users2,
  Zap,
} from "lucide-react";
import useBackgroundEffect from "@/common/hooks/use-background-effect.hook";
import CustomButton from "@/common/components/custom-button/custom-button.component";

const AccountType = ({ selectedType, handleSelectMode, onNext }) => {
  const { position } = useBackgroundEffect();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute w-64 h-64 rounded-full bg-indigo-100 blur-xl opacity-60"
          style={{
            left: `calc(10% + ${position.x}px)`,
            top: `calc(30% + ${position.y}px)`,
            transition: "all 0.3s ease",
          }}
        />
        <div
          className="absolute w-96 h-96 rounded-full bg-indigo-200 blur-xl opacity-50"
          style={{
            right: `calc(15% + ${position.x * -1}px)`,
            bottom: `calc(20% + ${position.y * -1}px)`,
            transition: "all 0.5s ease",
          }}
        />
        <div
          className="absolute w-48 h-48 rounded-full bg-indigo-300 blur-xl opacity-40"
          style={{
            left: `calc(50% + ${position.y}px)`,
            top: `calc(15% + ${position.x}px)`,
            transition: "all 0.4s ease",
          }}
        />
      </div>
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">Let's Get Started</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Choose how you'd like to use CleerCut and unlock opportunities that match your goals
          </p>
        </div>

        {/* Account Type Cards */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Creator Card */}
          <div
            onClick={() => handleSelectMode("creator")}
            className={`
              relative p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-2xl
              ${
                selectedType === "creator"
                  ? "border-indigo-500 bg-indigo-50 shadow-xl"
                  : "border-gray-200 bg-white hover:border-indigo-200"
              }
            `}
          >
            {selectedType === "creator" && (
              <div className="absolute -top-4 -right-4 w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            )}

            <div className="text-center">
              <h3 className="text-2xl bg-primary rounded-lg p-4 font-bold text-white mb-4">
                I'm a Creator
              </h3>
              <p className="text-gray-600 text-lg">
                Looking to collaborate with brands and grow my influence
              </p>
            </div>
          </div>

          {/* Brand Card */}
          <div
            onClick={() => handleSelectMode("brand")}
            className={`
              relative p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-2xl
              ${
                selectedType === "brand"
                  ? "border-indigo-500 bg-indigo-50 shadow-xl"
                  : "border-gray-200 bg-white hover:border-indigo-200"
              }
            `}
          >
            {selectedType === "brand" && (
              <div className="absolute -top-4 -right-4 w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            )}

            <div className="text-center">
              <h3 className="text-2xl bg-primary rounded-lg p-4 font-bold text-white mb-4">
                I'm a Brand or Agency
              </h3>
              <p className="text-gray-600 text-left text-lg">
                Looking to post campaigns and work with creators
              </p>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex justify-end">
          <CustomButton
            onClick={onNext}
            disabled={!selectedType}
            className="btn-primary"
            text={`Continue as
            ${selectedType === "creator" ? "Creator" : selectedType === "brand" ? "Brand" : "..."}`}
          />
        </div>
      </div>
    </div>
  );
};

export default AccountType;

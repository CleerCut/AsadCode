import React, { useState, useEffect } from "react";
import { Mail, CheckCircle, ArrowLeft } from "lucide-react";
import CustomButton from "@/common/components/custom-button/custom-button.component";

const EmailVerification = ({ onNext, onBack }) => {
  const [emailSent, setEmailSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleResend = () => {
    setEmailSent(true);
    setCountdown(60);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
            <button
              onClick={onBack}
              className="flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </button>
            <span>Step 3 of 5</span>
            <span>60% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full w-3/5 transition-all duration-500"></div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Email Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-primary rounded-full mb-6 ">
              <Mail className="h-12 w-12 text-white" />
            </div>

            <h1 className="text-lg font-bold text-gray-900">Verify Your Email to Continue</h1>

            <p className="text-gray-600 mb-2">We've sent a verification link to</p>
            <p className="font-semibold text-gray-900 mb-3 bg-gray-100 px-4 py-2 rounded-lg">
              creator***@gmail.com
            </p>

            <p className="text-sm text-gray-600">
              Click the link to confirm your account and begin setting up your profile.
            </p>
          </div>

          {/* Resend Section */}
          <div className="text-center mb-3">
            <p className="text-sm text-gray-600">Didn't get it? Check your spam folder or</p>

            {countdown > 0 ? (
              <div className="text-sm text-gray-500">Resend available in {countdown}s</div>
            ) : !emailSent ? (
              <button
                onClick={handleResend}
                className="text-indigo-600 hover:text-indigo-700 font-medium text-sm underline"
              >
                Resend Email
              </button>
            ) : (
              <div className="inline-flex items-center text-green-600 text-sm bg-green-50 px-4 py-2 rounded-lg">
                <CheckCircle className="h-4 w-4 mr-2" />
                Email sent! Please check your inbox.
              </div>
            )}
          </div>

          {/* Continue Button (for demo) */}
          <div className="space-y-4">
            <CustomButton
              text="Continue to Profile Setup"
              className="btn-primary w-full"
              onClick={onNext}
            />

            <p className="w-full text-sm text-center text-gray-500 hover:text-gray-700">
              Having trouble? Contact support
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;

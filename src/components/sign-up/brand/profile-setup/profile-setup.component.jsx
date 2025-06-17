import React, { useState } from "react";
import { Building2, Upload, Camera, Globe, MapPin, ArrowLeft, Eye } from "lucide-react";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";

const BrandProfile = ({ onNext, onBack }) => {
  const [brandLogo, setBrandLogo] = useState(null);
  const [description, setDescription] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  const handleLogoUpload = () => {
    // Simulate file upload
    setBrandLogo(
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop&crop=center"
    );
  };

  const countries = [
    { value: "us", label: "🇺🇸 United States" },
    { value: "uk", label: "🇬🇧 United Kingdom" },
    { value: "ca", label: "🇨🇦 Canada" },
    { value: "au", label: "🇦🇺 Australia" },
    { value: "de", label: "🇩🇪 Germany" },
    { value: "fr", label: "🇫🇷 France" },
    { value: "jp", label: "🇯🇵 Japan" },
    { value: "sg", label: "🇸🇬 Singapore" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
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
            <span>Step 4 of 6</span>
            <span>66% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full w-2/3 transition-all duration-500"></div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Build Your Brand or Agency Page</h1>
          <p className="text-gray-600">
            Set up your public profile that creators will see when you reach out
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">
                Public Profile Preview
              </h3>

              {/* Brand Profile Card Preview */}
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  {brandLogo ? (
                    <img
                      src={brandLogo}
                      alt="Brand Logo"
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center">
                      <Building2 className="h-10 w-10 text-white" />
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 border-2 border-white rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">B</span>
                  </div>
                </div>

                <h4 className="font-semibold text-gray-900">Your Brand Name</h4>
                <p className="text-sm text-gray-600 mb-4">example.com</p>

                {description && (
                  <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg mb-4">
                    {description}
                  </p>
                )}

                <div className="flex items-center justify-center text-xs text-gray-500 mb-4">
                  <MapPin className="h-3 w-3 mr-1" />
                  San Francisco, US
                </div>

                <div className="flex items-center justify-center text-xs text-gray-500">
                  <Eye className="h-3 w-3 mr-1" />
                  Live preview →
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Brand Information */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Brand Information</h3>

              <div className="space-y-6">
                {/* Brand Name */}
                <CustomInput
                  label="Brand Name"
                  name="brandName"
                  placeholder="Enter your brand or agency name"
                  isRequired={true}
                  icon={Building2}
                />

                {/* Brand Logo */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-4">
                    Brand Logo <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      {brandLogo ? (
                        <img
                          src={brandLogo}
                          alt="Brand Logo"
                          className="w-24 h-24 rounded-2xl object-cover border-2 border-gray-200"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300">
                          <Camera className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                      {brandLogo && (
                        <button
                          onClick={() => setBrandLogo(null)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                        >
                          ×
                        </button>
                      )}
                    </div>
                    <div>
                      <CustomButton
                        text="Upload Logo"
                        className="btn-secondary"
                        icon={Upload}
                        onClick={handleLogoUpload}
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        PNG or JPG, max 5MB. Square images work best.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Website URL */}
                <CustomInput
                  label="Website URL"
                  name="websiteUrl"
                  type="url"
                  placeholder="https://www.yourbrand.com"
                  isRequired={true}
                  icon={Globe}
                />
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">HQ Location</h3>

              <div className="grid md:grid-cols-2 gap-6">
                <CustomInput
                  label="City"
                  name="city"
                  placeholder="Enter your city"
                  isRequired={true}
                  icon={MapPin}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <select
                      className="w-full pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 appearance-none"
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                    >
                      <option value="">Select Country</option>
                      {countries.map((country) => (
                        <option key={country.value} value={country.value}>
                          {country.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Description */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Company Description</h3>

              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  This page will appear on your public Brand Profile and be visible to creators.
                </p>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Company Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    placeholder="Tell creators about your brand, mission, and what makes you unique..."
                    rows={5}
                    maxLength={300}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 resize-none"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-500">{description.length}/300 characters</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Eye className="h-3 w-3 mr-1" />
                      Live preview →
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <div className="text-center">
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <h4 className="font-semibold text-gray-900 mb-2">Profile Setup</h4>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${brandLogo && description ? "100%" : "50%"}` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mb-6">
                  {brandLogo && description.length > 50
                    ? "Great! Your brand profile looks professional 🎉"
                    : "Add logo and description to complete your profile"}
                </p>
                <CustomButton
                  text="Continue Account Setup"
                  className="btn-primary w-full"
                  onClick={onNext}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandProfile;

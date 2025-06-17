import React, { useState } from "react";
import {
  Video,
  Wifi,
  Globe2,
  DollarSign,
  Camera,
  Gift,
  Percent,
  CheckCircle,
  ArrowLeft,
  Users,
  TrendingUp,
  MapPin,
} from "lucide-react";
import CustomButton from "@/common/components/custom-button/custom-button.component";

const BrandCampaignPreferences = ({ onNext, onBack }) => {
  const [filmingPreference, setFilmingPreference] = useState("");
  const [selectedCampaignTypes, setSelectedCampaignTypes] = useState([]);
  const [selectedNiches, setSelectedNiches] = useState([]);
  const [selectedCreatorSizes, setSelectedCreatorSizes] = useState([]);
  const [selectedGeographicFocus, setSelectedGeographicFocus] = useState([]);

  const filmingOptions = [
    {
      id: "in-person",
      label: "In person based filming",
      desc: "Creators visit your location or events for content creation",
      icon: Video,
      color: "text-purple-600",
    },
    {
      id: "remote",
      label: "Remote based filming",
      desc: "Creators create content from their own location",
      icon: Wifi,
      color: "text-blue-600",
    },
    {
      id: "both",
      label: "Both",
      desc: "Flexible approach depending on campaign needs",
      icon: Globe2,
      color: "text-green-600",
    },
  ];

  const campaignTypes = [
    {
      id: "sponsored",
      label: "Sponsored Post",
      desc: "Pay a creator to post content on their own social media",
      icon: DollarSign,
      popularity: 95,
      avgCost: "$200-800",
    },
    {
      id: "ugc",
      label: "UGC",
      desc: "Pay a creator to make content for your brand to use in ads or marketing",
      icon: Camera,
      popularity: 88,
      avgCost: "$300-1200",
    },
    {
      id: "gifted",
      label: "Gifted",
      desc: "Send free product or gift a free service in exchange for a post",
      icon: Gift,
      popularity: 92,
      avgCost: "$50-500 value",
    },
    {
      id: "affiliate",
      label: "Affiliate",
      desc: "Creators earn commission based on sales they generate for your brand",
      icon: Percent,
      popularity: 76,
      avgCost: "5-20% commission",
    },
  ];

  const niches = [
    { name: "Fashion", icon: "👗", color: "bg-pink-100 text-pink-700" },
    { name: "Food", icon: "🍕", color: "bg-orange-100 text-orange-700" },
    { name: "Beauty", icon: "💄", color: "bg-purple-100 text-purple-700" },
    { name: "Fitness", icon: "💪", color: "bg-green-100 text-green-700" },
    { name: "Travel", icon: "✈️", color: "bg-blue-100 text-blue-700" },
    { name: "Tech", icon: "💻", color: "bg-gray-100 text-gray-700" },
    { name: "Lifestyle", icon: "🌟", color: "bg-yellow-100 text-yellow-700" },
    { name: "Gaming", icon: "🎮", color: "bg-indigo-100 text-indigo-700" },
    { name: "Home & Decor", icon: "🏠", color: "bg-emerald-100 text-emerald-700" },
    { name: "Automotive", icon: "🚗", color: "bg-red-100 text-red-700" },
  ];

  const creatorSizes = [
    {
      id: "micro",
      label: "Micro (1k–10k)",
      desc: "High engagement, niche audiences",
      icon: Users,
      benefits: ["Higher engagement rates", "More affordable", "Authentic connections"],
    },
    {
      id: "mid",
      label: "Mid (10k–100k)",
      desc: "Balance of reach and engagement",
      icon: TrendingUp,
      benefits: ["Good reach + engagement", "Professional content", "Proven track record"],
    },
    {
      id: "macro",
      label: "Macro (100k+)",
      desc: "Maximum reach and brand awareness",
      icon: Globe2,
      benefits: ["Massive reach", "Brand recognition", "Viral potential"],
    },
  ];

  const geographicFocus = [
    { id: "local", label: "Local", desc: "Target specific cities or regions", icon: MapPin },
    { id: "national", label: "National", desc: "Country-wide campaigns", icon: "🇺🇸" },
    { id: "global", label: "Global", desc: "International reach", icon: Globe2 },
  ];

  const toggleSelection = (item, selectedArray, setSelectedArray) => {
    setSelectedArray((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
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
            <span>Step 5 of 6</span>
            <span>83% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full w-5/6 transition-all duration-500"></div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Campaign Preferences</h1>
          <p className="text-gray-600">
            Help us understand your campaign needs and find the right creators
          </p>
        </div>

        <div className="space-y-8">
          {/* Filming Preference */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Will your Campaigns require in person filming?
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {filmingOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = filmingPreference === option.id;
                return (
                  <div
                    key={option.id}
                    onClick={() => setFilmingPreference(option.id)}
                    className={`
                      p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:scale-105
                      ${
                        isSelected
                          ? "border-indigo-500 bg-indigo-50 shadow-lg"
                          : "border-gray-200 hover:border-indigo-200"
                      }
                    `}
                  >
                    <div className="text-center">
                      <div
                        className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${isSelected ? "bg-indigo-500" : "bg-gray-100"}`}
                      >
                        <Icon className={`h-6 w-6 ${isSelected ? "text-white" : option.color}`} />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">{option.label}</h4>
                      <p className="text-sm text-gray-600">{option.desc}</p>
                      {isSelected && (
                        <div className="mt-4">
                          <CheckCircle className="h-5 w-5 text-indigo-500 mx-auto" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Campaign Types */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              What Kind of Campaigns do you primarily intend to Run?
              <span className="block text-sm font-normal text-gray-500 mt-1">
                Choose one or more campaign types
              </span>
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {campaignTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedCampaignTypes.includes(type.id);
                return (
                  <div
                    key={type.id}
                    onClick={() =>
                      toggleSelection(type.id, selectedCampaignTypes, setSelectedCampaignTypes)
                    }
                    className={`
                      p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg
                      ${
                        isSelected
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 hover:border-indigo-200"
                      }
                    `}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`
                        p-3 rounded-xl flex-shrink-0
                        ${isSelected ? "bg-indigo-500 text-white" : "bg-gray-100 text-gray-500"}
                      `}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      {isSelected && <CheckCircle className="h-6 w-6 text-indigo-500" />}
                    </div>

                    <h4 className="font-semibold text-gray-900 mb-2">{type.label}</h4>
                    <p className="text-sm text-gray-600 mb-4">{type.desc}</p>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-blue-600 font-medium">{type.avgCost}</span>
                      <div className="flex items-center text-gray-500">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {type.popularity}% use this
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Target Niches and Creator Preferences */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Target Niches */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Target Niche(s)</h3>
              <div className="grid grid-cols-2 gap-3">
                {niches.map((niche) => {
                  const isSelected = selectedNiches.includes(niche.name);
                  return (
                    <button
                      key={niche.name}
                      onClick={() => toggleSelection(niche.name, selectedNiches, setSelectedNiches)}
                      className={`
                        p-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 hover:scale-105
                        ${
                          isSelected
                            ? `border-indigo-500 ${niche.color}`
                            : "border-gray-200 text-gray-700 hover:border-indigo-200"
                        }
                      `}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-base">{niche.icon}</span>
                        <span>{niche.name}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ideal Creator Size */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Ideal Creator Size</h3>
              <div className="space-y-4">
                {creatorSizes.map((size) => {
                  const Icon = size.icon;
                  const isSelected = selectedCreatorSizes.includes(size.id);
                  return (
                    <div
                      key={size.id}
                      onClick={() =>
                        toggleSelection(size.id, selectedCreatorSizes, setSelectedCreatorSizes)
                      }
                      className={`
                        p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                        ${
                          isSelected
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-gray-200 hover:border-indigo-200"
                        }
                      `}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div
                            className={`
                            p-2 rounded-lg flex-shrink-0
                            ${isSelected ? "bg-indigo-500 text-white" : "bg-gray-100 text-gray-500"}
                          `}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{size.label}</h4>
                            <p className="text-sm text-gray-600 mb-2">{size.desc}</p>
                            <div className="flex flex-wrap gap-1">
                              {size.benefits.map((benefit, index) => (
                                <span
                                  key={index}
                                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                                >
                                  {benefit}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        {isSelected && (
                          <CheckCircle className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Geographic Focus */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Geographic Focus</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {geographicFocus.map((geo) => {
                const Icon = geo.icon;
                const isSelected = selectedGeographicFocus.includes(geo.id);
                return (
                  <div
                    key={geo.id}
                    onClick={() =>
                      toggleSelection(geo.id, selectedGeographicFocus, setSelectedGeographicFocus)
                    }
                    className={`
                      p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:scale-105
                      ${
                        isSelected
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 hover:border-indigo-200"
                      }
                    `}
                  >
                    <div className="text-center">
                      <div
                        className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${isSelected ? "bg-indigo-500" : "bg-gray-100"}`}
                      >
                        {typeof Icon === "string" ? (
                          <span className="text-xl">{Icon}</span>
                        ) : (
                          <Icon
                            className={`h-6 w-6 ${isSelected ? "text-white" : "text-gray-500"}`}
                          />
                        )}
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">{geo.label}</h4>
                      <p className="text-sm text-gray-600">{geo.desc}</p>
                      {isSelected && (
                        <div className="mt-4">
                          <CheckCircle className="h-5 w-5 text-indigo-500 mx-auto" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Continue Button */}
          <div className="text-center">
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">Campaign Setup Progress</h4>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-gradient-to-r from-blue-400 to-indigo-500 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        (filmingPreference ? 25 : 0) +
                        (selectedCampaignTypes.length > 0 ? 25 : 0) +
                        (selectedNiches.length > 0 ? 25 : 0) +
                        (selectedCreatorSizes.length > 0 ? 25 : 0)
                      }%`,
                    }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mb-6">
                  {filmingPreference &&
                  selectedCampaignTypes.length > 0 &&
                  selectedNiches.length > 0
                    ? "Perfect! Your campaign preferences are set 🎯"
                    : "Complete your preferences to continue"}
                </p>
              </div>

              <CustomButton
                text="Continue"
                className="btn-primary w-full"
                onClick={onNext}
                disabled={!filmingPreference || selectedCampaignTypes.length === 0}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandCampaignPreferences;

import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Globe,
  Hash,
  MapPin,
  Search,
  Target,
  UserCheck,
} from "lucide-react";
import { useState } from "react";

const IdealCreator = ({ onNext, onBack }) => {
  const [minFollowers, setMinFollowers] = useState("");
  const [selectedGender, setSelectedGender] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedAgeRanges, setSelectedAgeRanges] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [citySearch, setCitySearch] = useState("");

  const genderOptions = [
    { id: "male", label: "Male", icon: "👨", color: "bg-blue-100 text-blue-700" },
    { id: "female", label: "Female", icon: "👩", color: "bg-pink-100 text-pink-700" },
    { id: "mixed", label: "Mixed/Any", icon: "👥", color: "bg-purple-100 text-purple-700" },
  ];

  const countries = [
    { id: "us", label: "United States", flag: "🇺🇸", creators: "2.1M" },
    { id: "uk", label: "United Kingdom", flag: "🇬🇧", creators: "450K" },
    { id: "ca", label: "Canada", flag: "🇨🇦", creators: "380K" },
    { id: "au", label: "Australia", flag: "🇦🇺", creators: "290K" },
    { id: "de", label: "Germany", flag: "🇩🇪", creators: "520K" },
    { id: "fr", label: "France", flag: "🇫🇷", creators: "410K" },
    { id: "br", label: "Brazil", flag: "🇧🇷", creators: "680K" },
    { id: "in", label: "India", flag: "🇮🇳", creators: "1.8M" },
  ];

  const ageRanges = [
    { id: "13-17", label: "13-17", desc: "Gen Z Early", icon: "🧒", popular: "TikTok, Snapchat" },
    { id: "18-25", label: "18-25", desc: "Gen Z Core", icon: "🧑", popular: "Instagram, TikTok" },
    { id: "26-32", label: "26-32", desc: "Millennials", icon: "👨‍💼", popular: "Instagram, YouTube" },
    {
      id: "33-40",
      label: "33-40",
      desc: "Elder Millennials",
      icon: "👩‍💼",
      popular: "Facebook, LinkedIn",
    },
    { id: "41-50", label: "41-50", desc: "Gen X", icon: "👨‍🦳", popular: "Facebook, YouTube" },
    { id: "50+", label: "50+", desc: "Boomers+", icon: "👴", popular: "Facebook, Email" },
  ];

  const platforms = [
    {
      id: "instagram",
      label: "Instagram",
      icon: "📸",
      color: "bg-pink-100 text-pink-700",
      users: "2B+",
    },
    { id: "tiktok", label: "TikTok", icon: "🎵", color: "bg-black text-white", users: "1B+" },
    {
      id: "youtube",
      label: "YouTube",
      icon: "📹",
      color: "bg-red-100 text-red-700",
      users: "2.7B+",
    },
    {
      id: "twitter",
      label: "Twitter",
      icon: "🐦",
      color: "bg-blue-100 text-blue-700",
      users: "450M+",
    },
    {
      id: "facebook",
      label: "Facebook",
      icon: "📘",
      color: "bg-blue-100 text-blue-600",
      users: "2.9B+",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      icon: "💼",
      color: "bg-blue-100 text-blue-800",
      users: "900M+",
    },
    {
      id: "snapchat",
      label: "Snapchat",
      icon: "👻",
      color: "bg-yellow-100 text-yellow-700",
      users: "750M+",
    },
    {
      id: "pinterest",
      label: "Pinterest",
      icon: "📌",
      color: "bg-red-100 text-red-600",
      users: "450M+",
    },
  ];

  const followerRanges = [
    { value: "1000", label: "1K+ followers" },
    { value: "5000", label: "5K+ followers" },
    { value: "10000", label: "10K+ followers" },
    { value: "25000", label: "25K+ followers" },
    { value: "50000", label: "50K+ followers" },
    { value: "100000", label: "100K+ followers" },
    { value: "500000", label: "500K+ followers" },
    { value: "1000000", label: "1M+ followers" },
  ];

  const toggleSelection = (item, selectedArray, setSelectedArray) => {
    setSelectedArray((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const getSelectionSummary = () => {
    const totalSelections =
      selectedGender.length +
      selectedCountries.length +
      selectedAgeRanges.length +
      selectedPlatforms.length +
      (minFollowers ? 1 : 0);
    return totalSelections;
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
            <span>Step 6 of 6</span>
            <span>100% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full w-full transition-all duration-500"></div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            <Target className="h-4 w-4 mr-2" />
            Final Step
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Who Are You Looking to Work With?
          </h1>
          <p className="text-gray-600">
            These settings help power discovery, filters, and message request sorting
          </p>
        </div>

        <div className="space-y-8">
          {/* Follower Count & Gender */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Minimum Followers */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-xl mr-4">
                  <Hash className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Minimum Followers</h3>
              </div>

              <div className="space-y-3">
                {followerRanges.map((range) => (
                  <label
                    key={range.value}
                    className={`
                      flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200
                      ${
                        minFollowers === range.value
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 hover:border-indigo-200"
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="followers"
                      value={range.value}
                      checked={minFollowers === range.value}
                      onChange={(e) => setMinFollowers(e.target.value)}
                      className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 mr-3"
                    />
                    <span className="font-medium">{range.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Gender */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-xl mr-4">
                  <UserCheck className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Gender</h3>
              </div>

              <div className="space-y-3">
                {genderOptions.map((gender) => {
                  const isSelected = selectedGender.includes(gender.id);
                  return (
                    <button
                      key={gender.id}
                      onClick={() => toggleSelection(gender.id, selectedGender, setSelectedGender)}
                      className={`
                        w-full flex items-center p-4 rounded-xl border-2 transition-all duration-200
                        ${
                          isSelected
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-gray-200 hover:border-indigo-200"
                        }
                      `}
                    >
                      <div
                        className={`
                        flex items-center justify-center w-10 h-10 rounded-xl mr-4 text-xl
                        ${isSelected ? "bg-indigo-500" : gender.color}
                      `}
                      >
                        {isSelected ? (
                          <CheckCircle className="h-5 w-5 text-white" />
                        ) : (
                          <span>{gender.icon}</span>
                        )}
                      </div>
                      <span className="font-medium">{gender.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-xl mr-4">
                <MapPin className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Location</h3>
            </div>

            <div className="space-y-6">
              {/* Country Selection */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Select Countries</h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {countries.map((country) => {
                    const isSelected = selectedCountries.includes(country.id);
                    return (
                      <button
                        key={country.id}
                        onClick={() =>
                          toggleSelection(country.id, selectedCountries, setSelectedCountries)
                        }
                        className={`
                          p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105
                          ${
                            isSelected
                              ? "border-indigo-500 bg-indigo-50"
                              : "border-gray-200 hover:border-indigo-200"
                          }
                        `}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-2">{country.flag}</div>
                          <div className="font-medium text-sm">{country.label}</div>
                          <div className="text-xs text-gray-500">{country.creators} creators</div>
                          {isSelected && (
                            <CheckCircle className="h-4 w-4 text-indigo-500 mx-auto mt-2" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* City Search */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Specific City (Optional)</h4>
                <div className="max-w-md">
                  <CustomInput
                    label=""
                    name="city"
                    placeholder="Search for specific cities..."
                    value={citySearch}
                    onChange={(e) => setCitySearch(e.target.value)}
                    icon={Search}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Age Range */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-xl mr-4">
                <Calendar className="h-5 w-5 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Age Range</h3>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ageRanges.map((age) => {
                const isSelected = selectedAgeRanges.includes(age.id);
                return (
                  <button
                    key={age.id}
                    onClick={() => toggleSelection(age.id, selectedAgeRanges, setSelectedAgeRanges)}
                    className={`
                      p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105
                      ${
                        isSelected
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 hover:border-indigo-200"
                      }
                    `}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">{age.icon}</div>
                      <div className="font-bold">{age.label}</div>
                      <div className="text-sm text-gray-600 mb-2">{age.desc}</div>
                      <div className="text-xs text-blue-600">{age.popular}</div>
                      {isSelected && (
                        <CheckCircle className="h-4 w-4 text-indigo-500 mx-auto mt-2" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary Platforms */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-xl mr-4">
                <Globe className="h-5 w-5 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Primary Platform(s)</h3>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {platforms.map((platform) => {
                const isSelected = selectedPlatforms.includes(platform.id);
                return (
                  <button
                    key={platform.id}
                    onClick={() =>
                      toggleSelection(platform.id, selectedPlatforms, setSelectedPlatforms)
                    }
                    className={`
                      p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105
                      ${
                        isSelected
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 hover:border-indigo-200"
                      }
                    `}
                  >
                    <div className="text-center">
                      <div
                        className={`
                        inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3 text-xl
                        ${isSelected ? "bg-indigo-500 text-white" : platform.color}
                      `}
                      >
                        {isSelected ? (
                          <CheckCircle className="h-6 w-6" />
                        ) : (
                          <span>{platform.icon}</span>
                        )}
                      </div>
                      <div className="font-medium text-sm">{platform.label}</div>
                      <div className="text-xs text-gray-500">{platform.users} users</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Completion */}
          <div className="text-center">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-2xl p-12 text-white">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-6 animate-bounce">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>

              <h3 className="text-2xl font-bold mb-4">🎉 Your Brand Setup is Complete!</h3>
              <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                You've successfully configured your brand profile and creator preferences. Start
                discovering and connecting with the perfect creators for your campaigns.
              </p>

              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 max-w-2xl mx-auto">
                <div className="bg-white bg-opacity-10 rounded-xl p-4">
                  <div className="text-2xl font-bold">{getSelectionSummary()}</div>
                  <div className="text-sm text-blue-100">Filters Set</div>
                </div>
                <div className="bg-white bg-opacity-10 rounded-xl p-4">
                  <div className="text-2xl font-bold">{selectedPlatforms.length}</div>
                  <div className="text-sm text-blue-100">Platforms</div>
                </div>
                <div className="bg-white bg-opacity-10 rounded-xl p-4">
                  <div className="text-2xl font-bold">{selectedCountries.length}</div>
                  <div className="text-sm text-blue-100">Countries</div>
                </div>
                <div className="bg-white bg-opacity-10 rounded-xl p-4">
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-sm text-blue-100">Setup Complete</div>
                </div>
              </div>

              <CustomButton
                text="Start Finding Creators"
                className="btn-secondary"
                onClick={onNext}
              />

              <p className="text-xs text-blue-200 mt-4">
                You can always update these preferences later in your brand dashboard
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdealCreator;

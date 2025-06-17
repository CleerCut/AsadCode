import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  Eye,
  EyeOff,
  Globe,
  Lock,
  Mail,
  MapPin,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import * as yup from "yup";

const SignUp = ({ onNext, onBack }) => {
  const isCreatorMode = useSelector(({ auth }) => auth.isCreatorMode);

  const [selectedType, setSelectedType] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const schema = yup.object().shape({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    dateOfBirth: yup.string().required("Date of birth is required"),
    agreeTerms: yup.boolean().oneOf([true], "You must agree to the terms"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const password = watch("password");

  useEffect(() => {
    if (password) {
      let strength = 0;
      if (password.length >= 8) strength += 25;
      if (/[A-Z]/.test(password)) strength += 25;
      if (/[0-9]/.test(password)) strength += 25;
      if (/[^A-Za-z0-9]/.test(password)) strength += 25;
      setPasswordStrength(strength);
    }
  }, [password]);

  const onSubmit = (data) => {
    onNext();
  };

  const getStrengthColor = () => {
    if (passwordStrength < 50) return "bg-red-400";
    if (passwordStrength < 75) return "bg-yellow-400";
    return "bg-green-400";
  };

  const getStrengthText = () => {
    if (passwordStrength < 50) return "Weak";
    if (passwordStrength < 75) return "Medium";
    return "Strong";
  };

  return (
    <div className=" py-8 px-4 bg-gray-100">
      <div className="max-w-xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
            <button
              onClick={onBack}
              className="flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </button>
            <span>Step 2 of 5</span>
            <span>40% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full w-2/5 transition-all duration-500"></div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Creator Account</h1>
          <p className="text-gray-600">Let's set up your profile to start connecting with brands</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CustomInput
                label="First Name"
                name="firstName"
                register={register}
                errors={errors}
                placeholder="Enter your first name"
                isRequired={true}
                icon={User}
              />

              <CustomInput
                label="Last Name"
                name="lastName"
                register={register}
                errors={errors}
                placeholder="Enter your last name"
                isRequired={true}
              />
            </div>

            {/* Email */}
            <CustomInput
              label="Email Address"
              name="email"
              type="email"
              register={register}
              errors={errors}
              placeholder="Enter your email address"
              isRequired={true}
              icon={Mail}
            />

            {/* Enhanced Password */}
            <div>
              <CustomInput
                label="Password"
                name="password"
                type="password"
                register={register}
                errors={errors}
                placeholder="Create a secure password"
                isRequired={true}
                icon={Lock}
              />

              {/* Password Strength Indicator */}
              {password && (
                <div className="my-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600">Password strength:</span>
                    <span
                      className={`font-medium ${passwordStrength >= 75 ? "text-green-600" : passwordStrength >= 50 ? "text-yellow-600" : "text-red-600"}`}
                    >
                      {getStrengthText()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                      style={{ width: `${passwordStrength}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Date of Birth */}
            <CustomInput
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              register={register}
              errors={errors}
              isRequired={true}
              icon={Calendar}
            />

            {/* Country & City */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-full">
                <SimpleSelect
                  placeHolder="Select"
                  label="Select country"
                  options={[
                    { value: "us", label: "United States" },
                    { value: "uk", label: "United Kingdom" },
                    { value: "ca", label: "Canada" },
                    { value: "au", label: "Australia" },
                    { value: "de", label: "Germany" },
                    { value: "fr", label: "France" },
                  ]}
                  onChange={() => {}}
                />
              </div>

              <CustomInput
                label="City"
                name="city"
                placeholder="Enter your city"
                isRequired={true}
                icon={MapPin}
              />
            </div>

            {!isCreatorMode && (
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Account Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "This is a brand account" },
                    { label: "This is an agency account" },
                  ].map((type) => (
                    <button
                      key={type.label}
                      type="button"
                      onClick={() => setSelectedType(type.label)}
                      className={`
                      px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-200 hover:scale-105
                      ${
                        selectedType === type.label
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                          : "border-gray-200 text-gray-700 hover:border-indigo-200"
                      }
                    `}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Creator Type */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Creator Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Solo Creator" },
                  { label: "Couple" },
                  { label: "Family" },
                  { label: "Pet" },
                ].map((type) => (
                  <button
                    key={type.label}
                    type="button"
                    onClick={() => setSelectedType(type.label)}
                    className={`
                      px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-200 hover:scale-105
                      ${
                        selectedType === type.label
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                          : "border-gray-200 text-gray-700 hover:border-indigo-200"
                      }
                    `}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-4 bg-gray-100 p-4 rounded-xl">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">
                  Send me campaign suggestions and brand matches
                </span>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("agreeTerms")}
                  className="mt-1 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">
                  I agree to CleerCut's{" "}
                  <a href="#" className="text-indigo-600 hover:text-indigo-700 underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-indigo-600 hover:text-indigo-700 underline">
                    Privacy Policy
                  </a>
                </span>
              </label>
              {errors.agreeTerms && (
                <p className="text-xs text-red-600">{errors.agreeTerms.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <CustomButton text="Create My Account" className="btn-primary w-full" type="submit" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

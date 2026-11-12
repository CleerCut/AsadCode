"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import useHome from "./use-home.hook";

export default function BrandHome() {
  const { goToDiscover, goToApplications } = useHome();

  return (
    <div className="flex min-h-0 flex-1 flex-col items-start justify-center gap-3 px-4 py-10 sm:px-6">
      <h1 className="text-lg font-semibold text-gray-900 sm:text-xl">Home</h1>
      <p className="max-w-lg text-sm text-gray-600">
        Your campaign action queue is coming soon. Meanwhile, open Discover+ to find creators or jump
        into Applications.
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        <CustomButton text="Open Discover+" className="btn-primary" onClick={goToDiscover} />
        <CustomButton text="Go to Applications" className="btn-outline" onClick={goToApplications} />
      </div>
    </div>
  );
}

import { useCallback } from "react";
import { useRouter } from "next/navigation";

export default function useHome() {
  const router = useRouter();

  const goToDiscover = useCallback(() => {
    router.push("/discover");
  }, [router]);

  const goToApplications = useCallback(() => {
    router.push("/campaign?tab=2");
  }, [router]);

  return {
    goToDiscover,
    goToApplications,
  };
}

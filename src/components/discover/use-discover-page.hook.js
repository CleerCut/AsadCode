import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { isCreatorMode } from "@/common/utils/users.util";
import { DISCOVER_EVENTS, trackDiscoverEvent } from "@/common/utils/discover-analytics.util";

export default function useDiscoverPage() {
  const router = useRouter();
  const isCreator = useMemo(() => isCreatorMode(), []);

  useEffect(() => {
    if (isCreator) {
      router.replace("/campaign?tab=1");
      return;
    }
    trackDiscoverEvent(DISCOVER_EVENTS.OPENED_FROM_RAIL);
  }, [isCreator, router]);

  return { isCreator };
}

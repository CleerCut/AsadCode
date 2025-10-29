import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getEmailPreferences,
  updateEmailPreferences,
  reset as usersReset,
} from "@/provider/features/users/users.slice";
import { getUser } from "@/common/utils/users.util";

const getDefaultPreferences = () => ({
  campaignInvites: true,
  campaignUpdates: true,
  campaignDeadlines: false,
  collaborationRequests: true,
  paymentAlerts: true,
  invoiceReminders: true,
  paymentConfirmations: true,
  monthlyEarnings: false,
  newFeatures: true,
  platformUpdates: false,
  maintenanceAlerts: true,
  securityAlerts: true,
  weeklyNewsletter: false,
  marketingTips: false,
  promotionalOffers: false,
  partnerOffers: false,
  emailFrequency: "immediate",
  digestTime: "morning",
});

export default function useEmailPreferences() {
  const user = getUser();
  const dispatch = useDispatch();
  const { getEmailPreferences: getState, updateEmailPreferences: updateState } = useSelector(
    (state) => state.users
  );

  const [preferences, setPreferences] = useState(getDefaultPreferences());
  const [emailAddress, setEmailAddress] = useState(user?.email || "");
  const [hasChanges, setHasChanges] = useState(false);
  const [originalPreferences, setOriginalPreferences] = useState(null);

  useEffect(() => {
    dispatch(getEmailPreferences());
    return () => {
      dispatch(usersReset());
    };
  }, [dispatch]);

  useEffect(() => {
    if (user?.email) {
      setEmailAddress(user.email);
    }
  }, [user?.email]);

  useEffect(() => {
    if (getState?.data?.success && getState?.data?.data) {
      const prefsData = getState.data.data;
      setPreferences({
        campaignInvites: prefsData.campaignInvites ?? true,
        campaignUpdates: prefsData.campaignUpdates ?? true,
        campaignDeadlines: prefsData.campaignDeadlines ?? false,
        collaborationRequests: prefsData.collaborationRequests ?? true,
        paymentAlerts: prefsData.paymentAlerts ?? true,
        invoiceReminders: prefsData.invoiceReminders ?? true,
        paymentConfirmations: prefsData.paymentConfirmations ?? true,
        monthlyEarnings: prefsData.monthlyEarnings ?? false,
        newFeatures: prefsData.newFeatures ?? true,
        platformUpdates: prefsData.platformUpdates ?? false,
        maintenanceAlerts: prefsData.maintenanceAlerts ?? true,
        securityAlerts: prefsData.securityAlerts ?? true,
        weeklyNewsletter: prefsData.weeklyNewsletter ?? false,
        marketingTips: prefsData.marketingTips ?? false,
        promotionalOffers: prefsData.promotionalOffers ?? false,
        partnerOffers: prefsData.partnerOffers ?? false,
        emailFrequency: prefsData.emailFrequency ?? "immediate",
        digestTime: prefsData.digestTime ?? "morning",
      });
      setOriginalPreferences(prefsData);
    }
  }, [getState?.data]);

  const handlePreferenceChange = useCallback((key, value) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));
    setHasChanges(true);
  }, []);

  const handleSave = useCallback(async () => {
    const result = await dispatch(updateEmailPreferences(preferences)).unwrap();

    if (result.success) {
      setHasChanges(false);
      setOriginalPreferences(preferences);
    }
  }, [dispatch, preferences]);

  const handleReset = useCallback(() => {
    const defaults = getDefaultPreferences();
    setPreferences(defaults);
    setHasChanges(true);
  }, []);

  const handleEnableAllEssential = useCallback(() => {
    handlePreferenceChange("campaignInvites", true);
    handlePreferenceChange("paymentAlerts", true);
    handlePreferenceChange("securityAlerts", true);
    handlePreferenceChange("maintenanceAlerts", true);
  }, [handlePreferenceChange]);

  const handleDisableAllMarketing = useCallback(() => {
    handlePreferenceChange("weeklyNewsletter", false);
    handlePreferenceChange("marketingTips", false);
    handlePreferenceChange("promotionalOffers", false);
    handlePreferenceChange("partnerOffers", false);
  }, [handlePreferenceChange]);

  return {
    preferences,
    emailAddress,
    hasChanges,
    isLoading: getState?.isLoading || updateState?.isLoading,
    handlePreferenceChange,
    handleSave,
    handleReset,
    handleEnableAllEssential,
    handleDisableAllMarketing,
  };
}

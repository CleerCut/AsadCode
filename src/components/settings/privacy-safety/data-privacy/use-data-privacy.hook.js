import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDataPrivacy,
  updateDataPrivacy,
  reset as usersReset,
} from "@/provider/features/users/users.slice";

const getDefaultPrivacySettings = () => ({
  // Profile Visibility
  profilePublic: true,
  showRealName: false,
  showLocation: true,
  showSocialLinks: true,
  showFollowerCount: true,
  showEngagementRates: false,

  // Data Collection
  allowPerformanceTracking: true,
  allowBehaviorAnalytics: false,
  allowThirdPartyIntegration: true,
  allowMarketResearch: false,
  collectLocationData: false,

  // Data Sharing
  shareWithPartners: false,
  shareAggregateData: true,
  sharePerformanceData: false,
  allowDataExport: true,

  // Marketing & Personalization
  personalizedRecommendations: true,
  targetedMarketing: false,
  cookieTracking: true,
  crossPlatformTracking: false,

  // Communication
  dataUpdateNotifications: true,
  securityAlerts: true,
  policyChangeNotifications: true,
});

export default function useDataPrivacy() {
  const dispatch = useDispatch();
  const { getDataPrivacy: getState, updateDataPrivacy: updateState } = useSelector(
    (state) => state.users
  );

  const [privacySettings, setPrivacySettings] = useState(getDefaultPrivacySettings());
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState("visibility");
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [originalSettings, setOriginalSettings] = useState(null);

  useEffect(() => {
    dispatch(getDataPrivacy());
    return () => {
      dispatch(usersReset());
    };
  }, [dispatch]);

  useEffect(() => {
    if (getState?.data?.success && getState?.data?.data) {
      const settingsData = getState.data.data;
      const toBool = (v, def) => (v === undefined || v === null ? def : v === true || v === "true");
      // Map with boolean coercion; preserve false values and convert string "true"/"false"
      const mappedSettings = {
        profilePublic: toBool(settingsData.profilePublic, true),
        showRealName: toBool(settingsData.showRealName, false),
        showLocation: toBool(settingsData.showLocation, true),
        showSocialLinks: toBool(settingsData.showSocialLinks, true),
        showFollowerCount: toBool(settingsData.showFollowerCount, true),
        showEngagementRates: toBool(settingsData.showEngagementRates, false),
        allowPerformanceTracking: toBool(settingsData.allowPerformanceTracking, true),
        allowBehaviorAnalytics: toBool(settingsData.allowBehaviorAnalytics, false),
        allowThirdPartyIntegration: toBool(settingsData.allowThirdPartyIntegration, true),
        allowMarketResearch: toBool(settingsData.allowMarketResearch, false),
        collectLocationData: toBool(settingsData.collectLocationData, false),
        shareWithPartners: toBool(settingsData.shareWithPartners, false),
        shareAggregateData: toBool(settingsData.shareAggregateData, true),
        sharePerformanceData: toBool(settingsData.sharePerformanceData, false),
        allowDataExport: toBool(settingsData.allowDataExport, true),
        personalizedRecommendations: toBool(settingsData.personalizedRecommendations, true),
        targetedMarketing: toBool(settingsData.targetedMarketing, false),
        cookieTracking: toBool(settingsData.cookieTracking, true),
        crossPlatformTracking: toBool(settingsData.crossPlatformTracking, false),
        dataUpdateNotifications: toBool(settingsData.dataUpdateNotifications, true),
        securityAlerts: toBool(settingsData.securityAlerts, true),
        policyChangeNotifications: toBool(settingsData.policyChangeNotifications, true),
      };
      setPrivacySettings(mappedSettings);
      setOriginalSettings(settingsData);
    }
  }, [getState?.data]);

  const handleSettingChange = useCallback((key, value) => {
    setPrivacySettings((prev) => ({
      ...prev,
      [key]: value,
    }));
    setHasChanges(true);
  }, []);

  const handleSave = useCallback(async () => {
    await dispatch(updateDataPrivacy(privacySettings)).unwrap();
    // Refresh data from server after save
    const refreshResult = await dispatch(getDataPrivacy()).unwrap();
    if (refreshResult?.success && refreshResult?.data) {
      setHasChanges(false);
      setOriginalSettings(refreshResult.data);
    }
  }, [dispatch, privacySettings]);

  const handleExportData = useCallback(() => {
    // TODO: Implement data export logic
    setShowExportModal(false);
  }, []);

  const handleDeleteAccount = useCallback(() => {
    // TODO: Implement account deletion logic
    setShowDeleteModal(false);
  }, []);

  const handleReset = useCallback(() => {
    setPrivacySettings(originalSettings || getDefaultPrivacySettings());
    setHasChanges(false);
  }, [originalSettings]);

  return {
    privacySettings,
    hasChanges,
    activeTab,
    showExportModal,
    showDeleteModal,
    isLoading: getState?.isLoading || updateState?.isLoading,
    setActiveTab,
    setShowExportModal,
    setShowDeleteModal,
    handleSettingChange,
    handleSave,
    handleExportData,
    handleDeleteAccount,
    handleReset,
  };
}

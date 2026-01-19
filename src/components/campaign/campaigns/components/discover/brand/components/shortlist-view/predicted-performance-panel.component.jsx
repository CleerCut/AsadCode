import { Users, Eye, TrendingUp, Globe } from "lucide-react";
import usePredictedPerformance from "./use-predicted-performance.hook";

const PredictedPerformancePanel = ({ shortlistUsers = [] }) => {
  const {
    totalFollowers,
    averageViews,
    averageEngagementRate,
    audienceAge,
    audienceGender,
    topLocations,
  } = usePredictedPerformance(shortlistUsers);

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 mb-4">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-1">
          Predicted Audience & Performance
        </h3>
        <p className="text-xs text-gray-500">
          Aggregated metrics from {shortlistUsers.length} creator
          {shortlistUsers.length !== 1 ? "s" : ""} in this shortlist
        </p>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-5 pb-5 border-b border-gray-100">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500">Total Followers</span>
          </div>
          <span className="text-lg font-semibold text-gray-900">
            {formatNumber(totalFollowers)}
          </span>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500">Avg. Views</span>
          </div>
          <span className="text-lg font-semibold text-gray-900">{formatNumber(averageViews)}</span>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500">Avg. Engagement</span>
          </div>
          <span className="text-lg font-semibold text-gray-900">
            {averageEngagementRate.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Audience Demographics */}
      <div className="space-y-4">
        {/* Age Distribution */}
        {audienceAge.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-gray-700 mb-2">Top Age Ranges</h4>
            <div className="flex flex-wrap gap-2">
              {audienceAge.slice(0, 3).map((age, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700"
                >
                  {age.name}: {age.value}%
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Gender Distribution */}
        {(audienceGender.female > 0 || audienceGender.male > 0 || audienceGender.other > 0) && (
          <div>
            <h4 className="text-xs font-medium text-gray-700 mb-2">Gender Split</h4>
            <div className="flex flex-wrap gap-2">
              {audienceGender.female > 0 && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-pink-50 text-pink-700">
                  Female: {audienceGender.female}%
                </span>
              )}
              {audienceGender.male > 0 && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                  Male: {audienceGender.male}%
                </span>
              )}
              {audienceGender.other > 0 && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-700">
                  Other: {audienceGender.other}%
                </span>
              )}
            </div>
          </div>
        )}

        {/* Top Locations */}
        {topLocations.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-xs font-medium text-gray-700">Top Locations</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {topLocations.slice(0, 5).map((location, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-purple-50 text-purple-700"
                >
                  {location.name}: {location.value}%
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {audienceAge.length === 0 &&
          audienceGender.female === 0 &&
          audienceGender.male === 0 &&
          audienceGender.other === 0 &&
          topLocations.length === 0 && (
            <div className="text-center py-4">
              <p className="text-xs text-gray-400">
                Audience demographic data not available for this shortlist
              </p>
            </div>
          )}
      </div>
    </div>
  );
};

export default PredictedPerformancePanel;

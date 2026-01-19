import { useMemo } from "react";

/**
 * Hook to calculate predicted audience & performance metrics for a shortlist
 * Aggregates data from all creators in the shortlist
 */
function usePredictedPerformance(shortlistUsers = []) {
  const metrics = useMemo(() => {
    if (!shortlistUsers || shortlistUsers.length === 0) {
      return {
        totalFollowers: 0,
        averageViews: 0,
        averageEngagementRate: 0,
        audienceAge: [],
        audienceGender: { female: 0, male: 0, other: 0 },
        topLocations: [],
      };
    }

    // Aggregate followers
    const totalFollowers = shortlistUsers.reduce((sum, user) => {
      const followers = user?.creator_profile?.total_followers || 0;
      return sum + followers;
    }, 0);

    // Calculate average views (placeholder - not in database)
    // Using a placeholder calculation: followers * 0.1 (10% view rate estimate)
    const averageViews = Math.round(
      shortlistUsers.reduce((sum, user) => {
        const followers = user?.creator_profile?.total_followers || 0;
        return sum + followers * 0.1; // Placeholder: 10% of followers as views
      }, 0) / shortlistUsers.length
    );

    // Calculate average engagement rate (placeholder - not in database)
    // Using a placeholder: 3.5% average engagement rate
    const averageEngagementRate = 3.5; // Placeholder value

    // Aggregate audience age ranges
    const ageMap = new Map();
    shortlistUsers.forEach((user) => {
      const ageRanges = user?.creator_profile?.audience_age_ranges || [];
      ageRanges.forEach((range) => {
        ageMap.set(range, (ageMap.get(range) || 0) + 1);
      });
    });

    // Convert to array and calculate percentages
    const ageEntries = Array.from(ageMap.entries())
      .map(([range, count]) => ({
        name: range,
        value: Math.round((count / shortlistUsers.length) * 100),
      }))
      .sort((a, b) => {
        // Sort by age range (extract first number)
        const aNum = parseInt(a.name.split("-")[0] || a.name);
        const bNum = parseInt(b.name.split("-")[0] || b.name);
        return aNum - bNum;
      });

    // Aggregate audience gender
    // audience_gender is a string like "mostly-male", "mostly-female", or null
    const genderCounts = { female: 0, male: 0, other: 0 };
    shortlistUsers.forEach((user) => {
      const gender = user?.creator_profile?.audience_gender || "";
      const genderLower = gender.toLowerCase();
      if (genderLower.includes("female")) {
        genderCounts.female += 1;
      } else if (genderLower.includes("male")) {
        genderCounts.male += 1;
      } else if (gender) {
        // If gender exists but doesn't match male/female, count as other
        genderCounts.other += 1;
      }
      // If gender is empty/null, don't count it
    });

    // Calculate gender percentages based on creators who have gender data
    const totalGenderCount = genderCounts.female + genderCounts.male + genderCounts.other;
    const audienceGender = {
      female: totalGenderCount > 0 ? Math.round((genderCounts.female / totalGenderCount) * 100) : 0,
      male: totalGenderCount > 0 ? Math.round((genderCounts.male / totalGenderCount) * 100) : 0,
      other: totalGenderCount > 0 ? Math.round((genderCounts.other / totalGenderCount) * 100) : 0,
    };

    // Aggregate top locations
    const locationMap = new Map();
    shortlistUsers.forEach((user) => {
      const countries = user?.creator_profile?.audience_countries || [];
      countries.forEach((country) => {
        locationMap.set(country, (locationMap.get(country) || 0) + 1);
      });
    });

    // Get top 5 locations by count
    const topLocations = Array.from(locationMap.entries())
      .map(([country, count]) => ({
        name: country.toUpperCase(),
        value: Math.round((count / shortlistUsers.length) * 100),
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    return {
      totalFollowers,
      averageViews,
      averageEngagementRate,
      audienceAge: ageEntries,
      audienceGender,
      topLocations,
    };
  }, [shortlistUsers]);

  return metrics;
}

export default usePredictedPerformance;

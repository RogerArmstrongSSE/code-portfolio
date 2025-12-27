import { ActivityType, ActivityLevel, PersonalInfo } from "./types";

export const calorieCalculator = (
  personalDetails: Omit<PersonalInfo, "dailyCalorieRequirement">
): number => {
  let bmr: number;

  if (personalDetails.gender === "male") {
    bmr =
      10 * personalDetails.weightKg +
      6.25 * personalDetails.heightCm -
      5 * personalDetails.age +
      5;
  } else {
    bmr =
      10 * personalDetails.weightKg +
      6.25 * personalDetails.heightCm -
      5 * personalDetails.age -
      161;
  }

  return Math.round(
    bmr * getActivityLevelNumber(personalDetails.activityLevel)
  );
};

const getActivityLevelNumber = (level: keyof typeof ActivityLevel): number => {
  return ActivityLevel[level];
};

export const printActivityLevel = (
  activityLevel: keyof typeof ActivityLevel
): string => {
  switch (activityLevel) {
    case "sedentary":
      return "Sedentary";
    case "lightExercise":
      return "Light Exercise";
    case "moderateExercise":
      return "Moderate Exercise";
    case "heavyExercise":
      return "Heavy Exercise";
    case "superHeavyExercise":
      return "Athlete";
  }
};

export const getActivity = (name: string): ActivityType | undefined => {
  switch (name) {
    case "Running":
      return "running";
    case "Swimming":
      return "swimming";
    case "Walking":
      return "walking";
    default:
      return undefined;
  }
};

export const estimatedCalorieBurnCalculator = (
  activity: ActivityType,
  weightKg: number,
  activityTimeInMin: number
): number => {
  console.log(activity, weightKg, activityTimeInMin);

  let caloriesPerMinutePerKg: number;
  switch (activity)
  {
    case "running":
      caloriesPerMinutePerKg = 0.095;
      break;
    case "swimming":
      caloriesPerMinutePerKg = 0.066;
      break;
    case "walking":
      caloriesPerMinutePerKg = 0.036;
      break;
    default:
      caloriesPerMinutePerKg = 0;
  }
  
  return caloriesPerMinutePerKg * weightKg * activityTimeInMin;
};

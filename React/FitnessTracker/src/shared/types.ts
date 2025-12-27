export type Gender = "male" | "female";
export type ActivityType = "running" | "swimming" | "walking";

export const ActivityLevel = {
  sedentary: 1.2,
  lightExercise: 1.375,
  moderateExercise: 1.55,
  heavyExercise: 1.725,
  superHeavyExercise: 1.9,
} as const;

export type MealLog = {
  date: Date;
  meal: string;
  calories: number;
};

export type ActivityLog = {
  date: Date;
  activity: ActivityType;
  calories: number;
};

export type PersonalInfo = {
  weightKg: number; // in kg
  heightCm: number; // in cm
  age: number; // in years
  gender: Gender;
  activityLevel: keyof typeof ActivityLevel;
  dailyCalorieRequirement: number;
};

import React, { useEffect, useState } from "react";
import {
  getPersonalInfo, savePersonalInfo
} from "../../shared/db/personalInfo";
import { calorieCalculator, printActivityLevel } from "../../shared/functions";
import { ActivityLevel, Gender, PersonalInfo } from "../../shared/types";
import Layout from "../Layout";

const PersonalInfoForm: React.FC = () => {
  const [height, setHeight] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);
  const [age, setAge] = useState<number>(0);
  const [gender, setGender] = useState<Gender>("female");
  const [activityLevel, setActivityLevel] =
    useState<keyof typeof ActivityLevel>("lightExercise");
  const [dailyCalorieRequirement, setDailyCalorieRequirement] = useState<
    number | undefined
  >();

  useEffect(() => {
    getPersonalInfo().then((personal) => {
      if (personal) {
        setHeight(personal.heightCm);
        setWeight(personal.weightKg);
        setAge(personal.age);
        setGender(personal.gender);
        setDailyCalorieRequirement(personal.dailyCalorieRequirement);
      } else {
        // console.log("No PersonalInfo found");
      }
    });
  }, []);

  const heightHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHeight(Number(event.target.value));
  };

  const weightHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWeight(Number(event.target.value));
  };

  const ageHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAge(Number(event.target.value));
  };

  const genderHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setGender(event.target.value as Gender);
  };

  const activityLevelHandler = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setActivityLevel(event.target.value as keyof typeof ActivityLevel);
  };

  const cancelHandler = () => {
    setHeight(0);
    setWeight(0);
    setAge(0);
    setGender("female");
    setDailyCalorieRequirement(undefined);
  };

  const saveHandler = async () => {
    const dailyCalorieRequirement = calorieCalculator({
      heightCm: height,
      weightKg: weight,
      age: age,
      gender: gender,
      activityLevel: activityLevel,
    });
    setDailyCalorieRequirement(dailyCalorieRequirement);

    const personalInfo: PersonalInfo = {
      heightCm: height,
      weightKg: weight,
      age: age,
      gender: gender,
      activityLevel: activityLevel,
      dailyCalorieRequirement: dailyCalorieRequirement,
    };

    await savePersonalInfo(personalInfo);
  };

  const enableSave = (): boolean => {
    return height > 0 && weight > 0 && age > 0;
  };

  return (
    <Layout>
      <div>
        <div>
          {dailyCalorieRequirement && (
            <DailyCalorieRequirementBanner
              dailyCalorieRequirement={dailyCalorieRequirement}
            />
          )}
        </div>

        <div className="bg-gray-50 p-14 rounded-md">
          <div className="text-2xl font-bold mb-4" data-testid="personal">My Information</div>

          <div>
            <form className="space-y-4">
              <div className="flex flex-col items-start">
                <label htmlFor="height" className="mr-2">
                  Height (cm)
                </label>
                <input
                  type="number"
                  id="height"
                  value={height}
                  onChange={heightHandler}
                  className="border border-gray-300 rounded px-2 py-1"
                  data-testid="height"
                />
              </div>
              <div className="flex flex-col items-start">
                <label htmlFor="weight" className="mr-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  id="weight"
                  value={weight}
                  onChange={weightHandler}
                  className="border border-gray-300 rounded px-2 py-1"
                  data-testid="weight"
                />
              </div>
              <div className="flex flex-col items-start">
                <label htmlFor="age" className="mr-2">
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  value={age}
                  onChange={ageHandler}
                  className="border border-gray-300 rounded px-2 py-1"
                  data-testid="age"
                />
              </div>
              <div className="flex flex-col items-start">
                <label htmlFor="gender" className="mr-2">
                  Gender
                </label>
                <select
                  id="gender"
                  value={gender}
                  onChange={genderHandler}
                  className="border border-gray-300 rounded px-2 py-1"
                  data-testid="gender"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
              </div>

              <div className="flex flex-col items-start">
                <label htmlFor="activityLevel" className="mr-2">
                  Activity Level
                </label>
                <select
                  id="activityLevel"
                  value={activityLevel}
                  onChange={activityLevelHandler}
                  className="border border-gray-300 rounded px-2 py-1"
                  data-testid="activity"
                >
                  {Object.keys(ActivityLevel).map((key) => (
                    <option key={key} value={key}>
                      {printActivityLevel(key as keyof typeof ActivityLevel)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end pt-6">
                <button
                  type="button"
                  onClick={cancelHandler}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded mr-2"
                  data-testid="cancel"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveHandler}
                  disabled={!enableSave()}
                  className={`${
                    !enableSave() ? `bg-blue-200` : `bg-blue-500`
                  } text-white px-4 py-2 rounded`}
                  data-testid="save"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const DailyCalorieRequirementBanner = ({
  dailyCalorieRequirement,
}: {
  dailyCalorieRequirement: number;
}) => {
  return (
    <div className="bg-yellow-50 rounded-md px-2 py-2 my-2" data-testid="dailyCalorieRequirementBanner">
      <div className="text-gray-900 text-center text-sm font-medium">
        Your daily calorie requirement is {dailyCalorieRequirement}
      </div>
    </div>
  );
};

export default PersonalInfoForm;

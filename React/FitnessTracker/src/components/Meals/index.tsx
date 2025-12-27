import React, { useEffect, useState } from "react";
import Layout from "../Layout";
import { getMealLogs, saveMealLog } from "../../shared/db/meals";
import { MealLog } from "../../shared/types";

const Meals: React.FC = () => {
  const [mealName, setMealName] = useState("");
  const [calories, setCalories] = useState("");
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const [mealLogs, setMealLogs] = useState<MealLog[]>([]);

  useEffect(() => {
    getMealLogs().then((logs) => {
      if (logs.length > 0) {
        setMealLogs(logs);
      }
    });
  }, []);

  const handleMealNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMealName(event.target.value);
    setIsSaveEnabled(event.target.value !== "" && calories !== "");
  };

  const handleCaloriesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCalories(event.target.value);
    setIsSaveEnabled(mealName !== "" && event.target.value !== "");
  };

  const handleSave = async () => {
    await saveMealLog({
      meal: mealName,
      calories: Number(calories),
      date: new Date(),
    });
    await getMealLogs().then((meals) => {
      setMealLogs(meals);
    });

    resetForm();
  };

  const resetForm = () => {
    setMealName("");
    setCalories("");
    setIsSaveEnabled(false);
  };

  const handleCancel = () => {
    resetForm();
  };

  return (
    <Layout>
      {mealLogs.length > 0 && (
        <div className="px-10">
          <DisplayMealLogs mealLogs={mealLogs} />
        </div>
      )}
      <div className="bg-gray-50 p-14 rounded-md">
        <div>
          <div className="text-2xl font-bold mb-4" data-testid="meals">
            Add Meal
          </div>
          <form className="space-y-4">
            <div className="flex flex-col items-start">
              <label htmlFor="mealName" className="mr-2">
                Name
              </label>
              <input
                type="text"
                id="mealName"
                value={mealName}
                onChange={handleMealNameChange}
                className="border border-gray-300 rounded px-2 py-1"
                data-testid="meal-name"
              />
            </div>
            <div className="flex flex-col items-start">
              <label htmlFor="calories" className="mr-2">
                Calories
              </label>
              <input
                type="number"
                id="calories"
                value={calories}
                onChange={handleCaloriesChange}
                className="border border-gray-300 rounded px-2 py-1"
                data-testid="calories"
              />
            </div>

            <div className="flex justify-end pt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!isSaveEnabled}
                className={`${
                  !isSaveEnabled ? `bg-blue-200` : `bg-blue-500`
                } text-white px-4 py-2 rounded`}
                data-testid="save-meal"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

const DisplayMealLogs = ({ mealLogs }: { mealLogs: MealLog[] }) => {
  return (
    <div className="bg-yellow-50 p-14 rounded-md" data-testid="meal-logs-table">
      <div className="text-2xl font-bold mb-4">Meal Logs</div>
      <div>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="text-left border-b border-gray-300 py-2 px-4">
                Meal
              </th>
              <th className="text-left border-b border-gray-300 py-2 px-4">
                Calories
              </th>
              <th className="text-left border-b border-gray-300 py-2 px-4">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {mealLogs.map((mealLog, idx) => (
              <tr key={idx}>
                <td className="border-b border-gray-300 py-2 px-4">
                  {mealLog.meal}
                </td>
                <td className="border-b border-gray-300 py-2 px-4">
                  {mealLog.calories}
                </td>
                <td className="border-b border-gray-300 py-2 px-4">
                  {mealLog.date.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Meals;

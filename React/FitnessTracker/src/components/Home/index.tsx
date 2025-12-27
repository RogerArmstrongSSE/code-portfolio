import React, { useEffect, useState } from "react";
import Layout from "../Layout";
import { ActivityLog, MealLog, PersonalInfo } from "../../shared/types";
import { getPersonalInfo } from "../../shared/db/personalInfo";
import { getActivityLogs } from "../../shared/db/activity";
import { getMealLogs } from "../../shared/db/meals";
import { TableRow, getTableRows, getTotalCalories } from "./summary";
import { clearDatabase } from "../../shared/db";

const Home: React.FC = () => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>();
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [mealLogs, setMealLogs] = useState<MealLog[]>([]);
  const [tableRows, setTableRows] = useState<TableRow[]>([]);

  useEffect(() => {
    const fetchAllData = async () => {
      const personalInfo = await getPersonalInfo();
      setPersonalInfo(personalInfo);

      const activityLogs = await getActivityLogs();
      setActivityLogs(activityLogs);

      const mealLogs = await getMealLogs();
      setMealLogs(mealLogs);
    };

    fetchAllData().then(() => {
      // console.table(personalInfo);
      // console.table(activityLogs);
      // console.table(mealLogs);
    });
  }, []);

  const handleClearDatabase = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await clearDatabase();
    window.location.reload();
  };

  useEffect(() => {
    if (!mealLogs || !activityLogs) return;
    const tableRows: TableRow[] = getTableRows(mealLogs, activityLogs);
    setTableRows(tableRows);
  }, [mealLogs, activityLogs]);

  const totalCalories = getTotalCalories(tableRows);

  if (!mealLogs || !activityLogs || !personalInfo) {
    return (
      <Layout>
        <div data-testid="home">Home</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col w-9/12">
        <div className="text-2xl font-bold mb-4" data-testid="home">
          Dashboard
        </div>
        <div className="bg-gray-50 rounded-md">
          <table className="w-full border border-gray-300">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Log</th>
                <th className="px-4 py-2 text-left">Time</th>
                <th className="px-4 py-2 text-left">Calories</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, index) => (
                <React.Fragment key={index}>
                  <tr className={index % 2 === 0 ? "bg-gray-100" : ""}>
                    <td className="px-4 py-2">
                      {row.entryType === "activity" ? "Did" : "Consumed"}{" "}
                      {row.name.toLowerCase()}
                    </td>
                    <td className="px-4 py-2">{row.date.toLocaleString()}</td>
                    <td className="px-4 py-2">
                      {row.entryType === "activity" ? "-" : "+"} {row.calories}
                    </td>
                  </tr>
                  {index !== tableRows.length && (
                    <tr>
                      <td colSpan={3} className="border-t border-gray-300"></td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              <tr>
                <td className="px-4 py-2 font-bold">Net Calories Consumed</td>
                <td className="px-4 py-2 font-bold">{totalCalories}</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-bold">Daily Calories Required</td>
                <td className="px-4 py-2 font-bold">
                  {personalInfo?.dailyCalorieRequirement}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-bold">Balance</td>
                <td className="px-4 py-2 font-bold">
                  {(personalInfo?.dailyCalorieRequirement as number) -
                    totalCalories}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex flex-col w-48">
          <button
            onClick={handleClearDatabase}
            className="text-sm mt-2 text-indigo-600 hover:text-indigo-500 py-1 bg-red-100"
          >
            Clear Database
          </button>
        </div>
      </div>
      
    </Layout>
  );
};

export default Home;

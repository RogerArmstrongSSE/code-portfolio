import React, { useEffect, useState } from "react";
import { getActivityLogs, saveActivityLog } from "../../shared/db/activity";
import { getPersonalInfo } from "../../shared/db/personalInfo";
import {
  getActivity,
  estimatedCalorieBurnCalculator
} from "../../shared/functions";
import { ActivityLog, ActivityType, PersonalInfo } from "../../shared/types";
import Layout from "../Layout";

const Activity: React.FC = () => {
  const [activityType, setActivityType] = useState("Running");
  const [time, setTime] = useState<number | undefined>(undefined);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [timer, setTimer] = useState<number | undefined>(undefined);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    getActivityLogs().then((activities) => {
      if (activities.length > 0) {
        setActivityLogs(activities);
      }
    });
  }, []);

  const handleActivityTypeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setActivityType(event.target.value);
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTime(Number(event.target.value));
  };

  const handleStartTimer = () => {
    let seconds = 0;
    const intervalId = setInterval(() => {
      seconds++;
      setSecondsElapsed(seconds);
    }, 1000);
    setTimer(intervalId as unknown as number);
    // console.log(intervalId, "is set");
  };

  const handleStopTimer = () => {
    setTime(secondsElapsed ? secondsElapsed / 60 : undefined);
    setTimer(undefined);
    // console.log(timer, "is cleared");
    clearInterval(timer as number);
  };

  const resetForm = () => {
    setTime(0);
    setSecondsElapsed(0);
    setActivityType("Running");
    setTimer(undefined);
  };

  const handleCancel = () => {
    resetForm();
  };

  const isSaveDisabled = () => {
    return !time || time === 0;
  }

  const handleSave = async () => {
    const activity = getActivity(activityType) as ActivityType;
    const personalInfo = (await getPersonalInfo()) as PersonalInfo;

    console.log(personalInfo);
    
    const estimatedCaloriesBurned = estimatedCalorieBurnCalculator(
      activity,
      personalInfo.weightKg,
      time as number
    );

    await saveActivityLog({
      activity,
      date: new Date(),
      calories: estimatedCaloriesBurned,
    });
    resetForm();

    getActivityLogs().then((activities) => {
      setActivityLogs(activities);
    });
    
  };

  return (
    <Layout>
      {activityLogs.length > 0 && (
        <div className="px-10">
          <DisplayActivityLogs activityLogs={activityLogs} />
        </div>
      )}
      <div className="bg-gray-50 p-14 rounded-md" data-testid="activity">
        <h1 className="text-2xl font-bold mb-4">Add Activity</h1>
        <form>
          <div className="mb-4">
            <label htmlFor="activityType" className="block font-bold mb-2">
              Activity Type
            </label>
            <select
              id="activityType"
              className="border border-gray-300 rounded px-3 py-2 w-full"
              value={activityType}
              onChange={handleActivityTypeChange}
            >
              <option value="Running">Running</option>
              <option value="Swimming">Swimming</option>
              <option value="Walking">Walking</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="time" className="block font-bold mb-2">
              Time (min)
            </label>
            <input
              type="number"
              id="time"
              className="border border-gray-300 rounded px-3 py-2 w-full"
              value={time}
              onChange={handleTimeChange}
              data-testid="activity-time-min"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="timer" className="block font-bold mb-2">
              Timer
            </label>
            {timer ? (
              <div>
                <span className="mr-2">{secondsElapsed} seconds</span>
                <button
                  type="button"
                  className="text-blue-500 hover:underline"
                  onClick={handleStopTimer}
                >
                  Stop
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="text-blue-500 hover:underline"
                onClick={handleStartTimer}
              >
                Start
              </button>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isSaveDisabled()}
              className={`${isSaveDisabled()? `bg-blue-200` : `bg-blue-500 hover:bg-blue-700`}  text-white font-bold py-2 px-4 rounded`}
              onClick={handleSave}
              data-testid="save-activity"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

const DisplayActivityLogs = ({
  activityLogs,
}: {
  activityLogs: ActivityLog[];
}) => {
  return (
    <div className="bg-yellow-50 p-14 rounded-md" data-testid="activity-log-table">
      <div className="text-2xl font-bold mb-4">Activity Logs</div>
      <div>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="text-left border-b border-gray-300 py-2 px-4">
                Activity
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
            {activityLogs.map((log, idx) => (
              <tr key={idx}>
                <td className="border-b border-gray-300 py-2 px-4">
                  {log.activity}
                </td>
                <td className="border-b border-gray-300 py-2 px-4">
                  {log.calories}
                </td>
                <td className="border-b border-gray-300 py-2 px-4">
                  {log.date.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Activity;

import { ActivityLog, MealLog } from "../../shared/types";

export type TableRow = {
  name: string;
  calories: number;
  entryType: "meal" | "activity";
  date: Date;
};

export const mealLogsToTableRows = (mealLogs: MealLog[]): TableRow[] => {
  return mealLogs.map((mealLog) => ({
    name: mealLog.meal,
    calories: mealLog.calories,
    entryType: "meal",
    date: mealLog.date,
  }));
};

export const activityLogsToTableRows = (
  activityLogs: ActivityLog[]
): TableRow[] => {
  console.log("activity logs length: ", activityLogs.length);

  return activityLogs.map((activityLog) => ({
    name: activityLog.activity,
    calories: activityLog.calories,
    entryType: "activity",
    date: activityLog.date,
  }));
};

export const getTableRows = (
  mealLogs: MealLog[],
  activityLogs: ActivityLog[]
): TableRow[] => {
  const mealRows = mealLogsToTableRows(mealLogs);
  const activityRows = activityLogsToTableRows(activityLogs);

  console.log("meal rows length: ", mealRows.length);
  console.log("activity rows length: ", activityRows.length);

  return [...mealRows, ...activityRows].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );
};

export const getTotalCalories = (tableRows: TableRow[]) => {
  console.log("table rows length: ", tableRows.length);

  return tableRows.reduce((total, row) => {
    return row.entryType === "activity"
      ? total - row.calories
      : total + row.calories;
  }, 0);
};

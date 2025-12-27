import { getDatabase } from ".";
import { MealLog } from "../types";

export const saveMealLog = async (meal: MealLog) => {
  const db = await getDatabase();
  const tx = db.transaction("meals", "readwrite");
  await tx.store.put(meal);
  await tx.done;
};

export const getMealLogs = async (): Promise<MealLog[]> => {
  const db = await getDatabase();
  const tx = db.transaction("meals", "readonly");
  const records: MealLog[] = await tx.store.getAll();
  const logs = records.sort((a, b) => b.date.getTime() - a.date.getTime());
  await tx.done;
  return logs;
};

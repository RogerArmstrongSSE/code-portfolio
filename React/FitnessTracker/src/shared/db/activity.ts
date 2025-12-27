import { getDatabase } from ".";
import { ActivityLog } from "../types";

export const saveActivityLog = async (activity: ActivityLog) => {
  const db = await getDatabase();
  const tx = db.transaction("activities", "readwrite");
  await tx.store.put(activity);
  await tx.done;
};

export const getActivityLogs = async (): Promise<ActivityLog[]> => {
  const db = await getDatabase();
  const tx = db.transaction("activities", "readonly");
  const records: ActivityLog[] = await tx.store.getAll();
  const logs = records.sort((a, b) => b.date.getTime() - a.date.getTime());
  await tx.done;
  return logs;
};

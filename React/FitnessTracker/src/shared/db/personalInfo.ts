import { getDatabase } from ".";
import { PersonalInfo } from "../types";

export const savePersonalInfo = async (personalInfo: PersonalInfo) => {
  const db = await getDatabase();
  const tx = db.transaction("settings", "readwrite");
  await tx.store.put(personalInfo, 1);
  await tx.done;
};

export const getPersonalInfo = async (): Promise<PersonalInfo> => {
  const db = await getDatabase();
  const tx = db.transaction("settings", "readonly");
  const personalInfo = await tx.store.get(1);
  await tx.done;
  return personalInfo;
};

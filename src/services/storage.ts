import { del, get, set } from "idb-keyval";

export const persistentStorage = {
  getItem: async (name: string): Promise<string | null> =>
    (await get<string>(name)) ?? null,
  setItem: (name: string, value: string): Promise<void> => set(name, value),
  removeItem: (name: string): Promise<void> => del(name),
};

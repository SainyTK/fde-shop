import { hashPassword } from "@/services";
import type { Address, Result, Shop } from "@/types";
import {
  normalizeEmail,
  type RegisterInput,
  registerUser,
  validateRegistration,
} from "@/utils";
import { now } from "./clock";
import type { ActionCreator } from "./types";

const AVATAR_COLORS = [
  "#ee4d2d",
  "#2563eb",
  "#16a34a",
  "#9333ea",
  "#0891b2",
  "#db2777",
];

export type RegisterForm = Omit<RegisterInput, "passwordHash"> & {
  password: string;
};

export type ProfileInput = {
  name: string;
  phone: string;
  address: Address | null;
};

export type AccountActions = {
  login: (email: string, password: string) => Promise<Result>;
  register: (form: RegisterForm) => Promise<Result>;
  logout: () => void;
  updateProfile: (input: ProfileInput) => Result;
  updateShop: (shop: Shop) => Result;
};

export const createAccountActions: ActionCreator<AccountActions> = (
  set,
  get,
) => ({
  login: async (email, password) => {
    const user = get().data.users.find(
      (item) => item.email === normalizeEmail(email),
    );
    const hash = await hashPassword(password);
    if (!user || user.passwordHash !== hash) {
      return { ok: false, error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" };
    }
    set((state) => ({ data: { ...state.data, sessionUserId: user.id } }));
    return { ok: true, value: null };
  },
  register: async (form) => {
    const problem = validateRegistration(form);
    if (problem) {
      return { ok: false, error: problem };
    }
    const data = get().data;
    const result = registerUser(
      data,
      { ...form, passwordHash: await hashPassword(form.password) },
      AVATAR_COLORS[data.users.length % AVATAR_COLORS.length],
      now(),
    );
    if (!result.ok) {
      return result;
    }
    set({ data: result.value.data });
    return { ok: true, value: null };
  },
  logout: () =>
    set((state) => ({ data: { ...state.data, sessionUserId: null } })),
  updateProfile: (input) => {
    const userId = get().data.sessionUserId;
    if (input.name.trim().length < 2) {
      return { ok: false, error: "กรุณากรอกชื่อ" };
    }
    if (!/^0\d{8,9}$/.test(input.phone.trim())) {
      return { ok: false, error: "เบอร์โทรต้องขึ้นต้นด้วย 0 และมี 9-10 หลัก" };
    }
    set((state) => ({
      data: {
        ...state.data,
        users: state.data.users.map((user) =>
          user.id === userId
            ? {
                ...user,
                name: input.name.trim(),
                phone: input.phone.trim(),
                address: input.address,
              }
            : user,
        ),
      },
    }));
    return { ok: true, value: null };
  },
  updateShop: (shop) => {
    const userId = get().data.sessionUserId;
    if (shop.name.trim().length < 3) {
      return { ok: false, error: "ชื่อร้านต้องมีอย่างน้อย 3 ตัวอักษร" };
    }
    if (!/^(0\d{9}|\d{13})$/.test(shop.promptPayId.trim())) {
      return {
        ok: false,
        error: "พร้อมเพย์ต้องเป็นเบอร์มือถือ 10 หลักหรือเลขบัตรประชาชน 13 หลัก",
      };
    }
    set((state) => ({
      data: {
        ...state.data,
        users: state.data.users.map((user) =>
          user.id === userId ? { ...user, shop } : user,
        ),
      },
    }));
    return { ok: true, value: null };
  },
});

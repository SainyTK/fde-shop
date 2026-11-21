export type Role = "buyer" | "seller";

export type Address = {
  recipient: string;
  phone: string;
  line: string;
  district: string;
  province: string;
  postcode: string;
};

export type User = {
  id: string;
  role: Role;
  name: string;
  email: string;
  passwordHash: string;
  phone: string;
  createdAt: string;
  address: Address | null;
  shop: Shop | null;
};

export type Shop = {
  name: string;
  tagline: string;
  avatarColor: string;
  promptPayId: string;
  bankAccountName: string;
  location: string;
};

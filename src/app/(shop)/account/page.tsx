"use client";

import { AddressCard, LogoutButton, ProfileForm } from "@/components/account";
import { LoadingScreen, PageTitle, Panel } from "@/components/common";
import { useRoleGuard } from "@/hooks";

export default function AccountPage() {
  const buyer = useRoleGuard("buyer");
  if (!buyer) {
    return <LoadingScreen />;
  }
  return (
    <>
      <PageTitle title="บัญชีของฉัน" />
      <Panel title="ข้อมูลส่วนตัว">
        <ProfileForm user={buyer} />
      </Panel>
      <Panel title="ที่อยู่จัดส่ง">
        <AddressCard user={buyer} />
      </Panel>
      <LogoutButton />
    </>
  );
}

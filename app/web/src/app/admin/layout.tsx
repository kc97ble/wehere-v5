"use client";

import { ConfigProvider } from "antd";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConfigProvider>
      {children}
    </ConfigProvider>
  );
}
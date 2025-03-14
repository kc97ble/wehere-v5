"use client";

import { Layout, Menu, Typography } from "antd";
import Link from "next/link";
import React from "react";

import { ConfigProvider } from "antd";
import { AdminLayoutContext } from "./utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [slots, setSlots] = React.useState<Record<string, React.ReactNode>>({});

  const context: AdminLayoutContext = React.useMemo(
    () => ({
      registerPrimarySlot: (key, node) => {
        setSlots((slots) => ({ ...slots, [key]: node }));
      },
      unregisterPrimarySlot: (key) => {
        setSlots((slots) => ({ ...slots, [key]: null }));
      },
    }),
    []
  );

  return (
    <AdminLayoutContext.Provider value={context}>
      <ConfigProvider>
        <Layout style={{ minHeight: "100vh" }}>
          <Layout.Header
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "24px",
            }}
          >
            <div>
              <Typography.Text
                strong
                style={{ fontSize: "18px", color: "#fff" }}
              >
                {"WeHere Admin"}
              </Typography.Text>
            </div>
            <Menu
              theme="dark"
              mode="horizontal"
              style={{ flex: "1 1 auto" }}
              items={[
                {
                  key: "manage-posts",
                  label: <Link href="/admin/manage-posts">{"Posts"}</Link>,
                },
                // {
                //   key: "postman",
                //   label: <Link href="/admin/postman">{"Postman"}</Link>,
                // },
                // {
                //   key: "upload-image",
                //   label: <Link href="/admin/upload-image">{"Upload Image"}</Link>,
                // },
              ]}
            />
            {Object.values(slots).map((node, index) =>
              node == null ? undefined : (
                <React.Fragment key={index}>{node}</React.Fragment>
              )
            )}
          </Layout.Header>
          <Layout.Content
            style={{
              background: "#f5f8ff",
              display: "flex",
              flex: "1 0 auto",
              flexDirection: "column",
            }}
          >
            {children}
          </Layout.Content>
        </Layout>
      </ConfigProvider>
    </AdminLayoutContext.Provider>
  );
}

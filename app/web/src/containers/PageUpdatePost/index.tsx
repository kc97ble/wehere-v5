"use client";

import { Breadcrumb, Layout, Menu, Space, Typography, message } from "antd";
import Link from "next/link";
import React from "react";
import { AutoField, AutoForm, ErrorsField, SubmitField } from "uniforms-antd";
import ZodBridge from "uniforms-bridge-zod";
import { z } from "zod";
import { Section } from "../../typing/common";
import SectionListField from "./components/SectionListField";
import useIsMounted from "./hooks/useIsMounted";

type FormSchema = z.infer<typeof FormSchema>;
const FormSchema = z.object({
  title: z.string(),
  sections: z.array(Section),
});

const formBridge = new ZodBridge({ schema: FormSchema });

type Props = {
  postId: string;
  initialData: {
    title: string;
    sections: Section[];
  };
};

export default function PageUpdatePost({ postId, initialData }: Props) {
  const mounted = useIsMounted();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleSubmit = async (model: FormSchema) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/post/UpdatePost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          title: model.title,
          sections: model.sections,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update post");
      }

      const data = await response.json();
      if (data.success) {
        messageApi.success("Post updated successfully!");
      } else {
        messageApi.warning("Update was not successful");
      }
    } catch (error) {
      messageApi.error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {contextHolder}
      <Layout.Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "24px",
        }}
      >
        <div>
          <Typography.Text strong style={{ fontSize: "18px", color: "#fff" }}>
            {"WeHere Admin"}
          </Typography.Text>
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          style={{ flex: "1 1 auto" }}
          items={[
            {
              key: "postman",
              label: <Link href="/postman">Postman</Link>,
            },
          ]}
        />
      </Layout.Header>
      <Layout.Content style={{ padding: "24px", background: "#f5f8ff" }}>
        <Space
          direction="vertical"
          size="middle"
          style={{ display: "flex", maxWidth: "800px", margin: "0 auto" }}
        >
          <Breadcrumb
            items={[{ title: initialData.title }, { title: "Update Post" }]}
          />
          <Typography.Title level={3}>{initialData.title}</Typography.Title>

          {mounted ? (
            <AutoForm
              model={initialData}
              schema={formBridge}
              onSubmit={handleSubmit}
              disabled={isSubmitting}
            >
              <AutoField name="title" />
              <SectionListField name="sections" />
              <ErrorsField />
              <SubmitField loading={isSubmitting} />
            </AutoForm>
          ) : undefined}
        </Space>
      </Layout.Content>
    </Layout>
  );
}

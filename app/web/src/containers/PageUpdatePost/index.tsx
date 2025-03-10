"use client";

import { RollbackOutlined, SaveOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Flex, Space, Typography, message } from "antd";
import React from "react";
import { AutoField, AutoForm, ErrorsField } from "uniforms-antd";
import ZodBridge from "uniforms-bridge-zod";
import { Section } from "web/typing/common";
import { z } from "zod";
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

// TODO: move to app/web/src/app/admin/update-post/containers/PageUpdatePost.tsx
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
    <Space
      direction="vertical"
      size="middle"
      style={{
        display: "flex",
        width: "100%",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      {contextHolder}
      <Breadcrumb
        items={[{ title: initialData.title }, { title: "Update Post" }]}
      />
      <Typography.Title level={1}>{initialData.title}</Typography.Title>

      {mounted ? (
        <AutoForm
          model={initialData}
          schema={formBridge}
          onSubmit={handleSubmit}
          disabled={isSubmitting}
        >
          <Flex vertical gap="middle">
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                icon={<SaveOutlined />}
              >
                {"Save Changes"}
              </Button>
              <Button
                icon={<RollbackOutlined />}
                onClick={() => window.history.back()}
              >
                {"Cancel"}
              </Button>
            </Space>

            <AutoField name="title" />
            <SectionListField name="sections" />
            <ErrorsField />
          </Flex>
        </AutoForm>
      ) : undefined}
    </Space>
  );
}

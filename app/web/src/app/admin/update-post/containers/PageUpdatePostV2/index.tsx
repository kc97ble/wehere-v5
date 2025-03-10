"use client";

import { EyeOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import cx from "clsx";
import React from "react";
import { AdminLayoutContext } from "web/app/admin/utils";
import { PrUpdatePost, RsGetPost, RsUpdatePost } from "web/app/api/post/typing";
import { httpPost } from "web/utils/client/http";
import MetadataEditor, { Metadata } from "./components/MetadataEditor";
import SectionListEditor from "./components/SectionListEditor";
import styles from "./index.module.scss";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  postId: string;
  initialData: RsGetPost["post"];
};

export default function PageUpdatePostV2({
  className,
  style,
  postId,
  initialData,
}: Props) {
  const [messageApi, contextHolder] = message.useMessage();

  const [metadata, setMetadata] = React.useState<Metadata>({
    title: initialData.title,
    tags: initialData.tags,
    postedAt: initialData.postedAt ? new Date(initialData.postedAt) : undefined,
  });
  const [sections, setSections] = React.useState(initialData.sections || []);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [dirty, setDirty] = React.useState(false);

  const adminLayoutContext = React.useContext(AdminLayoutContext);

  const handleSubmit = React.useCallback(async () => {
    try {
      setIsSubmitting(true);
      await httpPost(RsUpdatePost, "/api/post/UpdatePost", {
        postId,
        sections,
        title: metadata.title,
        tags: metadata.tags,
        postedAt: metadata.postedAt?.valueOf() ?? null,
      } satisfies PrUpdatePost);
      messageApi.success("Post updated successfully!");
      setDirty(false);
    } catch (error) {
      messageApi.error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [metadata, sections, messageApi, postId]);

  React.useEffect(() => {
    adminLayoutContext.registerPrimarySlot?.(
      "save",
      dirty ? (
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={handleSubmit}
          loading={isSubmitting}
        >
          {"Save changes"}
        </Button>
      ) : (
        <Button
          ghost
          type="default"
          variant="outlined"
          icon={<EyeOutlined />}
          onClick={() =>
            window.open(`/posts/${postId}`, "_blank", "noreferrer")
          }
        >
          {"View page"}
        </Button>
      )
    );
    return () => {
      adminLayoutContext.unregisterPrimarySlot?.("save");
    };
  }, [handleSubmit, isSubmitting, dirty, adminLayoutContext, postId]);

  // Handle page navigation confirmation when there are unsaved changes
  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!dirty) return;

      const message =
        "You have unsaved changes. Are you sure you want to leave?";

      // Modern browsers require both preventDefault and returnValue
      e.preventDefault();
      e.returnValue = message;

      return message;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [dirty]);

  return (
    <div className={cx(styles.container, className)} style={style}>
      {contextHolder}
      <MetadataEditor
        value={metadata}
        onChange={(metadata) => {
          setMetadata(metadata);
          setDirty(true);
        }}
      />
      <SectionListEditor
        value={sections}
        onChange={(sections) => {
          setSections(sections);
          setDirty(true);
        }}
      />
    </div>
  );
}

"use client";

import { EditOutlined, EyeOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import cx from "clsx";
import React from "react";
import { AdminLayoutContext } from "web/app/admin/utils";
import { PrUpdatePost, RsGetPost, RsUpdatePost } from "web/app/api/post/typing";
import { httpPost } from "web/utils/client/http";
import PreviewWrapper from "./components/PreviewWrapper";
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

  const [title, setTitle] = React.useState(initialData.title);
  const [sections, setSections] = React.useState(initialData.sections || []);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [dirty, setDirty] = React.useState(false);

  const adminLayoutContext = React.useContext(AdminLayoutContext);

  const handleSubmit = React.useCallback(async () => {
    try {
      setIsSubmitting(true);
      await httpPost(RsUpdatePost, "/api/post/UpdatePost", {
        postId,
        title,
        sections,
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
  }, [title, sections, messageApi, postId]);

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

  const renderTitleMenu = () => (
    <Button
      icon={<EditOutlined />}
      onClick={() => {
        const newTitle = window.prompt("Title", title);
        if (newTitle == null) return;
        setTitle(newTitle);
        setDirty(true);
      }}
    />
  );

  return (
    <div className={cx(styles.container, className)} style={style}>
      {contextHolder}
      <PreviewWrapper slotMenu={renderTitleMenu()}>
        <h1 className={styles.title}>{title}</h1>
      </PreviewWrapper>
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

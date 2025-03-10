import { EditOutlined } from "@ant-design/icons";
import { Button, Modal, Tag } from "antd";
import cx from "clsx";
import React from "react";
import { AutoForm } from "uniforms-antd";
import { ZodBridge } from "uniforms-bridge-zod";
import { z } from "zod";
import PreviewWrapper from "../PreviewWrapper";
import styles from "./index.module.scss";

// Function to format date in Vietnamese format like "26 tháng 2, 2025 12:30"
const formatDateToVietnamese = (date: Date): string => {
  const day = date.getDate();
  const month = date.getMonth() + 1; // getMonth() returns 0-11
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day} tháng ${month}, ${year} ${hours}:${minutes}`;
};

// Define the Zod schema for the form
export type Metadata = z.infer<typeof Metadata>;
export const Metadata = z.object({
  title: z.string().min(1, "Title is required"),
  tags: z.string().array(),
  postedAt: z.date().optional(),
});

// Create a bridge for uniforms
const formSchema = new ZodBridge({ schema: Metadata });

type RootProps = {
  className?: string;
  style?: React.CSSProperties;
  value: Metadata;
  onChange?: (value: Metadata) => void;
};

function Root({ className, style, value, onChange }: RootProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [formData, setFormData] = React.useState<Metadata>(value);

  // Handle form submission
  const handleSubmit = (data: Metadata) => {
    onChange?.(data);
    setIsModalOpen(false);
  };

  // Open modal with current data
  const openModal = () => {
    setFormData(value);
    setIsModalOpen(true);
  };

  // Close modal without saving
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const renderTitleMenu = () => (
    <Button icon={<EditOutlined />} onClick={openModal} />
  );

  // Display tags and posted date if available
  const renderMetadata = () => {
    return (
      <div className={styles.metadata}>
        {value.tags.length > 0 && (
          <div className={styles.tags}>
            {value.tags.map((tag, index) => (
              <Tag key={index}>{tag}</Tag>
            ))}
          </div>
        )}
        {value.postedAt && (
          <div className={styles.postedAt}>
            {formatDateToVietnamese(value.postedAt)}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className={cx(styles.Root, className)} style={style}>
        <PreviewWrapper slotMenu={renderTitleMenu()}>
          <h1 className={styles.title}>{value.title}</h1>
          {renderMetadata()}
        </PreviewWrapper>
      </div>

      {/* Metadata Editing Modal */}
      <Modal
        title="Edit Post Metadata"
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        width={600}
        maskClosable={false}
      >
        <AutoForm
          schema={formSchema}
          model={formData}
          onSubmit={handleSubmit}
          submitField={() => (
            <div className={styles.formButtons}>
              <Button onClick={closeModal} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </div>
          )}
        />
      </Modal>
    </>
  );
}

const MetadataEditor = Root;

export default MetadataEditor;

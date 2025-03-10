import { InboxOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  message,
  Space,
  Upload,
} from "antd";
import { RcFile } from "antd/es/upload";
import Image from "next/image";
import { useState } from "react";
import { SectionUnion } from "web/typing/common";
import styles from "./index.module.scss";

type Props = {
  initialValue: Extract<SectionUnion, { type: "IMG1" }>;
  onSubmit: (union: Extract<SectionUnion, { type: "IMG1" }>) => void;
  onCancel: () => void;
};

export default function ImageEditor({
  initialValue,
  onSubmit,
  onCancel,
}: Props) {
  const [value, setValue] =
    useState<Extract<SectionUnion, { type: "IMG1" }>>(initialValue);
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState<RcFile[]>([]);

  // Function to handle changes to the form fields
  const handleChange = (
    changes: Partial<Extract<SectionUnion, { type: "IMG1" }>>
  ) => {
    setValue({ ...value, ...changes });
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    // If no file is selected, just submit the current values
    if (fileList.length === 0) {
      // Check if we already have an image URL
      if (!value.url) {
        message.error("Please upload an image or provide a URL");
        return;
      }

      // Submit with existing values
      onSubmit(value);
      return;
    }

    // If a new file is selected, upload it
    const formData = new FormData();
    const file = fileList[0];

    formData.append("file", file as RcFile);
    formData.append("folder", "sections");

    setUploading(true);

    try {
      const response = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Upload failed");
      }

      message.success("Image uploaded successfully!");

      // Get image dimensions if available
      const img = new window.Image();
      img.onload = () => {
        const newValue = {
          ...value,
          url: result.data.url,
          intrinsicWidth: img.naturalWidth,
          intrinsicHeight: img.naturalHeight,
        };
        setValue(newValue);
        onSubmit(newValue);
      };
      img.onerror = () => {
        const newValue = {
          ...value,
          url: result.data.url,
        };
        setValue(newValue);
        onSubmit(newValue);
      };
      img.src = result.data.url;
    } catch (error) {
      console.error("Upload error:", error);
      message.error(
        `Upload failed: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setUploading(false);
    }
  };

  // Upload props configuration
  const uploadProps = {
    onRemove: () => {
      setFileList([]);
    },
    beforeUpload: (file: RcFile) => {
      // Check if file is an image
      if (!file.type.startsWith("image/")) {
        message.error(`${file.name} is not an image file`);
        return Upload.LIST_IGNORE;
      }

      // Check file size (max 5MB)
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("Image must be smaller than 5MB!");
        return Upload.LIST_IGNORE;
      }

      setFileList([file]);
      return false;
    },
    fileList,
  };

  return (
    <Card className={styles.container} variant="borderless">
      <Form layout="vertical">
        {value.url && value.intrinsicWidth && value.intrinsicHeight && (
          <Form.Item label="Current Image">
            <div className={styles.currentImage}>
              <div className={styles.previewContainer}>
                <Image
                  src={value.url}
                  alt="Current image"
                  className={styles.previewImage}
                  width={value.intrinsicWidth}
                  height={value.intrinsicHeight}
                  sizes="(max-width: 560px) 100vw, 560px"
                  priority={false}
                />
              </div>
            </div>
          </Form.Item>
        )}

        <Form.Item label="Upload Image">
          <Upload.Dragger {...uploadProps} listType="picture" maxCount={1}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag an image to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for a single image upload. Max size: 5MB.
            </p>
          </Upload.Dragger>
        </Form.Item>

        <Form.Item label="Image URL">
          <Input
            value={value.url}
            disabled
            placeholder="URL will be generated after upload"
          />
        </Form.Item>

        <Form.Item label="Maximum Display Width">
          <InputNumber
            value={value.maxWidth}
            onChange={(val) => handleChange({ maxWidth: val || undefined })}
            placeholder="Maximum width (in pixels)"
            addonAfter="px"
            style={{ width: "100%" }}
          />
          <div className={styles.hint}>Leave empty for 100% width</div>
        </Form.Item>

        <Form.Item className={styles.buttonGroup}>
          <Space>
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="primary" onClick={handleSubmit} loading={uploading}>
              {uploading ? "Uploading..." : "Save"}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
}

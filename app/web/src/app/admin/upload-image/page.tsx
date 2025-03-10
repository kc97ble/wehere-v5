"use client";

import { InboxOutlined } from "@ant-design/icons";
import { Button, Card, Divider, Input, Upload, message } from "antd";
import { RcFile } from "antd/es/upload";
import Image from "next/image";
import { useState } from "react";

export default function UploadImagePage() {
  const [fileList, setFileList] = useState<RcFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    message: string;
    data?: {
      id: string;
      url: string;
      fileType: string;
      fileName: string;
      fileSize: number;
    };
  } | null>(null);
  const [folder, setFolder] = useState("images");

  const handleUpload = async () => {
    const formData = new FormData();

    // Get the file from the fileList
    const file = fileList[0];
    if (!file) {
      message.error("Please select an image to upload");
      return;
    }

    formData.append("file", file as RcFile);

    // Add the folder if specified
    if (folder) {
      formData.append("folder", folder);
    }

    setUploading(true);
    setUploadResult(null);

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
      setUploadResult(result);
      setFileList([]);
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

  const props = {
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
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <Card title="Upload Image to S3">
        <div style={{ marginBottom: 16 }}>
          <Input
            addonBefore="Folder"
            placeholder="Enter folder path (optional)"
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            style={{ marginBottom: 16 }}
          />

          <Upload.Dragger {...props} maxCount={1} listType="picture">
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
        </div>

        <Button
          type="primary"
          onClick={handleUpload}
          disabled={fileList.length === 0}
          loading={uploading}
          style={{ marginTop: 16 }}
        >
          {uploading ? "Uploading..." : "Upload"}
        </Button>

        {uploadResult && (
          <>
            <Divider>Upload Result</Divider>
            <div>
              <h3>Uploaded Image</h3>
              <div style={{ marginBottom: 16 }}>
                <strong>File ID:</strong> {uploadResult.data?.id}
              </div>
              <div style={{ marginBottom: 16 }}>
                <strong>URL:</strong>{" "}
                <a
                  href={uploadResult.data?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {uploadResult.data?.url}
                </a>
              </div>
              <div
                style={{
                  marginBottom: 16,
                  position: "relative",
                  height: 300,
                  width: "100%",
                }}
              >
                {uploadResult.data && (
                  <Image
                    src={uploadResult.data.url}
                    alt="Uploaded"
                    style={{ objectFit: "contain" }}
                    fill
                    sizes="(max-width: 560px) 100vw, 560px"
                  />
                )}
              </div>
              <pre
                style={{
                  background: "#f5f5f5",
                  padding: 16,
                  borderRadius: 4,
                  overflow: "auto",
                }}
              >
                {JSON.stringify(uploadResult, null, 2)}
              </pre>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

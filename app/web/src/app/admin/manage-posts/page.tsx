"use client";

import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Alert,
  Button,
  Card,
  Form,
  Pagination,
  Space,
  Table,
  Typography,
  message,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getUrl, httpGet, httpPost } from "web/utils/client/http";
import {
  PrCreatePost,
  PrDeletePost,
  PrListPosts,
  RsCreatePost,
  RsDeletePost,
  RsListPosts,
} from "../../api/post/typing";
import ModalCreatePost from "./modals/ModalCreatePost";

export default function ManagePostPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // TODO: allow to use searchParams to navigate between pages

  const pageSize = 10;

  // Use React Query to fetch posts
  const { error, data, isLoading } = useQuery({
    queryKey: [
      "/api/post/ListPosts",
      {
        offset: (currentPage - 1) * pageSize,
        limit: pageSize,
        order: "DES",
      } satisfies PrListPosts,
    ] as const,
    queryFn: ({ queryKey: [pathName, query] }) =>
      httpGet(RsListPosts, getUrl(pathName, query), { cache: "no-store" }),
  });

  // Create a mutation for deleting posts
  const deleteMutation = useMutation({
    mutationFn: async (params: PrDeletePost) => {
      await httpPost(RsDeletePost, "/api/post/DeletePost", params);
    },
    onSuccess: () => {
      message.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["/api/post/ListPosts"] });
    },
    onError: (error) => {
      console.error("Error deleting post:", error);
      message.error("Failed to delete post");
    },
  });

  // Create a mutation for creating posts
  const createMutation = useMutation({
    mutationFn: async (params: PrCreatePost) =>
      await httpPost(RsCreatePost, "/api/post/CreatePost", params),
    onSuccess: (data) => {
      message.success("Post created successfully");
      form.resetFields();
      setIsModalOpen(false);
      router.push(getUrl("/admin/update-post", { postId: data.postId }));
    },
    onError: (error) => {
      console.error("Error creating post:", error);
      message.error("Failed to create post");
    },
  });

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: RsListPosts["posts"][number]) => (
        <Link href={`/posts/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (timestamp: number) => new Date(timestamp).toLocaleString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: RsListPosts["posts"][number]) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() =>
              router.push(getUrl("/admin/update-post", { postId: record.id }))
            }
            type="text"
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => deleteMutation.mutate({ postId: record.id })}
            type="text"
            danger
            loading={deleteMutation.isPending}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "16px",
          }}
        >
          <Typography.Title level={3}>{"Manage Posts"}</Typography.Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
          >
            {"Create New Post"}
          </Button>
        </div>

        {error && (
          <Alert
            message="Error"
            description={
              error instanceof Error ? error.message : "Failed to fetch posts"
            }
            type="error"
            showIcon
            style={{ marginBottom: "16px" }}
          />
        )}

        <Table
          dataSource={data?.posts || []}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={false}
        />

        <div style={{ marginTop: "16px", textAlign: "right" }}>
          <Pagination
            current={currentPage}
            total={data?.total || 0}
            pageSize={pageSize}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
          />
        </div>
      </Card>

      <ModalCreatePost
        open={isModalOpen}
        onSubmit={async (value) => {
          await createMutation.mutateAsync(value);
          setIsModalOpen(false);
        }}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
}

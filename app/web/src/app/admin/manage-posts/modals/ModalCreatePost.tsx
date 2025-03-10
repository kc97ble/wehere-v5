import { Form, Input, Modal } from "antd";
import React from "react";
import { PrCreatePost } from "web/app/api/post/typing";

type Props = {
  open: boolean;
  onSubmit?: (value: PrCreatePost) => void;
  onCancel?: () => void;
};

export default function ModalCreatePost({ open, onSubmit, onCancel }: Props) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = () => {
    form
      .validateFields()
      .then(async (values: PrCreatePost) => {
        setSubmitting(true);
        try {
          await Promise.resolve(onSubmit?.(values));
        } finally {
          setSubmitting(false);
        }
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel?.();
  };

  return (
    <Modal
      title="Create New Post"
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={submitting}
    >
      <Form form={form} layout="vertical" name="create_post_form">
        <Form.Item
          name="title"
          label="Post Title"
          rules={[
            { required: true, message: "Please enter a title for the post" },
            { min: 3, message: "Title must be at least 3 characters" },
          ]}
        >
          <Input placeholder="Enter post title" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

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
  
  // Generate default title with current date time
  const getDefaultTitle = () => {
    const now = new Date();
    const formattedTime = now.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    return `Untitled Post at ${formattedTime}`;
  };

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

  // Set default value when modal opens
  React.useEffect(() => {
    if (open) {
      form.setFieldsValue({
        title: getDefaultTitle()
      });
    }
  }, [open, form]);

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

"use client";

import { faker } from "@faker-js/faker";
import { Button, Divider, Input, Layout, Menu, Typography } from "antd";
import { useEffect, useState } from "react";
import { AutoForm } from "uniforms-antd";
import { ZodBridge } from "uniforms-bridge-zod";
import { ZodType } from "zod";
import {
  PrCreatePost,
  PrDeletePost,
  PrGetPost,
  PrListPosts,
} from "../api/post/typing";

const { Content, Sider } = Layout;
const { Title } = Typography;
const { TextArea } = Input;

type EndpointType<T> = {
  key: string;
  label: string;
  url: string;
  schema: ZodType<T>;
  schemaBridge: ZodBridge<T>;
};

// API Endpoints
const endpoints: EndpointType<unknown>[] = [
  {
    key: "CreatePost",
    label: "CreatePost",
    url: "/api/post/CreatePost",
    schema: PrCreatePost,
    schemaBridge: new ZodBridge({ schema: PrCreatePost }),
  },
  {
    key: "GetPost",
    label: "GetPost",
    url: "/api/post/GetPost",
    schema: PrGetPost,
    schemaBridge: new ZodBridge({ schema: PrGetPost }),
  },
  {
    key: "ListPosts",
    label: "ListPosts",
    url: "/api/post/ListPosts",
    schema: PrListPosts,
    schemaBridge: new ZodBridge({ schema: PrListPosts }),
  },
  {
    key: "DeletePost",
    label: "DeletePost",
    url: "/api/post/DeletePost",
    schema: PrDeletePost,
    schemaBridge: new ZodBridge({ schema: PrDeletePost }),
  },
];

// Separate Postman component
function Postman({ endpoint }: { endpoint: EndpointType<unknown> }) {
  const [response, setResponse] = useState<{
    status: number | string;
    data: unknown;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  // Create schema bridge for the endpoint

  const handleSubmit = async (data: unknown) => {
    setLoading(true);
    try {
      const response = await fetch(endpoint.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      setResponse({
        status: response.status,
        data: responseData,
      });
    } catch (error) {
      setResponse({
        status: "Error",
        data: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Title level={4}>{endpoint.label}</Title>
      <div style={{ marginBottom: "16px" }}>
        <code>{endpoint.url}</code>
      </div>

      <Divider>Request</Divider>
      <div style={{ marginBottom: "24px" }}>
        <AutoForm
          schema={endpoint.schemaBridge}
          onSubmit={handleSubmit}
          submitField={() => (
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ marginTop: "16px" }}
            >
              Submit
            </Button>
          )}
        />
      </div>

      <Divider>Response</Divider>
      <div>
        {response ? (
          <div>
            <div style={{ marginBottom: "8px" }}>
              <strong>Status:</strong> {response.status}
            </div>
            <TextArea
              value={JSON.stringify(response.data, null, 2)}
              readOnly
              rows={8}
              style={{ fontFamily: "monospace" }}
            />
          </div>
        ) : (
          <div style={{ color: "#999" }}>No response yet</div>
        )}
      </div>
    </>
  );
}

export default function PostmanPage() {
  const [selectedKey, setSelectedKey] = useState<string | undefined>(undefined);

  // Assign faker to window object
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Define a proper window interface extension
      interface CustomWindow extends Window {
        faker?: typeof faker;
      }

      // Apply the type to the window object
      (window as CustomWindow).faker = faker;
      console.log(
        "Faker assigned to window object. Access via window.faker or just faker in console."
      );
    }
  }, []);

  // Find the selected endpoint
  const selectedEndpoint = endpoints.find((e) => e.key === selectedKey);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={250}
        theme="light"
        style={{ borderRight: "1px solid #f0f0f0" }}
      >
        <div style={{ padding: "16px", fontWeight: "bold", fontSize: "18px" }}>
          Postman
        </div>
        <Menu
          mode="inline"
          selectedKeys={selectedKey ? [selectedKey] : []}
          items={endpoints.map((endpoint) => ({
            key: endpoint.key,
            label: endpoint.label,
          }))}
          onClick={({ key }) => {
            setSelectedKey(key);
          }}
        />
      </Sider>
      <Layout>
        <Content style={{ padding: "24px" }}>
          {selectedEndpoint ? (
            <Postman key={selectedEndpoint.key} endpoint={selectedEndpoint} />
          ) : (
            <div style={{ textAlign: "center", padding: "100px 0" }}>
              <Title level={4}>
                Please select an endpoint from the sidebar
              </Title>
            </div>
          )}
        </Content>
      </Layout>
    </Layout>
  );
}

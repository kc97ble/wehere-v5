"use client";

import { faker } from "@faker-js/faker";
import { Button, Divider, Input, Layout, Menu, Typography } from "antd";
import { useEffect, useState } from "react";
import { AutoForm } from "uniforms-antd";
import { ZodBridge } from "uniforms-bridge-zod";
import { getUrl, QueryObject } from "web/utils/client/http";
import { ZodType } from "zod";
import {
  PrCreatePost,
  PrDeletePost,
  PrGetPost,
  PrListPosts,
} from "../../api/post/typing";

const { Content, Sider } = Layout;
const { Title } = Typography;
const { TextArea } = Input;

type EndpointType<T> = {
  key: string;
  label: string;
  method: "GET" | "POST";
  url: `/${string}`;
  schema: ZodType<T>;
  schemaBridge: ZodBridge<T>;
};

// API Endpoints
const endpoints: EndpointType<unknown>[] = [
  {
    key: "CreatePost",
    label: "CreatePost",
    method: "POST",
    url: "/api/post/CreatePost",
    schema: PrCreatePost,
    schemaBridge: new ZodBridge({ schema: PrCreatePost }),
  },
  {
    key: "GetPost",
    label: "GetPost",
    method: "GET",
    url: "/api/post/GetPost",
    schema: PrGetPost,
    schemaBridge: new ZodBridge({ schema: PrGetPost }),
  },
  {
    key: "ListPosts",
    label: "ListPosts",
    method: "GET",
    url: "/api/post/ListPosts",
    schema: PrListPosts,
    schemaBridge: new ZodBridge({ schema: PrListPosts }),
  },
  {
    key: "DeletePost",
    label: "DeletePost",
    method: "POST",
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

  const doFetch = async (data: QueryObject) => {
    switch (endpoint.method) {
      case "GET":
        return await fetch(getUrl(endpoint.url, data), {
          method: "GET",
          headers: { Accepts: "application/json" },
        });
      case "POST":
        return await fetch(endpoint.url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
    }
  };

  const handleSubmit = async (data: QueryObject) => {
    setLoading(true);
    try {
      const response = await doFetch(data);
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

      <Divider>{"Request"}</Divider>
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
              {"Submit"}
            </Button>
          )}
        />
      </div>

      <Divider>{"Response"}</Divider>
      <div>
        {response ? (
          <div>
            <div style={{ marginBottom: "8px" }}>
              <strong>{"Status:"}</strong> {response.status}
            </div>
            <TextArea
              value={JSON.stringify(response.data, null, 2)}
              readOnly
              rows={8}
              style={{ fontFamily: "monospace" }}
            />
          </div>
        ) : (
          <div style={{ color: "#999" }}>{"No response yet"}</div>
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
      // Apply the type to the window object
      (window as unknown as Record<string, unknown>).faker = faker;
      console.log(
        "Faker assigned to window object. Access via window.faker or just faker in console."
      );
    }
  }, []);

  // Find the selected endpoint
  const selectedEndpoint = endpoints.find((e) => e.key === selectedKey);

  return (
    <Layout style={{ flex: "1 0 auto" }}>
      <Sider
        width={250}
        theme="light"
        style={{ borderRight: "1px solid #f0f0f0" }}
      >
        <div style={{ padding: "16px", fontWeight: "bold", fontSize: "18px" }}>
          {"Postman"}
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
                {"Please select an endpoint from the sidebar"}
              </Title>
            </div>
          )}
        </Content>
      </Layout>
    </Layout>
  );
}

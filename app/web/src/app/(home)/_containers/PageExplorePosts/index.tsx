"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { PrListPosts, RsListPosts } from "web/app/api/post/typing";
import { getUrl, httpGet } from "web/utils/client/http";

export default function PageExplorePosts() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading } = useQuery({
    queryKey: [
      "/api/post/ListPosts",
      {
        offset: (currentPage - 1) * pageSize,
        limit: pageSize,
        order: "DES",
      } satisfies PrListPosts,
    ] as const,
    queryFn: ({ queryKey: [pathName, query] }) =>
      httpGet(RsListPosts, getUrl(pathName, query), { cache: "force-cache" }),
  });

  return (
    <div style={{ padding: "20px" }}>
      <div>
        <h1>Explore Posts</h1>

        <div style={{ marginTop: "16px" }}>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div>
              {data?.posts.map((post) => (
                <div key={post.id} style={{ marginBottom: "16px" }}>
                  <Link href={`/posts/${post.id}`}>
                    <h2>{post.title}</h2>
                  </Link>
                  <p>{new Date(post.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ marginTop: "16px", textAlign: "right" }}>
          {/* <Pagination
            current={currentPage}
            total={data?.total || 0}
            pageSize={pageSize}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
          /> */}
        </div>
      </div>
    </div>
  );
}

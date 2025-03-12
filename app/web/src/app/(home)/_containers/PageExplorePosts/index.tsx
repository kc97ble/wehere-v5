"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import Link from "next/link";
import { PrListPosts, RsListPosts } from "web/app/api/post/typing";
import { getUrl, httpGet } from "web/utils/client/http";
import styles from "./index.module.scss";

export default function PageExplorePosts() {
  const pageSize = 10;

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["/api/post/ListPosts"],
      queryFn: async ({ pageParam }) => {
        const query = {
          offset: pageParam,
          limit: pageSize,
          order: "DES",
        } satisfies PrListPosts;

        return httpGet(RsListPosts, getUrl("/api/post/ListPosts", query), {
          cache: "force-cache",
        });
      },
      getNextPageParam: (lastPage, allPages) => {
        const loadedPosts = allPages.reduce(
          (total, page) => total + page.posts.length,
          0
        );
        return loadedPosts < lastPage.total ? loadedPosts : undefined;
      },
      initialPageParam: 0,
    });

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  return (
    <div className={styles.container}>
      <h1>Explore Posts</h1>

      <div className={styles.postsContainer}>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className={styles.postsList}>
              {posts.map((post) => (
                <div key={post.id} className={styles.postItem}>
                  <Link href={`/posts/${post.id}`}>
                    <h2>{post.title}</h2>
                  </Link>
                  <p>{new Date(post.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>

            {hasNextPage && (
              <div className={styles.loadMoreContainer}>
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className={styles.loadMoreButton}
                >
                  {isFetchingNextPage ? "Loading more..." : "Load More"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

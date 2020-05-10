import React from "react";
import PostList from "./PostList";
import { assertDataPresent } from "../types";
import useApi from "../api/useReadApi";
import LoadingIndicator from "../LoadingIndicator";
import useAppSelector from "useAppSelector";

export default function PostListPageMain() {
  const { orderBy, direction } = useAppSelector((state) => ({
    orderBy: state.blogListOptions.sortBy,
    direction: state.blogListOptions.order,
  }));
  const { loading, error, data } = useApi(
    `http://localhost:7000/posts?full&orderBy=${orderBy}&direction=${direction}`
  );

  if (loading) {
    return <LoadingIndicator>Posts are loading. Please wait.</LoadingIndicator>;
  }

  if (error) {
    return <h1>REST Request Failed: {error.toString()}</h1>;
  }

  // data is either PostListQuery or undefined
  assertDataPresent(data);

  // data is now PostListQuery
  return <PostList posts={data} />;
}

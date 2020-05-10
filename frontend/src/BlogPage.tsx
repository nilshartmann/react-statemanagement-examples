import React from "react";
import { Page, Main, Sidebar } from "Layout";
import PostList from "postlist/PostList";

type BlogPageProps = {
  children: React.ReactNode;
};

export default function BlogPage({ children }: BlogPageProps) {
  return (
    <Page>
      <Main>{children}</Main>
      <Sidebar>
        <h1>Last viewed</h1>
      </Sidebar>
    </Page>
  );
}

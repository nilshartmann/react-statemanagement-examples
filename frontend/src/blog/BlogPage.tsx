import React from "react";
import { Page, Main, Sidebar } from "Layout";
import ViewHistory from "./sidebar/ViewHistory";

type BlogPageProps = {
  children: React.ReactNode;
};

export default function BlogPage({ children }: BlogPageProps) {
  return (
    <Page>
      <Main>{children}</Main>
      <Sidebar>
        <ViewHistory />
      </Sidebar>
    </Page>
  );
}

import React from "react";
import { linkToPost, formattedDate } from "../../utils";
import { Link } from "react-router-dom";
import { createSelector } from "reselect";

import useAppSelector from "useAppSelector";
import { useStore } from "react-redux";
import { AppState } from "reducers";
import { BlogPostShort } from "types";

type SidebarPost = {
  id: string;
  title: string;
  date: string;
};

export default function Sidebar() {
  return (
    <>
      <h1>View History</h1>
      <SidebarContent />
    </>
  );
}

const selectViewedPostIds = (state: AppState) => state.viewHistory.postsViewed;
const selectAllPosts = (state: AppState) => state.blog.posts;

const selectedViewsPosts = createSelector(
  [selectViewedPostIds, selectAllPosts],
  (viewedPostIds, allPosts) => {
    console.log("selectedViewsPosts called!");
    return allPosts.filter((p) => viewedPostIds.includes(p.id));
  }
);

function SidebarContent() {
  const viewedPosts = useAppSelector(selectedViewsPosts);

  return (
    <>
      {viewedPosts.map((p) => (
        <article key={p.id}>
          <p className="Date">{formattedDate(p.date)}</p>
          <Link to={linkToPost(p)}>
            <h1>{p.title}</h1>
            <p>{p.likes} Likes</p>
          </Link>
        </article>
      ))}
    </>
  );
}

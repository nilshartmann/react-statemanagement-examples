import React from "react";
import { linkToPost, formattedDate } from "../../utils";
import { Link } from "react-router-dom";
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

function SidebarContent() {
  const viewedPostIds = useAppSelector((state) => state.viewHistory.postsViewed);
  const posts = useStore<AppState>().getState().blog.posts;

  const viewHistory = React.useMemo(() => {
    return viewedPostIds
      .map((postId) => posts.find((p) => p.id === postId))
      .filter((post) => post !== undefined) as BlogPostShort[];
  }, [viewedPostIds, posts]);

  return (
    <>
      {viewHistory.map((p) => (
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

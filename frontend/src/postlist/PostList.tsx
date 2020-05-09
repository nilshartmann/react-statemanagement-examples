import React, { Dispatch } from "react";
import { Link } from "react-router-dom";
import { linkToPost, formattedDate } from "../utils";
import useAppSelector from "useAppSelector";
import { useDispatch } from "react-redux";
import { SetBlogListSortAction, setBlogListSort } from "actions";

type PostListProps = {
  posts: Array<{
    id: string;
    date: string;
    title: string;
    teaser: string;
    userId: string;
    published: boolean;
    likes: number;
  }>;
};

type BadgeProps = {
  flavor: "User" | "Unpublished";
  children: React.ReactNode;
};

function Badge({ flavor, children }: BadgeProps) {
  return <div className={`Badge ${flavor}Badge`}>{children}</div>;
}

function UserBadge() {
  return <Badge flavor="User">Your Post!</Badge>;
}

function DraftBadge() {
  return <Badge flavor="Unpublished">Unpublished</Badge>;
}

type BadgesProps = { children: React.ReactNode };
function Badges({ children }: BadgesProps) {
  return <div className="Badges">{children}</div>;
}

type ListHeaderProps = {
  isLoggedIn: boolean;
};

type SelectableOptionProps = {
  children: React.ReactNode;
  active?: boolean;
  onSelect: () => void;
};
function SelectableOption({ children, active, onSelect }: SelectableOptionProps) {
  return (
    <span className={`SelectableOption${active ? " active" : ""}`} onClick={onSelect}>
      {children}
    </span>
  );
}

function PostListHeader({ isLoggedIn }: ListHeaderProps) {
  const dispatch = useDispatch<Dispatch<SetBlogListSortAction>>();

  const { orderBy, direction } = useAppSelector((state) => ({
    orderBy: state.blogListOptions.sortBy,
    direction: state.blogListOptions.order,
  }));

  function updateOrderBy(newOrderBy: "date" | "likes") {
    dispatch(setBlogListSort(newOrderBy, direction));
  }
  function updateDirection(newDirection: "asc" | "desc") {
    dispatch(setBlogListSort(orderBy, newDirection));
  }

  return (
    <div className="PostListHeader">
      <div>
        {isLoggedIn && (
          <Link className="Button" to="/add">
            Add Post
          </Link>
        )}
      </div>
      <div className="PostListOptions">
        Order by{" "}
        <SelectableOption active={orderBy === "date"} onSelect={() => updateOrderBy("date")}>
          Date
        </SelectableOption>{" "}
        |{" "}
        <SelectableOption active={orderBy === "likes"} onSelect={() => updateOrderBy("likes")}>
          Likes
        </SelectableOption>{" "}
        (
        <SelectableOption active={direction === "asc"} onSelect={() => updateDirection("asc")}>
          asc
        </SelectableOption>{" "}
        /{" "}
        <SelectableOption active={direction === "desc"} onSelect={() => updateDirection("desc")}>
          desc
        </SelectableOption>
        )
      </div>
    </div>
  );
}

export default function PostList({ posts }: PostListProps) {
  const currentUserId = useAppSelector((state) => state.auth?.userId);

  return (
    <>
      <PostListHeader isLoggedIn={!!currentUserId} />
      {posts.map((p) => (
        <Link key={p.id} to={linkToPost(p)}>
          <article className="Container">
            <p className="Date">{formattedDate(p.date)}</p>
            <header>
              <h1>{p.title}</h1>
              <Badges>
                {currentUserId === p.userId && <UserBadge />}
                {p.published || <DraftBadge />}
              </Badges>
            </header>
            {p.teaser} <span>Read more</span> ({p.likes} Likes)
          </article>
        </Link>
      ))}
    </>
  );
}

import { BlogPost, BlogPostShort } from "types";
import { SetPostsAction, SetFullPostAction } from "./blogActions";

type BlogState = {
  posts: Array<BlogPostShort | BlogPost>;
  options: { orderBy: string; direction: string; token?: string };
};

const defaultBlogState: BlogState = {
  posts: [],
  options: { orderBy: "", direction: "" },
};

export default function blogReducer(
  state = defaultBlogState,
  action: SetPostsAction | SetFullPostAction
): BlogState {
  switch (action.type) {
    case "SET_POSTS":
      return {
        posts: action.posts,
        options: action.options,
      };
    case "SET_FULL_POST":
      if (!state.posts.find((p) => p.id === action.post.id)) {
        return {
          ...state,
          posts: [...state.posts, action.post],
        };
      }
      return {
        ...state,
        posts: state.posts.map((oldPost) =>
          oldPost.id !== action.post.id ? oldPost : action.post
        ),
      };
    default:
      return state;
  }
}

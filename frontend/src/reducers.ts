import { combineReducers } from "redux";
import { LoginAction, LogoutAction, SetFilterByLikesAction, SetBlogListSortAction } from "actions";

import apiReducer from "./api/apiReducer";
import blogReducer from "blog/blogReducer";
import { viewHistoryReducer } from "blog/viewHistoryReducer";

type AuthState = {
  token: string;
  userId: string;
  username: string;
};

function authReducer(state: AuthState | null = null, action: LoginAction | LogoutAction) {
  switch (action.type) {
    case "LOGIN":
      return { ...action.payload };
    case "LOGOUT":
      return null;
    default:
      return state;
  }
}

type BlogListOptions = {
  sortBy: "date" | "likes";
  order: "desc" | "asc";
  likes: number;
};

const defaultSortOptions: BlogListOptions = {
  sortBy: "date",
  order: "desc",
  likes: -1,
};

function blogListOptionsReducer(
  state: BlogListOptions = defaultSortOptions,
  action: SetFilterByLikesAction | SetBlogListSortAction
) {
  switch (action.type) {
    case "SET_BLOGLIST_FILTER_BY_LIKES": {
      return { ...state, likes: action.likes };
    }
    case "SET_BLOGLIST_SORT": {
      return {
        ...state,
        sortBy: action.sortBy,
        order: action.direction,
      };
    }
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  auth: authReducer,
  blogListOptions: blogListOptionsReducer,
  blog: blogReducer,
  // votes: votesReducer,
  api: apiReducer,
  viewHistory: viewHistoryReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;

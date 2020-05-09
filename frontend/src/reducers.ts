import { combineReducers } from "redux";
import {
  LoginAction,
  LogoutAction,
  SetDraftBodyAction,
  SetDraftTitleAction,
  ClearDraftAction,
  SetFilterByLikeSAction as SetFilterByLikesAction,
  SetBlogListSortAction,
} from "actions";

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

type DraftPost = {
  title: string;
  body: string;
};

const initalDraftPost = {
  title: "",
  body: "",
};

function draftPostReducer(
  state: DraftPost = initalDraftPost,
  action: SetDraftBodyAction | SetDraftTitleAction | ClearDraftAction
) {
  switch (action.type) {
    case "CLEAR_DRAFT":
      return initalDraftPost;
    case "SET_DRAFT_BODY":
      return { ...state, body: action.body };
    case "SET_DRAFT_TITLE":
      return { ...state, title: action.title };
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
  draftPost: draftPostReducer,
  blogListOptions: blogListOptionsReducer,
  // votes: votesReducer,
  // api: apiReducer
});

export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;

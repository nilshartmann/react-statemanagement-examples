import { PostShownAction } from "./viewHistoryActions";

export type ViewHistoryState = {
  postsViewed: string[];
};

const defaultViewHistoryState: ViewHistoryState = {
  postsViewed: [],
};

export function viewHistoryReducer(state = defaultViewHistoryState, action: PostShownAction) {
  switch (action.type) {
    case "POST_SHOWN":
      if (state.postsViewed.length > 0 && state.postsViewed[0] === action.postId) {
        return state;
      }
      return {
        postsViewed: [action.postId].concat(
          state.postsViewed.filter((pId) => pId !== action.postId)
        ),
      };
    default:
      return state;
  }
}

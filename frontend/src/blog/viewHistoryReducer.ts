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
      return {
        postsViewed: [action.postId].concat(
          state.postsViewed.filter((pId) => pId !== action.postId)
        ),
      };
    default:
      return state;
  }
}

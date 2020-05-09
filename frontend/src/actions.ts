export function login(token: string, userId: string, username: string) {
  return {
    type: "LOGIN",
    payload: {
      token,
      userId,
      username,
    },
  } as const;
}
export type LoginAction = ReturnType<typeof login>;

export function logout() {
  return {
    type: "LOGOUT",
  } as const;
}
export type LogoutAction = ReturnType<typeof logout>;

// ====================================================================
//  BlogListOptions
// ====================================================================
export function setBlogListSort(sortBy: "date" | "likes", direction: "asc" | "desc") {
  return {
    type: "SET_BLOGLIST_SORT",
    sortBy,
    direction,
  } as const;
}
export type SetBlogListSortAction = ReturnType<typeof setBlogListSort>;

export function setFilterByLikes(likes: number) {
  return {
    type: "SET_BLOGLIST_FILTER_BY_LIKES",
    likes,
  } as const;
}

export type SetFilterByLikeSAction = ReturnType<typeof setFilterByLikes>;

// ====================================================================
//  DRAFT POST
// ====================================================================
export function setDraftTitle(title: string) {
  return {
    type: "SET_DRAFT_TITLE",
    title,
  } as const;
}
export type SetDraftTitleAction = ReturnType<typeof setDraftTitle>;

export function setDraftBody(body: string) {
  return {
    type: "SET_DRAFT_BODY",
    body,
  } as const;
}
export type SetDraftBodyAction = ReturnType<typeof setDraftBody>;

export function clearDraft() {
  return {
    type: "CLEAR_DRAFT",
  } as const;
}

export type ClearDraftAction = ReturnType<typeof clearDraft>;

export function navigateTo(location: string) {
  return {
    type: "HISTORY_PUSH",
    location,
  } as const;
}

export type NavigateAction = ReturnType<typeof navigateTo>;

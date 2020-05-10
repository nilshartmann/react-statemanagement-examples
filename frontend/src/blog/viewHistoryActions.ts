export function postShown(postId: string) {
  return {
    type: "POST_SHOWN",
    postId,
  } as const;
}

export type PostShownAction = ReturnType<typeof postShown>;

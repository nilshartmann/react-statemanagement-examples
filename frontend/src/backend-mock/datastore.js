import { getTestData } from "./dummy-data";

/** User
 *  @typedef {Object} User
 *  @property {string} id - The unique id
 *  @property {string} login - The login
 *  @property {string} name - The fullname of this User
 */

/** BlogPost
 *  @typedef {Object} BlogPost
 *  @property {string} id - The unique id
 *  @property {string} title - The title
 *  @property {string} date - Publication date
 *  @property {string} body - Body
 *  @property {string} userId - Reference to user
 *  @property {number} likes - Likes!
 */

const { users, posts } = getTestData();

// /** @type {User[]} */
// const users = readUsers();
// /** @type {Map<string,BlogPost>} */
// const posts = readPosts();

export const orderByDateNewestFirst = (p1, p2) => new Date(p2.date) - new Date(p1.date);
export const orderByDateOldestFirst = (p1, p2) => new Date(p1.date) - new Date(p2.date);

export function getAllPosts(orderByFn = orderByDateNewestFirst, userId) {
  const allPosts = [...posts.values()].filter((post) => {
    return post.published || post.userId === userId;
  });

  allPosts.sort(orderByFn);

  return allPosts;
}

export function getPost(postId) {
  return posts.get(postId);
}

export function getAllUsers() {
  return users;
}

export function getUser(userId) {
  return users.find((u) => u.id === userId);
}

export function getUserByLogin(login) {
  return users.find((u) => u.login === login);
}

export function likePost(postId, userId) {
  const post = posts.get(postId);

  if (!post) {
    throw new Error(`Cannot find BlogPost '${postId}'`);
  }

  let newLikedBy = post.likedBy.filter((l) => l !== userId);
  let newLikes = post.likes;
  if (userId) {
    if (newLikedBy.length === post.likedBy.length) {
      newLikedBy.push(userId);
      newLikes++;
    } else {
      newLikes--;
    }
  } else {
    // anonymous like
    newLikes++;
  }

  const updatedPost = {
    ...post,
    likes: newLikes,
    likedBy: newLikedBy,
  };

  posts.set(postId, updatedPost);

  return updatedPost;
}

export function updatePost(postData) {
  const post = posts.get(postData.id);

  if (!post) {
    return null;
  }

  const updatedPost = {
    ...post,
    title: postData.title,
    body: postData.body,
  };

  posts.set(post.id, updatedPost);

  return updatedPost;
}

export function deletePost(postId) {
  return posts.delete(postId);
}

export function insertPost(userId, { title, body }) {
  const newPost = {
    userId,
    title,
    body,
    likes: 0,
    likedBy: [],
    date: new Date().toISOString(),
    id: `P${posts.size + 1}`,
  };

  posts.set(newPost.id, newPost);

  return newPost;
}

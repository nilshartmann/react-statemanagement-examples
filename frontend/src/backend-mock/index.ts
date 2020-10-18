import { setupWorker, rest, MockedRequest } from "msw";
import jwt from "jsonwebtoken";
import * as datastore from "./datastore";

/** IN REAL LIVE YOU WILL NEVER STORE JWT_SECRET IN YOUR CODE! */
const JWT_SECRET = "hurzelpurzel";

function tokenFor(userId: string) {
  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "10 years",
  });

  return token;
}

const timeout = () => (Math.floor(Math.random() * 4) + 2) * 225;

function getUserId(req: MockedRequest) {
  const token = req.headers.get("authorization");
  if (token) {
    const payload: any = jwt.verify(token, JWT_SECRET);
    const user = datastore.getUser(payload.userId);
    if (!user) {
      return { error: `User with id '${payload.userId}' not found` };
    }

    return { userId: user.id };
  }

  return null;
}

const handlers = [
  rest.post("/api/login", (req, res, ctx) => {
    const login: any = req.body;

    if (!login) {
      return res(ctx.status(400), ctx.json({ error: "login (payload) must be defined" }));
    }

    if (!login.login) {
      return res(ctx.status(400), ctx.json({ error: "login.login must be defined" }));
    }

    if (!login.password) {
      return res(ctx.status(400), ctx.json({ error: "login.password must be defined" }));
    }

    const user = datastore.getUserByLogin(login.login);

    if (!user) {
      return res(ctx.status(403), ctx.json({ error: "Invalid user" }));
    }

    return res(
      ctx.status(200),
      ctx.json({
        token: tokenFor(user.id),
        user,
      })
    );
  }),
  rest.get("/api/posts", (req, res, ctx) => {
    const user = getUserId(req);
    if (user?.error) {
      return res(ctx.status(401), ctx.json(user));
    }
    let result = datastore.getAllPosts(undefined, user?.userId).map((p) => ({
      ...p,
      body: undefined,
    }));

    const orderBy = req.url.searchParams.get("orderBy");
    const direction = req.url.searchParams.get("direction");

    if (orderBy === "newestFirst") {
      result.sort(datastore.orderByDateNewestFirst);
    } else if (orderBy === "oldestFirst") {
      result.sort(datastore.orderByDateOldestFirst);
    } else if (orderBy === "date") {
      if (direction === "desc") {
        result.sort(datastore.orderByDateNewestFirst);
      } else {
        result.sort(datastore.orderByDateOldestFirst);
      }
    } else if (orderBy === "likes") {
      if (direction === "desc") {
        result.sort((p1, p2) => p1.likes - p2.likes);
      } else {
        result.sort((p1, p2) => p2.likes - p1.likes);
      }
    } else if (orderBy === "author") {
      result.sort((p1, p2) => {
        if (!p1.author || !p2.author) {
          // fallback if author is not requested/found
          return datastore.orderByDateNewestFirst(p1, p2);
        }

        const r = p1.author.localeCompare(p2.author);
        if (r === 0) {
          return datastore.orderByDateNewestFirst(p1, p2);
        }

        return r;
      });
    }

    return res(ctx.delay(timeout()), ctx.json(result));
  }),
  rest.get("/api/posts/:id", (req, res, ctx) => {
    const post = datastore.getPost(req.params.id);

    if (!post) {
      return res(ctx.status(404), ctx.json({ error: `Post '${req.params.id}' not found` }));
    }

    const user = datastore.getUser(post.userId);
    if (!user) {
      return res(ctx.status(404), ctx.json({ error: `Iser '${post.userId}' not found` }));
    }

    return res(ctx.delay(timeout()), ctx.json({ ...post, user }));
  }),

  rest.post("/api/posts", (req, res, ctx) => {
    const user = getUserId(req);

    if (!user) {
      return res(
        ctx.status(401),
        ctx.json({ error: "You must be logged in to execute this action" })
      );
    }

    if (user?.error) {
      return res(ctx.status(401), ctx.json(user));
    }

    const post: any = req.body;
    if (!post) {
      return res(ctx.status(400), ctx.json({ error: "Post must be defined" }));
    }

    if (!post.title) {
      return res(ctx.status(400), ctx.json({ error: "post.title must be defined and not empty" }));
    }

    if (!post.body) {
      return res(ctx.status(400), ctx.json({ error: "post.body must be defined and not empty" }));
    }

    const newPost = datastore.insertPost(user.userId, post);

    return res(ctx.status(201), ctx.json(newPost));
  }),

  rest.post("/api/posts/:id/like", (req, res, ctx) => {
    const post = datastore.getPost(req.params.id);

    if (!post) {
      return res(ctx.status(404), ctx.json({ error: `Post '${req.params.id}' not found` }));
    }

    if (post.id === "P9") {
      // simluation: error in processing
      return res(
        ctx.status(200),
        ctx.json({
          postId: post.id,
          likedBy: post.likedBy,
          likes: post.likes,
        })
      );
    }

    const user = getUserId(req);
    if (user?.error) {
      return res(ctx.status(401), ctx.json(user));
    }

    const likedPost = datastore.likePost(post.id, user?.userId);
    return res(
      ctx.status(200),
      ctx.json({
        postId: likedPost.id,
        likedBy: likedPost.likedBy,
        likes: likedPost.likes,
      })
    );
  }),
];

const worker = setupWorker(...handlers);
worker.start();

// const worker = setupWorker([
//   rest.get("/api/posts", (req, res, ctx) => {
//     let result = datastore.getAllPosts(undefined, userId(req)).map((p) => ({
//       ...p,
//       body: undefined,
//     }));
//     ctx.delay();
//     // if (req.query.short !== undefined) {
//     //   result = result.map((p) => ({
//     //     id: p.id,
//     //     date: p.date,
//     //     title: p.title,
//     //     published: p.published,
//     //   }));
//     // } else if (req.query.full !== undefined) {
//     //   result = result.map((p) => ({
//     //     ...p,
//     //     author: datastore.getUser(p.userId).name,
//     //   }));
//     // }

//     const orderBy = req.url.searchParams.get("orderBy");
//     const direction = req.url.searchParams.get("direction");

//     if (orderBy === "newestFirst") {
//       result.sort(datastore.orderByDateNewestFirst);
//     } else if (orderBy === "oldestFirst") {
//       result.sort(datastore.orderByDateOldestFirst);
//     } else if (orderBy === "date") {
//       if (direction === "desc") {
//         result.sort(datastore.orderByDateNewestFirst);
//       } else {
//         result.sort(datastore.orderByDateOldestFirst);
//       }
//     } else if (orderBy === "likes") {
//       if (direction === "desc") {
//         result.sort((p1, p2) => p1.likes - p2.likes);
//       } else {
//         result.sort((p1, p2) => p2.likes - p1.likes);
//       }
//     } else if (orderBy === "author") {
//       result.sort((p1, p2) => {
//         if (!p1.author || !p2.author) {
//           // fallback if author is not requested/found
//           return datastore.orderByDateNewestFirst(p1, p2);
//         }

//         const r = p1.author.localeCompare(p2.author);
//         if (r === 0) {
//           return datastore.orderByDateNewestFirst(p1, p2);
//         }

//         return r;
//       });
//     }

//     console.log("result >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", result);
//     return res(ctx.json(result));
//   })
// ]);

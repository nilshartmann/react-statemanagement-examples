import React from "react";
import { Switch, Route } from "react-router-dom";
import NotFoundPage from "./NotFound";
import AppHeader from "./AppHeader";

import PostEditorPage from "./editor/PostEditorPage";
import PostListPage from "./postlist/PostListPage";
import PostPage from "./post/PostPage";
import LoginPage from "./login/LoginPage";
import BlogPage from "BlogPage";

function App() {
  return (
    <div className="App">
      <AppHeader />
      <Switch>
        <Route exact path="/">
          <BlogPage>
            <PostListPage />
          </BlogPage>
        </Route>
        <Route path="/post/:postId">
          <BlogPage>
            <PostPage />
          </BlogPage>
        </Route>

        <Route path="/add">
          <PostEditorPage />
        </Route>

        <Route path="/login">
          <LoginPage />
        </Route>

        <Route>
          <NotFoundPage />
        </Route>
      </Switch>
    </div>
  );
}

export default App;

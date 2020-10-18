import React from "react";
import { Switch, Route } from "react-router-dom";
import NotFoundPage from "./NotFound";
import AppHeader from "./AppHeader";

import PostEditorPage from "./blog/editor/PostEditorPage";
import PostListPage from "./blog/postlist/PostListPage";
import PostPage from "./blog/post/PostPage";
import LoginPage from "./auth/LoginPage";
import BlogPage from "blog/BlogPage";
import useAppSelector from "useAppSelector";
import LoadingIndicator from "LoadingIndicator";

function App() {
  const loading = useAppSelector((state) => state.api.loading);
  const description = useAppSelector((state) => state.api.description);
  const error = useAppSelector((state) => state.api.error);

  const dataAvailable = !loading && !error;

  return (
    <div className="App">
      <AppHeader />
      {loading && <LoadingIndicator>{description}</LoadingIndicator>}
      {error && <Error msg={error} />}
      {dataAvailable && (
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
      )}
      <footer>
        <div>
          <span>React Example App, Source Code:{"  "}</span>
          <a href="https://github.com/nilshartmann/react-statemanagement-examples">
            https://github.com/nilshartmann/react-statemanagement-examples
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;

type ErrorProps = {
  msg: string;
};
function Error({ msg }: ErrorProps) {
  return (
    <div>
      <h1>API Request Failed!</h1>
      <p>{msg.toString()}</p>
    </div>
  );
}

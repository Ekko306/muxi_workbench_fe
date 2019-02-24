/* eslint-disable import/no-unresolved */
import React from "react";
// import ReactDOM from "react-dom";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import { Provider } from "react-redux";
import CardContainer from "components/layouts/card";
import { PersistGate } from "redux-persist/es/integration/react";
import NoMatch from "./components/common/noMatch/index";
import Project from "./modules/project/index";
import Dynamic from "./modules/feed/dynamic";
import Progress from "./modules/status/index";
import Member from "./modules/member/index";
import Message from "./modules/message/index";
import Search from "./modules/search/index";
import Header from "./components/common/header/index";
import edit from "./modules/status/markdown/edit";
import load from "./modules/landing";
import { persistor, Store } from "./store";
import "./index.css";

// ReactDOM.render(
const router = () => (
  <Provider store={Store}>
    <PersistGate persistor={persistor}>
      <Router>
        <div className="app-container">
          <Header />

          <Switch>
            <Redirect exact from="/" to="/project" />
            <Route
              path="/project"
              render={props => (
                <CardContainer>
                  <Project {...props} />
                </CardContainer>
              )}
            />
            <Route
              path="/feed"
              render={props => (
                <CardContainer>
                  <Dynamic {...props} />
                </CardContainer>
              )}
            />
            <Route path="/status" component={Progress} />
            <Route path="/edit" component={edit} />
            <Route
              path="/teamMember"
              render={props => (
                <CardContainer>
                  <Member {...props} />
                </CardContainer>
              )}
            />
            <Route path="/message" component={Message} />
            <Route path="/search" component={Search} />
            <Route path="/landing" component={load} />
            <Route component={NoMatch} />
          </Switch>
        </div>
      </Router>
    </PersistGate>
  </Provider>
  // document.getElementById("root")
);
// registerServiceWorker();
if (process.env.NODE_ENV === "production") {
  console.log(
    `Muxi Workbench FE version ${process.env.REACT_APP_VERSION} 😎🤣😂😅😇😘`
  );
}
export default router;

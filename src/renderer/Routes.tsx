import React, { ReactElement } from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import ContactList from "./components/ContactList";
import Welcome from "./components/Welcome";

export default function AppRoutes(): ReactElement {
  return (
    <Router>
      <Route exact path="/" component={Welcome} />
      <Route path="/app" component={ContactList} />
    </Router>
  );
}

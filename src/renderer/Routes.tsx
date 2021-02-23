import React from "react";
import { HashRouter as Router, Switch, Route, Link } from "react-router-dom";
import ContactList from "./components/ContactList";
import Welcome from "./components/Welcome";

export default function AppRoutes() {
  return (
    <Router>
      <Route exact path="/" component={Welcome} />
      <Route path="/app" component={ContactList} />
    </Router>
  );
}

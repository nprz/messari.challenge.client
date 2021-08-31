import React from "react";
import { Home } from "./components/Home";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/:symbol?/:name?" children={<Home />} />
      </Switch>
    </Router>
  );
}

export default App;

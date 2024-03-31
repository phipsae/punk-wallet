// Import necessary parts from react-router-dom
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import React from "react";
import InfoPage from "./pages/SwapPage"; // Your new page component
import WalletPage from "./pages/WalletPage";

function App({ subgraphUri }) {
  return (
    <Router>
      <Switch>
        <Route exact path="/" render={() => <WalletPage subgraphUri={subgraphUri} />} />
        <Route path="/swap" component={InfoPage} />
        {/* Define other routes as needed */}
      </Switch>
    </Router>
  );
}

export default App;

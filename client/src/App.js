import React, { Fragment, useEffect, useState } from 'react';
import Registration from "./components/Registration/Registration";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import Nav from "./components/Navigation/Nav"
import Footer from "./components/Footer/Footer"
import Header from "./components/Header/Header"
import Edit from "./components/EditAd/Edit"
import ViewAd from "./components/ViewAd/ViewAd"
import CreateAd from "./components/CreateAd/CreateAd"
import Cart from "./components/Cart/Cart"
import ConfirmAccount from "./components/ConfirmAccount/ConfirmAccount";
import { LoggedContext } from "./LoggedContext";
import "./App.css";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Profile from './components/Profile/Profile';

function App() {

  const [sessionInfo, setSessionInfo] = useState({});

  const getSessionInfo = async () => {
    try {
      const response = await fetch("/api/users/checkSession");
      const sessionJson = await response.json();
      setSessionInfo(sessionJson);
    }
    catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getSessionInfo();
  }, []);


  return (
    <Fragment>
      <script src="https://use.fontawesome.com/7b8ad24c3f.js"></script>
      <div className="main-wrap">
        <div className="App-header"><Header /></div>
        <LoggedContext.Provider value={sessionInfo}>
          <Nav />
          <Router>
            <Switch>
              <Route exact path="/" component={Home}></Route>
              <Route path="/registration" component={Registration}></Route>
              <Route path="/login" component={Login}></Route>
              <Route path="/edit/:id" component={Edit}></Route>
              <Route path="/view/:id" component={ViewAd}></Route>
              <Route path="/createAd" component={CreateAd}></Route>
              <Route path="/cart" component={Cart}></Route>
              <Route exact path="/profile" component={Profile}></Route>
              <Route path="/profile/order/:oid" component={Profile}></Route>
              <Route path="/confirm/:token" component={ConfirmAccount}></Route>
            </Switch>
          </Router>
        </LoggedContext.Provider>
      </div>
      <div className="App-footer"><Footer /></div>
    </Fragment>

  );
}

export default App;

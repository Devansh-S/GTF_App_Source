import React from "react";
import "./App.scss";
import Map from "./components/map/Map";
import LoginApp from './components/LoginApp/LoginApp';
import fireB from "./config/FireBase";
/*import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";*/



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogginActive: true,
      isUserLoggedIn: {},
    };
  }


componentDidMount() {
  this.authListener()
}
  
authListener() {
  fireB.auth().onAuthStateChanged((user) => {
    console.log(user);
    if (user) {
      this.setState({isUserLoggedIn: user})
    } else {
      this.setState({isUserLoggedIn: null})
    }
  })
}

  render() {
    return (
        <div>
          {this.state.isUserLoggedIn ? (<Map />) : (<LoginApp />) }
        </div>
    ) 
  }
}


export default App;
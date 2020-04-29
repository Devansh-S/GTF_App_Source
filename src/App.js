import React from "react";
import "./App.scss";
import Map from "./components/map/Map";
import LoginApp from './components/LoginApp/LoginApp';
import fireB from "./config/FireBase";
import { BrowserRouter as Switch, Route } from "react-router-dom";
import { ProtectedRoute } from "./Protected";
import ReactLoading from "react-loading";
import "bootstrap/dist/css/bootstrap.css";


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogginActive: true,
      isUserLoggedIn: {},
      flag: false,
      loading: true
    };
  }


componentDidMount() {
  this.authListener()
}
  
authListener() {
  fireB.auth().onAuthStateChanged((user) => {
    console.log(user);
    if (user) {
      this.setState({isUserLoggedIn: user});
      this.setState({flag: true})
      this.setState({loading: false})
    } else {
      this.setState({isUserLoggedIn: null})
      this.setState({loading: false})
    }
    return user;
  })
}

  render() {
    return (
        <div>
          {!this.state.loading ? (
          <Switch>
            <Route exact path='/' component={LoginApp} />
            <ProtectedRoute exact path='/app' component={Map} loggedIn={this.state.flag} />
          </Switch> ) :
          (<div className='loader'>
            <ReactLoading type={"bars"} color={"black"} height={100} width={100}/>
          </div>
          )}
        </div>
    ) 
  }
}


export default App;
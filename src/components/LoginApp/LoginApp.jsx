import React from "react";
import "./LoginApp.scss";
import "../login/style.scss";
import Login from '../login/login';
import Register from "../login/register";
import loginImg from "../../login.png";
import UserStore from '../../stores/UserStore'
import fireB from '../../config/FireBase';


class LoginApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      buttonDisabled: false
    }
  }
  
  setInputValue(property, val){
      val = val.trim()
      this.setState({
        [property]: val
      })
  }

  resetForm() {
    this.setState({
      username: '',
      password: '',
      buttonDisabled: false
    })
  }

  async doLogin(e) {
    if (!this.state.username){
      return;
    }
    if (!this.state.password){
      return;
    }

    this.setState ({buttonDisabled: true})

    try {
      fireB.auth().signInWithEmailAndPassword( this.state.username, this.state.password ).then((u) => {}).catch((error) => {console.log(error)})
    }

    catch(e) {
      console.log(e);
      this.resetForm();
    }
  }

  async doSignup(e) {
    if (!this.state.username){
      return;
    }
    if (!this.state.password){
      return;
    }

    this.setState ({buttonDisabled: true})

    try {
      alert('SignUp is Disabled! Please Login using given credentials')
      //fireB.auth().createUserWithEmailAndPassword( this.state.username, this.state.password ).then((u) => {}).then((u) => {console.log(u)}).catch((error) => {console.log(error)})
    }

    catch(e) {
      console.log(e);
      this.resetForm();
    }
  }


  componentDidMount() {
    this.rightSide.classList.add("right");
  }

  changeState() {
    const { isLogginActive } = this.state;

    if (isLogginActive) {
      this.rightSide.classList.remove("right");
      this.rightSide.classList.add("left");
    } else {
      this.rightSide.classList.remove("left");
      this.rightSide.classList.add("right");
    }
    this.setState(prevState => ({ isLogginActive: !prevState.isLogginActive }));
  }


  render() {
    const { isLogginActive } = this.state;
    const current = isLogginActive ? "Register" : "Login";
    const currentActive = isLogginActive ? "login" : "register";
    return (
      <div className="LoginApp">
        <div className="login">
          <div className='mainContainer'>
            <img src={loginImg}/>
            <div className="container" ref={ref => (this.container = ref)}>
              <div className='inner-box'>
              </div>
                {isLogginActive && (
                  <Login 
                  containerRef={ref => (this.current = ref)}
                  usernameValue={ this.state.username ? this.state.username: ''}
                  onChangeUsername={ (val) => this.setInputValue('username', val)}
                  passwordValue={ this.state.password ? this.state.password: ''}
                  onChangePassword={ (val) => this.setInputValue('password', val)}
                  onClick={ (e)=> this.doLogin(e) }
                  BtnDisable={this.buttonDisabled}
                  />
                )}
                {!isLogginActive && (
                  <Register 
                  containerRef={ref => (this.current = ref)}
                  usernameValue={ this.state.username ? this.state.username: ''}
                  onChangeUsername={ (val) => this.setInputValue('username', val)}
                  passwordValue={ this.state.password ? this.state.password: ''}
                  onChangePassword={ (val) => this.setInputValue('password', val)}
                  onClick={ (e)=> this.doSignup(e) }
                  BtnDisable={this.buttonDisabled}
                  />
                )}
                <RightSide
                current={current}
                currentActive={currentActive}
                containerRef={ref => (this.rightSide = ref)}
                onClick={this.changeState.bind(this)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const RightSide = props => {
  return (
    <div
      className="right-side"
      ref={props.containerRef}
      onClick={props.onClick}
    >
      <div className="inner-container">
        <div className="text">{props.current}</div>
      </div>
    </div>
  );
};

export default LoginApp;
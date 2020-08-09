import React from "react";
import "./LoginApp.scss";
import "../login/style.scss";
import Login from '../login/login';
import Register from "../login/register";
import fireB from '../../config/FireBase';
import ReactLoading from "react-loading";
import img from '../../pp.png';


//        this.setState({loading: false})

class LoginApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogginActive: true,
      username: '',
      password: '',
      buttonDisabled: false,
      regFlag: false,
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
      this.createOverlay('Logging In\nPlease wait!')
      fireB.auth().signInWithEmailAndPassword( this.state.username, this.state.password ).then((u) => {}).catch((error) => {this.changeOverlayText(error, 3000)})
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
      this.createOverlay('Please wait!')
      const db = fireB.firestore();
      const data = await db.collection("ControlFlags").doc("enableRegistrationFlag").get();
      if (data.data().value){
        //alert('Registering new user please wait!')
        fireB.auth().createUserWithEmailAndPassword( this.state.username, this.state.password ).then(() => {this.reg('Registering User\n Please wait!')}).then((u) => {console.log(u)}).catch((error) => {this.changeOverlayText(error,3000)})
        console.log('ppp')
      }
      else{
        alert('SignUp is Disabled! Please Login using given credentials')
      }
    }

    catch(e){
      console.log(e);
      this.resetForm();
    }
  }

  createOverlay = (text, delay) => {
    var main_parent = document.getElementById('LoginApp')
    var element = document.createElement('div')
    element.className = 'dialogBox' 
    element.id = 'overlay'
    main_parent.appendChild(element)

    var ptext = document.createElement('p')
    ptext.innerHTML = text
    ptext.id = 'dialog_text'
    ptext.className = 'dialog_text'

    var element_inner = document.createElement('div')
    element_inner.className = 'dialogBox-inner'
    element_inner.id = 'dialogBox-inner'

    element_inner.appendChild(ptext)
    main_parent.appendChild(element_inner)

    if (delay > 0){
      const delayDebounceFn = setTimeout(() => {
        element_inner.parentNode.removeChild(element_inner)
        element.parentNode.removeChild(element)
      }, delay)
      this.resetForm()
      return () => clearTimeout(delayDebounceFn)
    }
  }

  changeOverlayText = (text, delay) => {
    var ele = document.getElementById('dialog_text')
    ele.innerHTML = text

    var element1 = document.getElementById('dialogBox-inner')
    var element2 = document.getElementById('overlay')
    
    if (delay > 0){
      const delayDebounceFn = setTimeout(() => {
        element1.parentNode.removeChild(element1)
        element2.parentNode.removeChild(element2)
      }, delay)
      this.resetForm()
      return () => clearTimeout(delayDebounceFn)
    }
  }


  componentDidMount() {
    this.rightSide.classList.add("right");
    fireB.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log('/apppp')
        this.props.history.push("/GTFapp/app");
      } else {
        console.log('////////')
        this.props.history.push("/GTFapp/");
      }
    })
    this.setState({loading: false})
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
      <div>
        {!this.state.loading ? (
        <div className="LoginApp" id='LoginApp'>
          <div className="login">
            <div className='mainContainer'>
              <img src={img} alt='background'/>
              <div className="container" ref={ref => (this.container = ref)}>
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
        </div>) : (<div className='loader'><ReactLoading type={"bars"} color={"black"} height={100} width={100}/></div>)}
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
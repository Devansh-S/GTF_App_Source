import React from "react";

export class Register extends React.Component {

  render() {
    return (
      <div className="base-container" ref={this.props.containerRef}>
        <div className="header">Register</div>
        <div className="content">
          <div className="form">
            <div className="form-group">
              <input type="text" name="email" placeholder="email" value={ this.props.usernameValue } onChange={ (e) => this.props.onChangeUsername(e.target.value)}/>
            </div>
            <div className="form-group">
              <input type="password" name="password" placeholder="password" value={ this.props.passwordValue } onChange={ (f) => this.props.onChangePassword(f.target.value)}/>
            </div>
          </div>
          <button type="button" className="Btn" onClick={ (e) => this.props.onClick(e)} disabled={this.props.BtnDisable} >
            Register
          </button>
        </div>
      </div>
    );
  }
};

export default Register;
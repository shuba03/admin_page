import React from "react";
import { Redirect } from "react-router-dom";

import APIProxy from "../proxy/api-proxy";

const LOGIN_STATUS = {
  FAILED: "failed",
  SUCCESS: "success",
  NOT_STARTED: "not_started"
}

export default class Login extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loginStatus: LOGIN_STATUS.NOT_STARTED,
      email: null,
      password: null
    }
  }

  tryLogin = async (event) => {
    event.preventDefault();
    try{
      await APIProxy.login(this.state.email, this.state.password);
      this.setState({loginStatus: LOGIN_STATUS.SUCCESS});
    }catch(err) {
      this.setState({loginStatus: LOGIN_STATUS.FAILED});
    }
  }

  onCloseAlert = () => {
    this.setState({ loginFailed: LOGIN_STATUS.NOT_STARTED })
  }

  updateEmail = (event) => {
    const email = event.target.value;
    this.setState({email});
  }

  updatePassword = (event) => {
    const password = event.target.value;

    this.setState({password});
  }

  render = () => {

    if(this.state.loginStatus === LOGIN_STATUS.SUCCESS) {
      return <Redirect to= "/queen-mobiles-admin" /> 
    }

    return (
    <React.Fragment>
      <div
          className="card shadow mx-auto"
          style={{ maxWidth: "380px", marginTop: "100px" }}
        >
          <div className="card-body">
            <h4 className="card-title mb-4 text-center">Sign in</h4>
            {this.state.loginStatus === LOGIN_STATUS.FAILED ? <div> Login Failed! </div>: ""}
            <form>
              <div className="mb-3">
                <input
                  className="form-control"
                  placeholder="Email"
                  type="email"
                  onBlur={this.updateEmail}
                />
              </div>
              <div className="mb-3">
                <input
                  className="form-control"
                  placeholder="Password"
                  type="password"
                  onBlur={this.updatePassword}
                />
              </div>
              <div className="mb-4">
                <button type="submit" className="btn btn-primary w-100" onClick={ this.tryLogin }>
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
        {/* <ReactJsAlert
          status={this.state.loginStatus === LOGIN_STATUS.FAILED}
          type={"error"}
          title={"Login Failed! Please check your email and password!"}
          Close={this.onCloseAlert}
        /> */}
    </React.Fragment>
    
    )
  }
}

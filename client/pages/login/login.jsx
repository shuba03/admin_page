import React from "react";
import { Redirect, Link } from "react-router-dom";
import $ from "jquery";

import { toast } from "react-toastify";
import APIProxy from "../../proxy/api-proxy";


export default class Login extends React.Component {

  constructor(props) {
    super(props);
  }

  tryLogin = async (event) => {
    event.preventDefault();

    const email = $("#loginEmailInput").val();
    const password = $("#loginPasswordInput").val();

    const { status } = await APIProxy.login(email, password);

    if (status === "success") {
      this.props.successHandler();
      return;
    }

    toast.error("Unable to login. Pls verify your creds...");
  }

  render = () => {

    if (this.props.loggedIn) {
      return <Redirect to="/queen-mobiles/" />
    }

    return (
      <React.Fragment>
        <div
          className="card shadow mx-auto"
          style={{ maxWidth: "380px", marginTop: "100px" }}
        >
          <div className="card-body">
            <h4 className="card-title mb-4 text-center">Sign in</h4>
            <form>
              <div className="mb-3">
                <input
                  id="loginEmailInput"
                  className="form-control"
                  placeholder="Email"
                  type="email"
                />
              </div>
              <div className="mb-3">
                <input
                  id="loginPasswordInput"
                  className="form-control"
                  placeholder="Password"
                  type="password"
                />
              </div>
              <div className="mb-4">
                <button type="submit" className="btn btn-primary w-100" onClick={this.tryLogin}>
                  Login
                </button>
              </div>
              <div className="mb-3">
                <div className="row">
                  <div className="col">
                    <Link to={`/queen-mobiles/signup`} >
                      Sign Up
                    </Link>
                  </div>
                  <div className="col" >
                    <div className="d-flex justify-content-end">
                      <div className="d-flex">
                        <Link to={`/queen-mobiles/forgot-password`} >
                          Forgot Password
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

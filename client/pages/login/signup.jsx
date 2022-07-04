import React from "react";
import $ from "jquery";
import { Link, Redirect } from "react-router-dom";

import { toast } from "react-toastify";

import APIProxy from "../../proxy/api-proxy";

const MAIL_REGEX = /^[a-z][a-z0-9_\.]*@[a-z][a-z0-9_\.]+\.[a-z]+$/

export default class SingupPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      status: "not_started"
    }
  }

  verifyOtp = async (event) => {
    event.preventDefault();
    const otp = $("#otpInput").val();
    const { status } = await APIProxy.verifyOTP({ email: this.state.email, otp, signup: true });

    if (status === "success") {
      toast.success(`Email OTP verified successfully! Please sign in into your new account!`);
      return;
    }

    toast.error(`OTP verification failed! Please retry again`);
  }

  validateInputs(email, firstName, lastName) {
    let validInputs = true;

    if (!email || !MAIL_REGEX.test(email)) {
      toast.error("Please provide valid mail id.");
      validInputs = false;
    }

    if (!firstName) {
      toast.error("Please provide first name.");
      validInputs = false;
    }

    if (!lastName) {
      toast.error("Please provide last name.");
      validInputs = false;
    }
  }

  addUser = async (event) => {
    event.preventDefault();

    const email = $("#eamilInput").val();
    const firstName = $("#firstNameInput").val();
    const lastName = $("#lastNameInput").val();
    const phone = $("#phoneInput").val();
    const password = $("#passwordInput").val();

    if (!this.validateInputs(email, firstName, lastName)) {
      this.setState({ status: "registration_failed" });
      return;
    }

    const { status, message } = await APIProxy.addUser({
      firstName, lastName, email, phone, password
    });

    if (status === "success") {
      toast.success(`An OTP email was sent to the registered mail id!`);
      this.setState({ status: "otp_sent" });
      return;
    }

    toast.error("Registration failed!. Please try again.");

    this.showError(`Registration failed! ${message}`);
    this.setState({ status: "registration_failed" });
  }

  shouldComponentUpdate() {
    return true;
  }

  getOTPForm = () => {
    return (
      <form>
        <div className="mb-3 p-2">
          <label htmlFor="eamilInputForOTP" className="form-label">E-mail:</label>
          <input id="eamilInputForOTP" type="text" class="form-control" defaultValue={this.state.email} disabled />
        </div>
        <div className="mb-3 p-2">
          <label htmlFor="otpInput" className="form-label">OTP:</label>
          <input id="otpInput" type="text" class="form-control" placeholder="OTP" required />
        </div>
        <div className="mb-4">
          <button type="submit" className="btn btn-primary w-100" onClick={this.verifyOtp}>
            Verify OTP
          </button>
        </div>
        <div className="mb-3">
          <div className="row">
            <div className="d-flex justify-content-center">
              <div className="d-flex">
                <Link to={`/queen-mobiles/login`} >
                  Already have an account? Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    )
  }

  getSignupForm = () => {

    return (
      <form>
        <div className="row mb-3 p-2">
          <div className="col">
            <label htmlFor="firstNameInput" className="form-label">First Name:</label>
            <input id="firstNameInput" type="text" class="form-control" placeholder="First Name" required />
          </div>
          <div className="col">
            <label htmlFor="lastNameInput" className="form-label">Last Name:</label>
            <input id="lastNameInput" type="text" class="form-control" placeholder="Last Name" required />
          </div>
        </div>
        <div className="mb-3 p-2">
          <label htmlFor="eamilInput" className="form-label">E-mail:</label>
          <input id="eamilInput" type="text" class="form-control" placeholder="email" required />
        </div>
        <div className="mb-3 p-2">
          <label htmlFor="phoneInput" className="form-label">Phone:</label>
          <input id="phoneInput" type="text" class="form-control" placeholder="Phone" />
        </div>
        <div className="mb-3 p-2">
          <label htmlFor="passwordInput" className="form-label">Password:</label>
          <input id="passwordInput" type="password" class="form-control" required />
        </div>
        <div className="mb-4">
          <button type="submit" className="btn btn-primary w-100" onClick={this.addUser}>
            Create Account
          </button>
        </div>
        <div className="mb-3">
          <div className="row">
            <div className="d-flex justify-content-center">
              <div className="d-flex">
                <Link to={`/queen-mobiles/login`} >
                  Already have an account? Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    )
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
            <h4 className="card-title mb-4 text-center">Sign up</h4>
            {(this.state.status === "otp_sent") ? this.getOTPForm() : this.getSignupForm()}
          </div>
        </div>
      </React.Fragment>

    )
  }
}

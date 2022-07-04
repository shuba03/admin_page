import React from "react";
import { Link, Redirect } from "react-router-dom";
import $ from "jquery";

import { toast } from "react-toastify";

import APIProxy from "../../proxy/api-proxy";


export default class ForgotPasswordPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            status: "not_started",
            email: null
        }
    }

    verifyOtp = async (event) => {
        event.preventDefault();
        const otp = $("#otpInput").val();
        const password = $("#newPasswordInput").val();
        const { status } = await APIProxy.verifyOTP({ email: this.state.email, otp, newPassword: password });

        if (status === "success") {
            toast.success(`Password updated successfully! Please login to your account with new password!`);
            this.setState({ status: "otp_verified" });
            return;
        }

        toast.error(`OTP verification failed! Please retry`);
    }

    resetPassword = async (event) => {
        event.preventDefault();
        const email = $("#forgotPasswordEmailInput").val();
        const { status } = await APIProxy.forgotPassword(email);

        if (status === "success") {
            toast.success(`An OTP email was sent to the registered mail id!`);
            this.setState({ status: "otp_sent", email });
            return;
        }

        toast.error(`Failed to sent OTP to your mail. Please try again.`);
        this.setState({ status: "otp_sent_failed" });
    }

    shouldComponentUpdate() {
        return true;
    }

    getResetPasswordForm = () => {
        return (
            <form>
                <div className="mb-3 p-2">
                    <label htmlFor="forgotPasswordEmailInput" className="form-label">Registered Email:</label>
                    <input id="forgotPasswordEmailInput" type="text" class="form-control" required />
                </div>
                <div className="mb-4">
                    <button type="submit" className="btn btn-primary w-100" onClick={this.resetPassword}>
                        Send OTP
                    </button>
                </div>
                <div className="mb-3">
                    <div className="row">
                        <div className="col">
                            <Link to={`/queen-mobiles/login`} >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
        )
    }

    getOTPForm = () => {
        return (
            <form>
                <div className="mb-3 p-2">
                    <label htmlFor="eamilInputForOTP" className="form-label">E-mail:</label>
                    <input id="eamilInputForOTP" type="text" class="form-control" defaultValue={this.state.email} disabled />
                </div>
                <div className="mb-3 p-2">
                    <label htmlFor="newPasswordInput" className="form-label">OTP:</label>
                    <input id="newPasswordInput" type="password" class="form-control" placeholder="Password" required />
                </div>
                <div className="mb-3 p-2">
                    <label htmlFor="eamilInputForOTP" className="form-label">E-mail:</label>
                    <input id="eamilInputForOTP" type="text" class="form-control" defaultValue={this.state.email} disabled />
                </div>
                <div className="mb-4">
                    <button type="submit" className="btn btn-primary w-100" onClick={this.verifyOtp}>
                        Reset Password
                    </button>
                </div>
                <div className="mb-3">
                    <div className="row">
                        <div className="d-flex justify-content-center">
                            <div className="d-flex">
                                <Link to={`/queen-mobiles/login`} >
                                    Sign In
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
                        <h4 className="card-title mb-4 text-center">Forgot Password</h4>
                        {(this.state.status === "otp_sent" || this.state.status === "otp_verification_failed") ? this.getOTPForm() : this.getResetPasswordForm()}
                    </div>
                </div>
            </React.Fragment>

        )
    }
}

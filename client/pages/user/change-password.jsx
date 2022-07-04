import React from "react";
import $ from "jquery";

import Sidebar from "../../components/sidebar/sidebar";
import Header from "../../components/Header/header";
import APIProxy from "../../proxy/api-proxy";
import { toast } from "react-toastify";


export default class ChangePassword extends React.Component {

    constructor(props) {
        super(props);
    }

    updatePassword = async () => {
        const oldPassword = $("#currentPasswordInput").val();
        const newPassword = $("#newPasswordInput").val();

        if (!oldPassword || oldPassword.trim() === "") {
            toast.error("Please give the current password!");
            return;
        }

        if (!newPassword || newPassword.trim() === "") {
            toast.error("Please give the new password!");
            return;
        }


        try {
            await APIProxy.updatePassword(oldPassword, newPassword);
            toast.success("Password updated successfully!");
            $("#currentPasswordInput").val("");
            $("#newPasswordInput").val("");
        } catch (err) {
            console.error(err);
            toast.error("Unable to update the password! Pls try after sometime.");
        }
    }

    render() {
        if (!this.props.loggedIn) {
            return (
                <section className="content-main">
                    <div className="d-flex justify-content-center justify-content-middle">
                        <div className="d-flex">
                            <span className="text-muted fw-bold">Please login!</span>
                        </div>
                    </div>
                </section>
            );
        }

        return (

            <>
                <Sidebar  {...this.props} />
                <main className="main-wrap">
                    <Header  {...this.props} />
                    <section className="content-main">
                        <div className="card mb-4 shadow-sm">
                            <header className="card-header bg-white">
                                <h2 className="content-title">Change Password</h2>
                            </header>
                            <div className="card-body">
                                <div className="d-flex justify-content-center">
                                    <div className="row">
                                        <div className="mb-3 p-2">
                                            <label htmlFor="currentPasswordInput" className="form-label">Current Password:</label>
                                            <input id="currentPasswordInput" type="password" class="form-control" defaultValue={""} placeholder="Old Password..." />
                                        </div>
                                        <div className="mb-3 p-2">
                                            <label htmlFor="newPasswordInput" className="form-label">New Password:</label>
                                            <input id="newPasswordInput" type="password" class="form-control" defaultValue={""} placeholder="New Password..." />
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-3 p-2">
                                    <div className="d-flex justify-content-center">
                                        <div className="d-flex">
                                            <button className="btn btn-primary" type="button" onClick={this.updatePassword}>Change Password</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </>
        )
    }
}

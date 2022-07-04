import React from "react";
import $ from "jquery";

import { toast } from "react-toastify";

import APIProxy from "../../proxy/api-proxy";

import Utils from "../../utils/utils";

export default class ProfileSection extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fetchFailed: false,
            isLoading: true,
            info: {}
        }
    }

    componentDidMount = async () => {
        await this.updateUserDetails();
    }

    updateUserDetails = async () => {
        const { fetchFailed, info } = await this.getUserInfo();
        this.setState({ fetchFailed, info, isLoading: false });
    }

    getUserInfo = async () => {
        try {
            const info = await APIProxy.getUserInfo();
            return { fetchFailed: false, info };
        } catch (err) {
            console.error("Failed to fetch user details!", err);
            return { fetchFailed: true, info: {} };
        }
    }

    updateUserInfo = async (event) => {
        event.preventDefault();
        const firstName = $("#firstNameInput").val();
        const lastName = $("#lastNameInput").val();
        const phone = $("#phoneInput").val();
        const address = $("#addressInput").val();
        const pincode = $("#pincodeInput").val();

        if (!this.validateInputs({ firstName, lastName, phone, address, pincode })) {
            return;
        }

        try {
            await APIProxy.updateUserInfo({ firstName, lastName, phone, address, pincode });
            toast.success("User details updated successfully!");
            this.updateUserDetails();
        } catch (err) {
            console.error(err);
            toast.error("Unable to update user details. Please try after sometime");
        }
    }

    validateInputs = ({ firstName, lastName, phone, address, pincode }) => {
        let validInputs = true;

        if (!firstName) {
            toast.error("Please provide first name.");
            validInputs = false;
        }

        if (!lastName) {
            toast.error("Please provide last name.");
            validInputs = false;
        }

        if (!phone) {
            toast.error("Please provide phone.");
            validInputs = false;
        }

        if (!address) {
            toast.error("Please provide address.");
            validInputs = false;
        }

        if (!pincode) {
            toast.error("Please provide pincode.");
            validInputs = false;
        }

        return validInputs;
    }

    updateProfileImage = async (event) => {
        const file = event.target.files[0];
        const fileName = event.target.files[0].name;
        const buffer = await file.arrayBuffer();
        const blob = new Blob([new Uint8Array(buffer)], { type: file.type });

        const form = new FormData();
        form.append("file", blob, { filename: fileName });

        try {
            await APIProxy.updateProfileImage(form);
            toast.success("Profile image updated successfully!");
            this.forceUpdate();
        } catch (err) {
            console.error(err);
            toast.error("Unable to update profile image! please try again later");
        }
    }

    shouldComponentUpdate = () => {
        return true;
    }

    render = () => {
        if (this.state.isLoading) {
            return (
                <section className="content-main">
                    <div className="d-flex justify-content-center justify-content-middle">
                        <div className="d-flex">
                            <span className="text-muted fw-bold">Loading...</span>
                        </div>
                    </div>
                </section>
            );
        }


        if (!this.props.loggedIn) {
            return (
                <section className="content-main">
                    <div className="d-flex justify-content-center justify-content-middle">
                        <div className="d-flex">
                            <span className="text-muted fw-bold">Please login to see the profile!</span>
                        </div>
                    </div>
                </section>
            );
        }

        if (this.state.fetchFailed) {
            return (
                <section className="content-main">
                    <div className="d-flex justify-content-center justify-content-middle">
                        <div className="d-flex">
                            <span className="text-muted fw-bold">Something went wrong! Failed to get user details!</span>
                        </div>
                    </div>
                </section>
            );
        }

        const { firstName, lastName, email, phone, address, pincode, id } = this.state.info;

        return (
            <section className="content-main">
                <div className="card mb-4 shadow-sm">
                    <header className="card-header bg-white">
                        <h2 className="content-title">Profile</h2>
                    </header>
                    <div className="card-body">
                        <div className="row mb-3 p-2">
                            <div className="col">
                                <label htmlFor="firstNameInput" className="form-label">First Name:</label>
                                <input id="firstNameInput" type="text" className="form-control" defaultValue={firstName} placeholder="First Name" />
                            </div>
                            <div className="col">
                                <label htmlFor="lastNameInput" className="form-label">Last Name:</label>
                                <input id="lastNameInput" type="text" className="form-control" defaultValue={lastName} placeholder="Last Name" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                <div className="mb-3 p-2">
                                    <label htmlFor="emailInput" className="form-label">E-mail:</label>
                                    <input id="emailInput" type="text" className="form-control" defaultValue={email} disabled />
                                </div>
                                <div className="mb-3 p-2">
                                    <label htmlFor="phoneInput" className="form-label">Phone:</label>
                                    <input id="phoneInput" type="text" className="form-control" defaultValue={phone} placeholder="Phone" />
                                </div>
                                <div className="mb-3 p-2">
                                    <label htmlFor="addressInput" className="form-label">Address:</label>
                                    <textarea id="addressInput" className="form-control" placeholder="Your Address" defaultValue={address}></textarea>
                                </div>
                                <div className="mb-3 p-2">
                                    <label htmlFor="pincodeInput" className="form-label">Pincode:</label>
                                    <input id="pincodeInput" type="text" className="form-control" defaultValue={pincode} placeholder="Pincode" />
                                </div>
                            </div>
                            <div className="col">
                                <div className="d-flex align-items-center" style={{ height: "100%" }}>
                                    <div className="d-flex justify-content-center" style={{ width: "100%" }}>
                                        <div className="d-flex">
                                            <img src={Utils.getURL(`/user/image/${id}`)} style={{ width: "100px", height: "100px" }} />
                                            <div className="mb-3 p-2">
                                                <label htmlFor="profileImageInput" className="form-label">Profile Image:</label>
                                                <input id="profileImageInput" type="file" className="form-control" onChange={this.updateProfileImage} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mb-3 p-2">
                            <div className="d-flex justify-content-center">
                                <div className="d-flex">
                                    <button className="btn btn-primary" type="button" onClick={this.updateUserInfo}>Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}



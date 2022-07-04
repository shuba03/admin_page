import React from "react";

import ProfileSection from "./profile-section";
import Sidebar from "../../components/sidebar/sidebar";
import Header from "../../components/Header/header";


export default class Profile extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <Sidebar  {...this.props} />
                <main className="main-wrap">
                    <Header  {...this.props} />
                    <ProfileSection  {...this.props} />
                </main>
            </>
        )
    }
}

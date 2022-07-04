import React from "react";
import OrderSection from "./landing-section";
import Sidebar from "../../components/sidebar/sidebar";
import Header from "../../components/Header/header";

export default class LandingPage extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <Sidebar {...this.props} />
                <main className="main-wrap">
                    <Header {...this.props} />
                    <LandingSection  {...this.props} />
                </main>
            </>
        )
    }
}

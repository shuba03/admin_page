import React from "react";
import OrderSection from "./order-section";
import Sidebar from "../../components/sidebar/sidebar";
import Header from "../../components/Header/header";

export default class OrderPage extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <Sidebar {...this.props} />
                <main className="main-wrap">
                    <Header {...this.props} />
                    <OrderSection  {...this.props} />
                </main>
            </>
        )
    }
}

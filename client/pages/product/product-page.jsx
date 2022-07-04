import React from "react";
import Sidebar from "../../components/sidebar/sidebar";
import Header from "../../components/Header/header";
import ProductSection from "./products-section";

export default class ProductPage extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <Sidebar  {...this.props} />
                <main className="main-wrap">
                    <Header  {...this.props} />
                    <ProductSection  {...this.props} />
                </main>
            </>
        )
    }
}

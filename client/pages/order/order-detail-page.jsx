import React from "react";

import { Link } from "react-router-dom";

import Sidebar from "../../components/sidebar/sidebar";
import Header from "../../components/Header/header";

import APIProxy from "../../proxy/api-proxy";
import Utils from "../../utils/utils";

const statusToHeader = {
    "Delivered": "bg-success",
    "Accepted": "bg-primary",
    "Dispatched": "bg-info",
    "Pending": "bg-secondary",
    "Rejected": "bg-danger",
    "Canceled": "bg-warning"
}

export default class OrderDetailPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            orderDetail: {},
            user: {},
            fetchFailed: false,
            isLoading: true,
            orderId: null
        }
    }

    componentDidMount = async () => {
        const orderId = this.props.match.params.id;
        let details = {};
        try {
            const orderDetail = await APIProxy.getOrderDetails(orderId);
            const user = await APIProxy.getUserInfo();

            details = { user, orderDetail, fetchFailed: false };
        } catch (err) {
            console.error("Failed to get order details", err);
            details = { orderDetail: {}, fetchFailed: true };
        }

        this.setState({ ...details, isLoading: false, orderId });
    }

    getOrderProductDetail = () => {
        const { orderDetail } = this.state;
        const { items, amount } = orderDetail;
        return (
            <table className="table border table-lg">
                <thead>
                    <tr>
                        <th style={{ width: "40%" }}>Product</th>
                        <th style={{ width: "20%" }}>Unit Price</th>
                        <th style={{ width: "20%" }}>Quantity</th>
                        <th style={{ width: "20%" }} className="text-end">
                            Total
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        items.map(item => {
                            const { productId, unitPrice, quantity, price, product } = item;
                            const { name } = product;
                            return (
                                <tr key={productId}>
                                    <td>
                                        <Link className="itemside" to="#">
                                            <div className="left">
                                                <img
                                                    src={Utils.getURL(`/products/product/image/${productId}`)}
                                                    alt={name}
                                                    style={{ width: "40px", height: "40px" }}
                                                    className="img-xs"
                                                />
                                            </div>
                                            <div className="info">
                                                {name}
                                            </div>
                                        </Link>
                                    </td>
                                    <td>Rs. {unitPrice} </td>
                                    <td>{quantity}</td>
                                    <td className="text-end"> Rs. {price}</td>
                                </tr>
                            );
                        })
                    }
                    <tr>
                        <td colSpan="4">
                            <article className="float-end">
                                <dl className="dlist">
                                    <dt>Subtotal:</dt> <dd>Rs. {amount}</dd>
                                </dl>
                                <dl className="dlist">
                                    <dt>Shipping cost:</dt> <dd>Rs. 0 {"(Free)"}</dd>
                                </dl>
                                <dl className="dlist">
                                    <dt>Grand total:</dt>
                                    <dd>
                                        <b className="h5">Rs. {amount}</b>
                                    </dd>
                                </dl>
                            </article>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }

    getOrderDetail = () => {
        const { orderDetail, user } = this.state;
        const { dateTime, amount, itemsCount } = orderDetail;
        const { firstName, lastName, email, phone, address } = user;
        return (
            <div className="row mb-5 order-info-wrap">
                <div className="col-md-6 col-lg-4">
                    <article className="icontext align-items-start">
                        <span className="icon icon-sm rounded-circle alert-success">
                            <i className="text-success fas fa-user"></i>
                        </span>
                        <div className="text">
                            <h6 className="mb-1">{`${firstName} ${lastName}`}</h6>
                            <p className="mb-1">
                                {phone}
                                <br />
                                <a href={`mailto:${email}`}>{email}</a>
                            </p>
                        </div>
                    </article>
                </div>
                <div className="col-md-6 col-lg-4">
                    <article className="icontext align-items-start">
                        <span className="icon icon-sm rounded-circle alert-success">
                            <i className="text-success fas fa-truck-moving"></i>
                        </span>
                        <div className="text">
                            <h6 className="mb-1">Order Info</h6>
                            <p className="mb-1">
                                Date: {dateTime}
                                <br />
                                items: {itemsCount}
                                <br />
                                Rs: {amount}
                            </p>
                        </div>
                    </article>
                </div>
                <div className="col-md-6 col-lg-4">
                    <article className="icontext align-items-start">
                        <span className="icon icon-sm rounded-circle alert-success">
                            <i className="text-success fas fa-map-marker-alt"></i>
                        </span>
                        <div className="text">
                            <h6 className="mb-1">Deliver to</h6>
                            <p className="mb-1">
                                Address:
                                <br />
                                {address}
                            </p>
                        </div>
                    </article>
                </div>
            </div>
        )
    }

    renderSection = () => {
        const { orderDetail, isLoading } = this.state;
        const { status } = orderDetail;

        if (isLoading) {
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
                            <span className="text-muted fw-bold">Please Login to see the order detail!</span>
                        </div>
                    </div>
                </section>
            );
        }

        if (!orderDetail || Object.keys(orderDetail).length === 0) {
            <section className="content-main">
                <div className="d-flex justify-content-center justify-content-middle">
                    <div className="d-flex">
                        <span className="text-muted fw-bold">No order information found!</span>
                    </div>
                </div>
            </section>
        }

        return (
            <section className="content-main">
                <div className="card">
                    <header className={`card-header p-3 ${statusToHeader[status]}`}>
                        <div className="row align-items-center ">
                            <div className="col-lg-6 col-md-6">
                                <span>
                                    <b className="text-white">Order ID: {this.state.orderId}</b>
                                </span>
                            </div>
                            <div className="col-lg-6 col-md-6 ms-auto d-flex justify-content-end align-items-center">
                                <span>
                                    <b className="text-white">Status: {status}</b>
                                </span>
                            </div>
                        </div>
                    </header>
                    <div className="card-body">
                        {this.getOrderDetail()}
                        <div className="row">
                            <div className="table-responsive">
                                {this.getOrderProductDetail()}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }


    render = () => {
        return (
            <>
                <Sidebar {...this.props} />
                <main className="main-wrap">
                    <Header {...this.props} />
                    {this.renderSection()}
                </main>
            </>

        )
    }
}

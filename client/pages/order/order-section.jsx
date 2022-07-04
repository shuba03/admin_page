import React from "react";

import { toast } from 'react-toastify';

import APIProxy from "../../proxy/api-proxy";
import Orders from "./orders";

export default class OrderSection extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fetchFailed: false,
            isLoading: true,
            orders: []
        }
    }

    componentDidMount = async () => {
        await this.updateOrders();
    }

    updateOrders = async () => {
        const { fetchFailed, orders } = await this.getOrders();
        this.setState({ fetchFailed, orders });
    }

    getOrders = async (orderStatus) => {
        try {
            const orders = await APIProxy.getOrders(orderStatus);
            return { fetchFailed: false, orders };
        } catch (err) {
            console.error(err);
            toast.error("Failed to fetch orders!");
            return { fetchFailed: true, orders: [] };
        }
    }

    filterOrders = async (event) => {
        let filterValue = event.target.value;
        if (filterValue.trim() === "None") {
            filterValue = "";
        }

        const { fetchFailed, orders } = await this.getOrders(filterValue);
        this.setState({ fetchFailed, orders });
    }

    render = () => {

        if (!this.props.loggedIn) {
            return (
                <section className="content-main">
                    <div className="d-flex justify-content-center justify-content-middle">
                        <div className="d-flex">
                            <span className="text-muted fw-bold">Please Login to see your orders!</span>
                        </div>
                    </div>
                </section>
            )
        }


        return (
            <section className="content-main">

                <div className="card mb-4 shadow-sm">
                    <header className="card-header bg-white">
                        <div className="row gx-3 py-3">
                            <div className="col-lg-4 col-md-6 me-auto">
                                <h3>Orders</h3>
                            </div>
                            <div className="col-lg-2 col-6 col-md-3">
                                <select className="form-select" defaultValue={this.state.filter} onChange={this.filterOrders}>
                                    <option value={"None"}>None</option>
                                    <option value={"Delivered"}>Delivered</option>
                                    <option value={"Accepted"}>Accepted</option>
                                    <option value={"Dispatched"}>Dispatched</option>
                                    <option value={"Pending"}>Pending</option>
                                    <option value={"Rejected"}>Rejected</option>
                                    <option value={"Canceled"}>Canceled</option>
                                </select>
                            </div>
                            <div className="col-lg-2 col-6 col-md-3">
                            </div>
                        </div>
                    </header>
                    <div className="card-body">
                        <div className="table-responsive">

                            {
                                (() => {
                                    if (!this.state.orders || this.state.orders.length === 0) {
                                        return (
                                            <div className="d-flex justify-content-center justify-content-middle">
                                                <div className="d-flex">
                                                    <span className="text-muted fw-bold">No orders found!</span>
                                                </div>
                                            </div>
                                        );
                                    }

                                    return <Orders orders={this.state.orders} />;
                                })()
                            }
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}



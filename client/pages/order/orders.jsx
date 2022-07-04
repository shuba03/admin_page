import React from "react";
import { Link } from "react-router-dom";

const statusToBadge = {
    "Delivered": "badge btn-success",
    "Accepted": "badge btn-primary",
    "Dispatched": "badge btn-info",
    "Pending": "badge btn-secondary",
    "Rejected": "badge btn-danger",
    "Canceled": "badge btn-warning"
}

export default class Orders extends React.Component {
    constructor(props) {
        super(props);
    }

    render = () => {
        return (
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Order Id</th>
                        <th scope="col">Products Count</th>
                        <th scope="col">Total Amount</th>
                        <th scope="col">Order Date</th>
                        <th scope="col">Status</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.props.orders.map(order => {
                            const { id, productCount, totalPrice, dateTime, status } = order;

                            return (
                                <tr key={id}>
                                    <td>{id}</td>
                                    <td>{productCount}</td>
                                    <td>
                                        <span className="badge rounded-pill alert-success">
                                            Rs. {totalPrice}
                                        </span>
                                    </td>
                                    <td>{dateTime}</td>
                                    <td>
                                        <span className={statusToBadge[status]}>{status}</span>
                                    </td>
                                    <td className="d-flex justify-content-end align-item-center">
                                        <Link to={`/queen-mobiles/order/${id}`} className="text-success">
                                            <i className="fas fa-eye"></i>
                                        </Link>
                                    </td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </table>
        )

    }
}

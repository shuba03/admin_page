import React from "react";
import { Link } from "react-router-dom";

const Orders = () => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">Product Name</th>
          <th scope="col">User Email-Id</th>
          <th scope="col">Total Amount</th>
          <th scope="col">Paid</th>
          <th scope="col">Date</th>
          <th>Status</th>
          <th scope="col" className="text-end">
            Action
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <b>Product Name</b>
          </td>
          <td>user@example.com</td>
          <td>Money here</td>
          <td>
            <span className="badge rounded-pill alert-success">
              Paid At Today 23:56 AM
            </span>
          </td>
          <td>Date</td>
          <td>
            <span className="badge btn-success">Delivered</span>
          </td>
          <td className="d-flex justify-content-end align-item-center">
            <Link to={`/order`} className="text-success">
              <i className="fas fa-eye"></i>
            </Link>
          </td>
        </tr>
        {/* Not paid Not delivered */}
        <tr>
          <td>
            {/* <b>Velcro Sneakers For Boys & Girls (Blue)</b> */}
            <b>Product name</b>
          </td>
          <td>user@example.com</td>
          <td>Money here</td>
          <td>
            <span className="badge rounded-pill alert-danger">Not paid</span>
          </td>
          <td>Date</td>
          <td>
            <span className="badge btn-dark">Not Delivered</span>
          </td>
          <td className="d-flex justify-content-end align-item-center">
            <Link to={`/order`} className="text-success">
              <i className="fas fa-eye"></i>
            </Link>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default Orders;

import React from "react";
import { Link } from "react-router-dom";
import { HeartFill, Heart } from "react-bootstrap-icons";
import { toast } from 'react-toastify';

import Rating from "../../components/rating/rating";

import APIProxy from "../../proxy/api-proxy";


export default class Product extends React.Component {
    constructor(props) {
        super(props);
    }

    addItemInCart = async (productId, addedInCart) => {
        try {

            const userLoggedIn = this.props.loggedIn;

            if (!userLoggedIn) {
                toast.info("Please login to add the product in cart!");
                return;
            }

            if (addedInCart) {
                toast.info("Iteam already present in cart!");
                return;
            }
            await APIProxy.addCartItem(productId);
            toast.info("Item added to the cart!");

            this.props.updateProductList();
        } catch (err) {
            console.error(err);
            toast.error("Failed to add the item in the cart!");
        }
    }

    toggleFav = async (productId, addToFav) => {
        debugger;
        const userLoggedIn = this.props.loggedIn;

        if (!userLoggedIn && addToFav) {
            toast.info("Please login to add products in favourites!");
            return;
        }

        try {
            if (addToFav) {
                await APIProxy.addProductInFav(productId);
                toast.success("Product successfully added to favourites!");
            } else {
                await APIProxy.removeProductFromFav(productId);
                toast.info("Product removed from favourites!");
            }

            this.props.updateProductList();
        } catch (err) {
            console.error(err);
            toast.error("Failed to update favourites!");
        }
    }

    render = () => {
        const { id, name, price, addedInFav, addedInCart, overallRating, totalReviews } = this.props.product;

        return (
            <>
                <div className="col-md-6 col-sm-6 col-lg-3 mb-5">
                    <div className="card card-product-grid shadow-sm">
                        <Link to={`/queen-mobiles/product/${id}`} className="img-wrap">
                            <img src={`/queen-mobiles/products/product/image/${id}`} alt={name} />
                        </Link>
                        <div className="info-wrap">
                            <div className="row">
                                <div className="col">
                                    <Link to={`/queen-mobiles/product/${id}`} className="title text-truncate">
                                        {name}
                                    </Link>
                                </div>
                                <div className="col">
                                    <div className="d-flex justify-content-end">
                                        <div className="d-flex">
                                            <button className="btn btn-outline-info" type="button" onClick={() => { this.toggleFav(id, !addedInFav); }}>
                                                {
                                                    addedInFav ?
                                                        <HeartFill color="#ff596d" /> :
                                                        <Heart color="#ff596d" />
                                                }
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div><Rating rating={overallRating} title={`(${totalReviews} reviews)`} /></div>
                            </div>
                            <div className="row">
                                <div className="price mb-2">Rs.{price}</div>
                            </div>
                            <div className="row">
                                <button className="btn btn-primary" type="button" disabled={addedInCart} onClick={() => {
                                    this.addItemInCart(id, addedInCart);
                                }}>
                                    {
                                        addedInCart ? "Added in cart" : "Add to cart"
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

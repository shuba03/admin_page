import React from "react";
import { HeartFill, Heart } from "react-bootstrap-icons";
import Sidebar from "../../components/sidebar/sidebar";
import Header from "../../components/Header/header";

import RenderHtml from "../../components/render-html/RederHtml";
import Rating from "../../components/rating/rating";
import APIProxy from "../../proxy/api-proxy";

import { toast } from 'react-toastify';

import $ from "jquery";
import Utils from "../../utils/utils";

export default class ProductDetailPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            productId: null,
            isLoading: true,
            fetchFailed: false,
            reviews: [], rating: {}, name: null, description: null, price: null,
            addedInCart: false,
            addedInFav: false
        }

        this.ratingInput = React.createRef();
    }

    componentDidMount = async () => {
        const productId = this.props.match.params.id;
        let details = {};
        try {
            const { reviews, overallRating, name, description, price, totalReviews, id, addedInCart, addedInFav } = await APIProxy.getProductDetail(productId);

            details = { id, reviews, rating: { value: overallRating, count: totalReviews }, name, description, price, fetchFailed: false, addedInCart, addedInFav };
        } catch (err) {
            console.error("Failed to get product details", err);
            details = { fetchFailed: true };
        }

        this.setState({ ...details, isLoading: false, productId });
    }

    addUserReview = async () => {
        const userReview = $("#user-review-text-area").val().trim();
        const userRating = this.ratingInput.current.getRating();

        try {
            await APIProxy.addUserReview(this.state.productId, userRating, userReview);
            toast.success("Review added successfully!");
        } catch (err) {
            console.error(err);
            toast.error("Something went wron! Not able to the review now");
        }
    }

    toggleFav = async (productId, addToFav) => {
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
            }
            this.setState({ addedInFav: addToFav });
        } catch (err) {
            console.error(err);
            toast.error("Failed to update favourites!");
        }
    }

    addItemInCart = async () => {
        try {
            if (this.state.addedInCart) {
                toast.info("Iteam already present in cart!");
                return;
            }
            await APIProxy.addCartItem(this.state.id);
            this.setState({ addedInCart: true });
        } catch (err) {
            console.error(err);
            toast.error("Failed to add the item in the cart!");
        }
    }

    getContentOrMessage = () => {
        if (this.state.isLoading) {
            return (<h3>Loading....</h3>)
        }

        if (this.state.fetchFailed) {
            return (<h3>Something went wrong! Failed to get product details.</h3>)
        }

        const { id, name, description, price, rating } = this.state;
        const { value: ratingValue, count: usersCount } = rating;

        return (
            <>
                <div className="card mb-3">
                    <div className="row g-0">
                        <div className="col-md-4">
                            <img src={`/queen-mobiles/products/product/image/${id}`} style={{ width: "100%" }} alt={name} />
                        </div>
                        <div className="col-md-8">
                            <div className="card-body">
                                <div className="row ms-2">
                                    <div className="col">
                                        <h5 className="card-title"> {name}</h5>
                                    </div>
                                    <div className="col">
                                        <div className="d-flex flex-row-reverse pe-4">
                                            <button className="btn btn-outline-info" type="button">
                                                {this.state.addedInFav ? <HeartFill color="#ff596d" onClick={() => { this.toggleFav(id, false); }} /> : <Heart color="#ff596d" onClick={() => { this.toggleFav(id, true); }} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="row ms-2">
                                    <div className="row md-3 pt-3 pb-2" style={{ borderBottom: "1px ridge" }}>
                                        <div className="col">
                                            Brand: Moto
                                        </div>
                                        <div className="col">
                                            <div className="d-flex flex-row-reverse">
                                                <Rating rating={ratingValue} title={`(${usersCount} reviews)`} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row md-3 pt-3 pb-2" style={{ borderBottom: "1px ridge" }}>
                                        <div className="price mb-2">Price: Rs. {price}</div>
                                    </div>
                                    <div className="row md-4 pt-3 pb-2" style={{ minHeight: "200px", borderBottom: "1px ridge" }}>
                                        <RenderHtml htmlContent={description} />
                                    </div>
                                    <div className="row md-2 pt-3 pb-2">
                                        <button className="btn btn-primary" type="button" style={{ width: "100%" }} onClick={this.addItemInCart} disabled={this.state.addedInCart}>
                                            {this.state.addedInCart ? "Added in cart" : "Add to Cart"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {
                    // user reviews
                    (() => {
                        if (!this.state.reviews || this.state.reviews.length === 0) {
                            return null;
                        }

                        return (
                            <div className="container m-0 p-0">
                                <div className="bg-white rounded shadow-sm p-2 pb-0 mb-4">
                                    <h5 className="mb-1 p-2">User Reviews</h5>

                                    {this.state.reviews.map(review => {
                                        const { user, dateTime, userId, review: userReview, rating: userRating } = review;
                                        debugger;
                                        return (
                                            <div className="row p-3" key={user} style={{ borderBottom: "1px ridge" }}>
                                                <div className="col-md-2 p-2">
                                                    <div className="row">
                                                        <img src={Utils.getURL(`/user/image/${userId}`)} alt={user} style={{ maxHeight: "75px", width: "100%", maxWidth: "75px" }} />
                                                    </div>
                                                    <div className="row">
                                                        <div className="d-flex justify-content-start">
                                                            <div className="d-flex">
                                                                <span className="text-muted">{user}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-8 p-2">
                                                    <div className="row ">
                                                        <p className="text-md-left">{userReview}</p>
                                                    </div>
                                                    <div className="row">
                                                        <div className="d-flex justify-content-end">
                                                            <div className="d-flex">
                                                                <p className="text-muted mt-3" style={{ fontSize: "0.8rem" }}><span className="fst-italic">- {dateTime}</span></p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-2 p-2">
                                                    <Rating id={user} rating={userRating} />
                                                </div>
                                            </div>
                                        )
                                    })}

                                </div>

                            </div>
                        )
                    })()
                }

                {
                    (() => {

                        if (!this.props.loggedIn) {
                            return null;
                        }

                        return <div className="container m-0 p-0">
                            <div className="bg-white rounded shadow-sm p-2 pb-0 mb-4">
                                <h5 className="mb-1 p-2">Rating and Review</h5>
                                <div className="row mb-3 p-2">
                                    <div className="col-md-1">
                                        <label className="form-label">Rating:</label>
                                    </div>
                                    <div className="col">
                                        <Rating id={"user-rating-input"} rating={3} editable={true} ref={this.ratingInput} />
                                    </div>
                                </div>
                                <div className="mb-3 p-2">
                                    <label htmlFor="user-review-text-area" className="form-label">Review:</label>
                                    <textarea id="user-review-text-area" className="form-control" placeholder="Add your review..."></textarea>
                                </div>
                                <div className="mb-3 p-2">
                                    <div className="d-flex justify-content-center">
                                        <div className="d-flex">
                                            <button className="btn btn-primary" type="button" onClick={this.addUserReview}>Submit</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    })()
                }
            </>
        );
    }

    render() {
        return (
            <>
                <Sidebar {...this.props} />
                <main className="main-wrap">
                    <Header {...this.props} />
                    <section className="content-main">
                        {this.getContentOrMessage()}
                    </section>
                </main>
            </>

        );
    }
}

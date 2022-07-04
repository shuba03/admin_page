import React from "react";

import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

import "./app.css";

import LandingPage from "../pages/landing/landing-page";
import ProductPage from "./product/product-page";
import ProductDetailPage from "./product/product-detail-page";
import OrderPage from "../pages/order/order-page";
import OrderDetailPage from "./order/order-detail-page";
import CartPage from "../pages/cart/cart-page";
import FavPage from "../pages/favourite/fav-page";
import ProfilePage from "../pages/user/profile";
import LoginPage from "../pages/login/login";
import SignupPage from "../pages/login/signup";
import ForgotPasswordPage from "../pages/login/forgot-password";
import NotFoundPage from "../pages/not-found/not-found";
import ChangePassword from "./user/change-password";

import APIProxy from "../proxy/api-proxy";

export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loggedIn: false,
            userId: null,
            firstName: null,
            lastName: null
        }
    }

    componentDidMount = async () => {
        const { status, id, firstName, lastName } = await APIProxy.getUserInfo();
        this.setState({ loggedIn: (status === "success"), userId: id, firstName, lastName });
    }

    onLoginSuccess = async () => {
        const { id, firstName, lastName } = await APIProxy.getUserInfo();
        this.setState({ loggedIn: true, userId: id, firstName, lastName });
    }

    render() {
        const { loggedIn, userId, firstName, lastName } = this.state;
        const user = { userId, firstName, lastName };

        return (
            <Router>
                <Switch>
                    <Route path="/queen-mobiles-admin" component={HomeScreen} exact />
                    <Route path="/queen-mobiles-admin/products" component={ProductScreen} />
                    <Route path="/queen-mobiles-admin/orders" component={OrderScreen} />
                    <Route path="/queen-mobiles-admin/order" component={OrderDetailScreen} />
                    <Route path="/queen-mobiles-admin/addproduct" component={AddProduct} />
                    <Route path="/queen-mobiles-admin/users" component={UsersScreen} />
                    <Route path="/queen-mobiles-admin/product/:id/edit" component={ProductEditScreen} />
                    <Route path="/queen-mobiles-admin/login" component={Login} />
                    <Route path="*" component={NotFound} />
                </Switch>
            </Router>
        );

        return (<Router>
            <Switch>
                <Route path="/queen-mobiles" render={(props) => (<LandingPage {...props} loggedIn={loggedIn} user={user} />)} exact />
                <Route path="/queen-mobiles/home" render={(props) => (<LandingPage {...props} loggedIn={loggedIn} user={user} />)} />
                <Route path="/queen-mobiles/products" render={(props) => (<ProductPage {...props} loggedIn={loggedIn} user={user} />)} />
                <Route path="/queen-mobiles/product/:id" render={(props) => (<ProductDetailPage {...props} loggedIn={loggedIn} user={user} />)} />
                <Route path="/queen-mobiles/orders" render={(props) => (<OrderPage {...props} loggedIn={loggedIn} user={user} />)} />
                <Route path="/queen-mobiles/order/:id" render={(props) => (<OrderDetailPage {...props} loggedIn={loggedIn} user={user} />)} />
                <Route path="/queen-mobiles/cart" render={(props) => (<CartPage {...props} loggedIn={loggedIn} user={user} />)} />
                <Route path="/queen-mobiles/favourite" render={(props) => (<FavPage {...props} loggedIn={loggedIn} user={user} />)} />
                <Route path="/queen-mobiles/user" render={(props) => (<ProfilePage {...props} loggedIn={loggedIn} user={user} />)} />
                <Route path="/queen-mobiles/login" render={(props) => (<LoginPage {...props} loggedIn={loggedIn} successHandler={this.onLoginSuccess.bind(this)} user={user} />)} />
                <Route path="/queen-mobiles/signup" render={(props) => (<SignupPage {...props} loggedIn={loggedIn} user={user} />)} />
                <Route path="/queen-mobiles/forgot-password" render={(props) => (<ForgotPasswordPage {...props} loggedIn={loggedIn} user={user} />)} />
                <Route path="/queen-mobiles/setting" render={(props) => (<ChangePassword {...props} loggedIn={loggedIn} user={user} />)} />
                <Route path="*" component={NotFoundPage} />
            </Switch>
        </Router>)
    }
}

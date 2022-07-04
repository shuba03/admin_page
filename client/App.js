import React from "react";
import "./App.css";
import "./responsive.css";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/productScreen";
// import CategoriesScreen from "./screens/CategoriesScreen";
import OrderScreen from "./screens/OrderScreen";
import OrderDetailScreen from "./screens/OrderDetailScreen";
import AddProduct from "./screens/AddProduct";
import Login from "./screens/LoginScreen";
import UsersScreen from "./screens/UsersScreen";
import ProductEditScreen from "./screens/ProductEditScreen";
import NotFound from "./screens/NotFound";
export default class App extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount = () => {

  }

  render() {
    return (
      <Router>
        <Switch>
          <Route path="/queen-mobiles-admin" component={HomeScreen} exact />
          <Route path="/queen-mobiles-admin/products" component={ProductScreen} />
          {/* <Route path="/category" component={CategoriesScreen} /> */}
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
  }
}

import React from "react";
import { Link, Redirect } from "react-router-dom";
import $ from "jquery";

import APIProxy from "../proxy/api-proxy";


export default class Header extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      redirectToLogin: false
    }
  }

  addEventListeners = () => {
    $("[data-trigger]").on("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var offcanvas_id = $(this).attr("data-trigger");
      $(offcanvas_id).toggleClass("show");
    });

    $(".btn-aside-minimize").on("click", function () {
      if (window.innerWidth < 768) {
        $("body").removeClass("aside-mini");
        $(".navbar-aside").removeClass("show");
      } else {
        // minimize sidebar on desktop
        $("body").toggleClass("aside-mini");
      }
    });
  }

  componentDidMount = async () => {
    this.addEventListeners();

    try{
      const info = await APIProxy.getUserInfo();
    }catch(err) {
      if(err.response && err.response.status === 401){
        this.setState({redirectToLogin: true});
      }
    }
  }

  logout = async () => {
    try {
      await APIProxy.logout();

      this.setState({redirectToLogin: true});
    }catch(err) {
      console.error("Failed to logout", err);
    }
  }

  componentDidUpdate = () => {
    this.addEventListeners();
  }

  render = () => {

    if(this.state.redirectToLogin) {
      return <Redirect to= "/queen-mobiles-admin/login" />
    }

    return (
      <header className="main-header navbar">
        <div className="col-search">
          <form className="searchform">
            <div className="input-group">
              <input
                list="search_terms"
                type="text"
                className="form-control"
                placeholder="Search term"
              />
              <button className="btn btn-light bg" type="button">
                <i className="far fa-search"></i>
              </button>
            </div>
            <datalist id="search_terms">
              <option value="Products" />
              <option value="New orders" />
              <option value="Apple iphone" />
              <option value="Ahmed Hassan" />
            </datalist>
          </form>
        </div>
        <div className="col-nav">
          <button
            className="btn btn-icon btn-mobile me-auto"
            data-trigger="#offcanvas_aside"
          >
            <i className="md-28 fas fa-bars"></i>
          </button>
          <ul className="nav">
            <li className="nav-item">
              <Link className={`nav-link btn-icon `} title="Dark mode" to="#">
                <i className="fas fa-moon"></i>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link btn-icon" to="#">
                <i className="fas fa-bell"></i>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="#">
                Custom-Page
              </Link>
            </li>
            <li className="dropdown nav-item">
              <Link className="dropdown-toggle" data-bs-toggle="dropdown" to="#">
                <img
                  className="img-xs rounded-circle"
                  src="/images/logo.jpg"
                  alt="User"
                />
              </Link>
              <div className="dropdown-menu dropdown-menu-end">
                <Link className="dropdown-item" to="/">
                  My profile
                </Link>
                <Link className="dropdown-item" to="#">
                  Settings
                </Link>
                <Link className="dropdown-item text-danger" to="#" onClick={this.logout}>
                  Exit
                </Link>
              </div>
            </li>
          </ul>
        </div>
      </header>
    );
  }
}
import React from "react";
import { FunnelFill } from "react-bootstrap-icons";

import APIProxy from "../../proxy/api-proxy";
import Product from "./product";

import $ from "jquery";

export default class ProductSection extends React.Component {
    constructor(props) {
        super(props);

        this.brands = [];
        this.colors = [];

        this.state = {
            isLoading: true,
            fetchFailed: false,
            activePage: 1,
            totalPages: 0,
            searchQuery: null, // search for product name and description
            filterBy: {}, // filter by brand, color
            sortBy: "none", // sort by price, sort by rating
            products: []
        }
    }

    componentDidMount = async () => {
        await this.updateProductList();
    }

    updateProductList = async () => {
        const { fetchFailed, page, products, totalPages } =
            await this.getProducts(this.state.searchQuery, this.state.filterBy, this.state.sortBy, this.state.activePage);
        this.brands = await this.getAllBrands();
        this.colors = await this.getAllMobileColors();
        this.setState({
            isLoading: false,
            fetchFailed,
            activePage: page,
            totalPages: totalPages,
            products
        });
    }

    onSearch = async (event) => {
        const searchQuery = event.target.value ? event.target.value.trim() : null;
        const { fetchFailed, page, products, totalPages } =
            await this.getProducts(searchQuery, this.state.filterBy, this.state.sortBy, this.state.activePage);

        this.setState({
            showFilterModal: false,
            fetchFailed,
            activePage: page,
            totalPages: totalPages,
            searchQuery,
            products
        });
    }

    onClickPagination = async (event) => {
        let targetPage = event.target.getAttribute("value");

        if (targetPage === "next") {
            targetPage = this.state.activePage + 1;
        } else if (targetPage === "previous") {
            targetPage = this.state.activePage - 1;
        } else {
            targetPage = Number.parseInt(targetPage);
        }

        const { fetchFailed, page, products, totalPages } =
            await this.getProducts(this.state.searchQuery, this.state.filterBy, this.state.sortBy, targetPage);

        this.setState({
            fetchFailed,
            activePage: targetPage,
            totalPages,
            products
        });
    }

    onSort = async (event) => {
        const sortBy = event.target.value ? event.target.value.trim() : "none";
        const { fetchFailed, page, products, totalPages } =
            await this.getProducts(this.state.searchQuery, this.state.filterBy, sortBy, this.state.activePage);

        this.setState({
            showFilterModal: false,
            fetchFailed,
            activePage: page,
            totalPages: totalPages,
            sortBy,
            products
        });
    }

    getAllBrands = async () => {
        let brands = null;
        try {
            brands = await APIProxy.getBrands();
        } catch (err) {
            console.error("Failed to fetch brands!", err);
        }
        return brands || [];
    }

    getAllMobileColors = async () => {
        let colors = null;
        try {
            colors = await APIProxy.getAllMobileColors();
        } catch (err) {
            console.error("Failed to fetch mobile colors!", err);
        }
        return colors || [];
    }

    getProducts = async (searchQuery, filterBy, sortBy, pageNo) => {
        try {
            const { pageSize, products, totalProducts } = await APIProxy.getProducts(
                {
                    searchTerm: searchQuery,
                    brands: filterBy?.brands,
                    colors: filterBy?.colors,
                    sortBy: sortBy,
                    pageNo
                }
            );

            console.log({ pageSize, products, totalProducts });

            return { page: pageNo, products, totalPages: products.length === 0 ? 0 : Math.ceil(totalProducts / pageSize), fetchFailed: false };
        } catch (err) {
            return { page: pageNo, products: [], totalPages: 0, fetchFailed: true };
        }
    }

    getFilterValues = (elementClass) => {
        const filterValues = $(`.${elementClass}`)
            .filter((index, htmlElement) => {
                return $(htmlElement).is(":checked");
            })
            .map((index, htmlElement) => {
                return ($(htmlElement).data() || {}).value;
            });
        return filterValues.toArray();
    }

    onFilterUpdate = async (event) => {
        const colorClassName = "color-value";
        const brandClassName = "brand-value";

        const colors = this.getFilterValues(colorClassName);
        const brands = this.getFilterValues(brandClassName);

        const { fetchFailed, page, products, totalPages } =
            await this.getProducts(this.state.searchQuery, { brands, colors }, this.state.sortBy, this.state.activePage);
        this.setState({
            showFilterModal: false,
            fetchFailed,
            activePage: page,
            totalPages: totalPages,
            filterBy: { brands, colors },
            products,
            showFilterModal: false
        });
    }

    getProductsOrReason = () => {

        if (this.state.isLoading) {
            return (
                <div className="d-flex justify-content-center justify-content-middle">
                    <div className="d-flex">
                        <span className="text-muted fw-bold">Loading...</span>
                    </div>
                </div>);
        }

        if (this.state.fetchFailed) {
            return (
                <div className="d-flex justify-content-center justify-content-middle">
                    <div className="d-flex">
                        <span className="text-muted fw-bold">Something went wrong!</span>
                    </div>
                </div>);
        }


        if (!this.state.products || this.state.products.length === 0) {
            return (
                <div className="d-flex justify-content-center justify-content-middle">
                    <div className="d-flex">
                        <span className="text-muted fw-bold">No products found!</span>
                    </div>
                </div>
            );
        }

        return (

            <div className="row">
                {
                    this.state.products.map((product) => (
                        <Product product={product} key={product.id} loggedIn={this.props.loggedIn} updateProductList={this.updateProductList} />
                    ))
                }
            </div>
        )
    }


    getPagination = () => {

        // No render if no products found
        if (!this.state.products || this.state.products.length === 0) {
            return null;
        }


        const disablePrevious = this.state.activePage === 1;
        const disableNext = this.state.activePage === this.state.totalPages;

        const pageLimit = Math.min(5, this.state.totalPages);
        let startPageNo = 1;

        if (this.state.activePage - (Number.parseInt(pageLimit / 2)) <= 0) {
            startPageNo = 1;
        } else if (this.state.activePage + (Number.parseInt(pageLimit / 2)) >= this.state.totalPages) {
            startPageNo = this.state.totalPages - (pageLimit - 1);
        } else {
            startPageNo = this.state.activePage - (Number.parseInt(pageLimit / 2));
        }

        const pageButtons = [];
        for (let i = startPageNo; i < (startPageNo + pageLimit); i++) {
            pageButtons.push(
                <li className={this.state.activePage === i ? "page-item active" : "page-item"} key={i}>
                    <div className="page-link" value={i} onClick={this.onClickPagination}>
                        {i}
                    </div>
                </li>
            )
        }

        return (
            // <nav className="float-end mt-4" aria-label="Page navigation">
            <ul className="pagination">
                <li id="previous" className={disablePrevious ? "page-item disabled" : "page-item"}>
                    <div className="page-link" value={"previous"} onClick={this.onClickPagination}> Previous </div>
                </li>
                {pageButtons}
                <li id="next" className={disableNext ? "page-item disabled" : "page-item"}>
                    <div className="page-link" value={"next"} onClick={this.onClickPagination}> Next </div>
                </li>
            </ul>
            // </nav >
        )
    }

    showFilterModal = () => {
        this.setState({ showFilterModal: true });
    }

    closeFilerModal = () => {
        this.setState({ showFilterModal: false });
    }

    getFilterModal = () => {
        if (!this.state.showFilterModal) {
            return null;
        }

        return (
            <>
                <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Modal title</h5>
                                <button type="button" className="close" onClick={this.closeFilerModal} aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="container">
                                    <div className="row p-3">
                                        <div className="col">
                                            <div className="row">
                                                <div className="fw-bold fs-5">Brand</div>
                                            </div>
                                            <div className="row p-3">
                                                {
                                                    this.brands.map(brand => {
                                                        return (
                                                            <div className="row" key={brand}>
                                                                <div className="form-check">
                                                                    <input className="form-check-input brand-value" defaultChecked={
                                                                        (this.state.filterBy && this.state.filterBy.brands) ?
                                                                            this.state.filterBy.brands.includes(brand) :
                                                                            false
                                                                    } type="checkbox" data-value={brand} id={`id-${brand}`} />
                                                                    <label className="form-check-label" htmlFor={`id-${brand}`}>
                                                                        {brand}
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>

                                        </div>
                                        <div className="col">
                                            <div className="row">
                                                <div className="fw-bold fs-5">Mobile Color</div>
                                            </div>
                                            <div className="row p-3">
                                                {
                                                    this.colors.map(color => {
                                                        return (
                                                            <div className="row" key={color}>
                                                                <div className="form-check">
                                                                    <input className="form-check-input color-value"
                                                                        type="checkbox"
                                                                        defaultChecked={
                                                                            (this.state.filterBy && this.state.filterBy.colors) ?
                                                                                this.state.filterBy.colors.includes(color) :
                                                                                false
                                                                        } data-value={color} id={`color-id-${color}`} />
                                                                    <label className="form-check-label" htmlFor={`color-id-${color}`}>
                                                                        {color}
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={this.onFilterUpdate}>Apply</button>
                                <button type="button" className="btn btn-secondary" onClick={this.closeFilerModal}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal-backdrop fade show"></div>
            </>

        )

    }


    render = () => {
        return (
            <section className="content-main">
                <div className="card mb-4 shadow-sm">
                    <header className="card-header bg-white ">
                        <div className="row">
                            <div className="col-md-4">
                                <input
                                    type="search"
                                    placeholder="Search..."
                                    className="form-control p-2"
                                    onChange={this.onSearch}
                                />
                            </div>
                            <div className="col-md-4">
                                <div className="row">
                                    <div className="col-md-2">
                                        <button type="button" className="btn btn-outline-primary" onClick={this.showFilterModal}>
                                            <FunnelFill />
                                        </button>

                                    </div>
                                    <div className="col">
                                        <div className="input-group mb-3">
                                            <label className="input-group-text" htmlFor="inputGroupSelect01">Sort By</label>
                                            <select className="form-select" id="inputGroupSelect01" defaultValue={this.state.sortBy} onChange={this.onSort}>
                                                <option value="none">None</option>
                                                <option value="price-low-to-high">Price: low to high</option>
                                                <option value="price-high-to-low">Price: high to low</option>
                                                <option value="rating">Most Rated</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                {this.getPagination()}
                            </div>
                        </div>

                    </header>
                    <div className="card-body">
                        {this.getProductsOrReason()}

                    </div>
                </div>
                {this.getFilterModal()}
            </section>
        )
    }
}



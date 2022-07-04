import React from 'react';

import { Link } from "react-router-dom";

import Spinner from '../../components/spinner/Spinner';

import Utils from '../../utils/utils';

import './styles.css';

import APIProxy from "../../proxy/api-proxy";


export default class LandingSection extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            activeIndex: 0,
            isLoading: true,
            isFailed: false,
            carouselList: []
        }
    }

    componentDidMount = async () => {
        try {
            const carouselList = await APIProxy.getCarouselList();
            this.setState({ carouselList, isLoading: false });
        } catch (err) {
            console.error("Failed to get carousel items...", err);
            this.setState({ isLoading: false, isFailed: true });
        }
    }

    getCarousel = () => {

        if (!this.state.carouselList || this.state.carouselList.length === 0) {
            return (<h2 className='muted-text'> No Carousel Found! </h2>);
        }

        return (
            <div id="carouselBasicExample" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                    {
                        this.state.carouselList.map((carouselId, index) => {
                            return (
                                <div key={carouselId} className={index === this.state.activeIndex ? "carousel-item active" : "carousel-item"}>
                                    <img className="d-block img-obj-fit" src={Utils.getURL(`/carousel/image/${carouselId}`)} />
                                    <div className="overlay"></div>
                                    <div className="carousel-caption d-none d-md-block">
                                        <h3>New Experience Great Price</h3>
                                        <p>
                                            We Offer Latest Launches of Premium mobiles....
                                        </p>
                                        <Link to="/queen-mobiles/products" style={{ textDecoration: "none", color: "#ffffff" }}>
                                            <button type="button" className="btn btn-success">
                                                Shop Now
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <a className="carousel-control-prev" type="button" data-bs-target="#carouselBasicExample" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </a>
                <a className="carousel-control-next" data-bs-target="#carouselBasicExample" type="button" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </a>
            </div>
        )
    }


    render = () => {
        return (
            <div className='container'>
                <div className='row'>
                    {(this.state.isLoading || this.state.isFailed) ? <Spinner /> : this.getCarousel()}
                </div>
                <div className='row'>
                    <div className='col mx-auto'></div>
                    <blockquote className="blockquote text-center">
                        <p className="mb-4">
                            We strive to be a sustainable company that contributes to a
                            better world to connect people with their loved ones.
                        </p>
                        <footer className="blockquote-footer">
                            Someone famous in <cite title="Source Title">Source Title</cite>
                        </footer>
                    </blockquote>
                </div>
            </div>
        );
    };
}

import React from "react";
import NavigateBeforeTwoToneIcon from "@material-ui/icons/NavigateBeforeTwoTone";
import NavigateNextTwoToneIcon from "@material-ui/icons/NavigateNextTwoTone";
import { fetchPopulars } from "../store/actions/popularActions";
import { connect } from "react-redux";
import Loading from "../components/Loading";

class RecipeCarousel extends React.Component {

    // When mounts the view, fetches the first 12 popular elements from Itinerary
    componentDidMount() {
        this.props.dispatch(fetchPopulars());
    }

    // Function to create 3 sub arrays of 4 elements for the Carousel 
    splitIntoSubArray = (arr, count) => {
        let newArray = [];
        while (arr.length > 0) {
            newArray.push(arr.splice(0, count));
        }
        return newArray;
    }

    render() {
        const { error, loading, items } = this.props;
        let carouselBlocks = this.splitIntoSubArray(items, 4);
        if (error) {
            return <div>Error! {error.message}</div>;
        }
        if (loading) {
            return <Loading />
        }
        return (
            <div>
                <div
                    id="carousel-with-lb"
                    className="carousel slide carousel-multi-item"
                    data-ride="carousel"
                    data-interval="3000"
                    touch="true"
                    pause="false">
                    <h2 className="padding17">Popular MYtineraries</h2>
                    <div className="carousel-inner mdb-lightbox" role="listbox">
                        {carouselBlocks.map((subArray, i) => {
                            return i === 0 ? (<div key={i} className="carousel-item active text-center">
                                {subArray.map((citta, f) => {
                                    return (
                                        <figure key={f} className="col-md-6 d-md-inline-block">
                                            <img
                                                src={citta.url}
                                                className="img-fluid"
                                                alt={citta.name}
                                            />
                                        </figure>
                                    )
                                })}
                            </div>)
                                : (<div key={i} className="carousel-item text-center">
                                    {subArray.map((citta, f) => {
                                        return (
                                            <figure key={f} className="col-md-6 d-md-inline-block">
                                                <img
                                                    src={citta.url}
                                                    className="img-fluid"
                                                    alt={citta.name}
                                                />
                                            </figure>
                                        )
                                    })}
                                </div>)
                        })}
                    </div>
                    <div className="controls-row">
                        <div>
                            <a href="#carousel-with-lb" data-slide="prev">
                                <NavigateBeforeTwoToneIcon className="controls" />
                            </a>
                        </div>
                        <ol className="carousel-indicators">
                            <li
                                data-target="#carousel-with-lb"
                                data-slide-to="0"
                                className="active secondary-color"
                            ></li>
                            <li
                                data-target="#carousel-with-lb"
                                data-slide-to="1"
                                className="secondary-color"
                            ></li>
                            <li
                                data-target="#carousel-with-lb"
                                data-slide-to="2"
                                className="secondary-color"
                            ></li>
                        </ol>
                        <div>
                            <a href="#carousel-with-lb" data-slide="next">
                                <NavigateNextTwoToneIcon className="controls" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    items: state.populars.items,
    loading: state.populars.loading,
    error: state.populars.error
});

export default connect(mapStateToProps)(RecipeCarousel);

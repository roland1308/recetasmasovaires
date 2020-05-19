import React from "react";
import { connect } from "react-redux";

class RecipeCarousel extends React.Component {

    render() {
        const { picsForCarousel, nameForCarousel } = this.props
        return (
            <div id="carouselWithIndicators" className="carousel slide carousel-fade" data-ride="carousel" data-interval="2000">
                <ol className="carousel-indicators">
                    {picsForCarousel.length < 1 ? null : picsForCarousel.map((pic, i) => {
                        return (i === 0 ?
                            <li data-target="#carouselWithIndicators" data-slide-to="0" className="active" key={i}></li>
                            :
                            <li data-target="#carouselWithIndicators" data-slide-to={i} key={i}></li>
                        )
                    })}
                </ol>
                <div className="carousel-inner">
                    {picsForCarousel.length < 1 ? null : picsForCarousel.map((pic, i) => {
                        return (i === 0 ?
                            <div className="carousel-item active" key={i}>
                                <img src={pic.src} className="d-block w-100" alt={nameForCarousel[i]} />
                                <div className="carousel-caption">
                                    <h5 className="textCaption">{nameForCarousel[i]}</h5>
                                </div>
                            </div>
                            :
                            <div className="carousel-item" key={i}>
                                <img src={pic.src} className="d-block w-100" alt={nameForCarousel[i]} />
                                <div className="carousel-caption">
                                    <h5 className="textCaption">{nameForCarousel[i]}</h5>
                                </div>
                            </div>
                        )
                    })}
                </div>
                {picsForCarousel.length < 1 ? null :
                    <div>
                        <a className="carousel-control-prev" href="#carouselWithIndicators" role="button" data-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="sr-only">Previous</span>
                        </a>
                        <a className="carousel-control-next" href="#carouselWithIndicators" role="button" data-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="sr-only">Next</span>
                        </a>
                    </div>
                }
            </div>
        );
    }
}

const mapStateToProps = state => ({
    recipes: state.main.recipes
});

export default connect(mapStateToProps)(RecipeCarousel);

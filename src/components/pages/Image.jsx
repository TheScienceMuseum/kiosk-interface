import React from 'react';
// import PropTypes from 'prop-types';

/*
 * Image.jsx:
 *
 *
 * @author Gavin Cockrem <gavin@joipolloi.com.
 * @package sciencemuseum-kiosk-interface
 */


class Image extends React.Component {
    constructor(props) {
        super(props);
        this.state = { imageZoomed: false };
        this.handleToggleZoom = this.handleToggleZoom.bind(this);
    }

    handleToggleZoom() {
        let { imageZoomed } = this.state;
        imageZoomed = !imageZoomed;
        this.setState({ imageZoomed });
    }

    render() {
        const { title, content, image } = this.props;
        const { imageZoomed } = this.state;

        const zoomed = imageZoomed ? 'zoomedIn' : 'zoomedOut';

        return (
            <div className="Page PageImage">
                <div className={`ImageContainer ImageContainer--${zoomed}`}>
                    <img src={image.imageSource} alt="" />
                    <button
                        className={`Button ImageContainer__ZoomButton`}
                        type="button"
                        onClick={this.handleToggleZoom}
                    >
                        Zoom In/Out
                    </button>
                </div>
                <div className="ContentContainer">
                    <h2>{title}</h2>
                    <p>{content}</p>
                    <div className="ImageCaption">
                        <h3>{image.nameText}</h3>
                        <p>{image.sourceText}</p>
                    </div>
                </div>
            </div>
        );
    }
}

Image.propTypes = {

};

export default Image;

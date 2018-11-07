import React from 'react';
import PropTypes from 'prop-types';

import '../../styles/pages/Image.scss';

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
        this.state = {
            imageZoomed: false,
            zoomLevel: 0,
        };

        this.image = null;
    }

    componentDidMount() {
        // get images dimension
    }

    onImageLoaded() {
        console.log('Image: onImageLoaded: image: ', this.image);
        console.log('Image: onImageLoaded: image.width: ', this.image.width);
        console.log('Image: onImageLoaded: image.offsetWidth: ', this.image.offsetWidth);
        console.log('Image: onImageLoaded: image.naturalWidth: ', this.image.naturalWidth);
    }

    handleToggleZoom() {
        let { imageZoomed } = this.state;
        imageZoomed = !imageZoomed;
        this.setState({ imageZoomed });
    }

    handleZoomIn() {
        let { zoomLevel } = this.state;
        if (zoomLevel === 1) return;
        zoomLevel += 0.1;
        this.setState({ zoomLevel });
    }

    handleZoomOut() {
        let { zoomLevel } = this.state;
        if (zoomLevel === 0) return;
        zoomLevel -= 0.1;
        this.setState({ zoomLevel });
    }

    render() {
        const { title, content, image } = this.props;
        const { imageZoomed } = this.state;

        const zoomed = imageZoomed ? 'zoomedIn' : 'zoomedOut';

        return (
            <div className="Page PageImage">
                <div className={`ImageContainer ImageContainer--${zoomed}`}>
                    <img
                        src={image.imageSource}
                        alt=""
                        ref={ref => { this.image = ref; }}
                        onLoad={this.onImageLoaded.bind(this)}
                    />
                    <button
                        className="Button ImageContainer__ZoomButton"
                        type="button"
                        onClick={this.handleToggleZoom.bind(this)}
                    >
                        Zoom In/Out
                    </button>
                    <div className="ImageContainer__ZoomControls">
                        <button
                            className="Button ImageContainer__ZoomInButton"
                            type="button"
                            onClick={this.handleZoomIn.bind(this)}
                        >
                        Zoom Out
                        </button>
                        <button
                            className="Button ImageContainer__ZoomOutButton"
                            type="button"
                            onClick={this.handleZoomOut.bind(this)}
                        >
                        Zoom In
                        </button>
                    </div>
                </div>
                <div className={`ContentContainer ContentContainer--${zoomed}`}>
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
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    image: PropTypes.shape({
        imageSource: PropTypes.string.isRequired,
        imageThumbnail: PropTypes.string.isRequired,
        imagePortrait: PropTypes.string.isRequired,
        imageLandscape: PropTypes.string.isRequired,
        nameText: PropTypes.string.isRequired,
        sourceText: PropTypes.string.isRequired,
    }).isRequired,
};

export default Image;

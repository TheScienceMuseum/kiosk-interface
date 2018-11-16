import React from 'react';
import PropTypes from 'prop-types';
import Hammer from 'react-hammerjs';
import HammerJS from 'hammerjs';
import {PinchView} from 'react-pinch-zoom-pan'

import '../styles/ZoomableImage.scss';

import { Orientations, ScreenSize } from '../Constants';


/*
 * ZoomableImage:
 *
 * @author Gavin Cockrem <gavin@joipolloi.com.
 * @package sciencemuseum-kiosk-interface
 */

class ZoomableImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imageZoomed: false,
            imageZoomable: false,
            imageScale: 1,
            imageOrientation: null,
        };


        this.image = null;
        this.debugText = null;
        this.imageMinScale = 0;

        this.handlePinch = this.handlePinch.bind(this);
        this.handlePinchIn = this.handlePinchIn.bind(this);
        this.handlePinchOut = this.handlePinchOut.bind(this);
        this.handlePinchStart = this.handlePinchStart.bind(this);
        this.handlePinchEnd = this.handlePinchEnd.bind(this);

        this.handlePan = this.handlePan.bind(this);
        this.handleDoubleTap = this.handleDoubleTap.bind(this);
    }

    onImageLoaded() {
        console.log('Image: onImageLoaded: image: ', this.image);
        console.log('Image: onImageLoaded: image.width: ', this.image.width);
        console.log('Image: onImageLoaded: image.width: ', this.image.height);
        console.log('Image: onImageLoaded: image.offsetWidth: ', this.image.offsetWidth);
        console.log('Image: onImageLoaded: image.naturalWidth: ', this.image.offsetHeight);
        const { offsetWidth, offsetHeight } = this.image;

        const imageRatio = offsetWidth / offsetHeight;
        const screenRatio = ScreenSize.width / ScreenSize.height;

        let imageOrientation;

        if (imageRatio > screenRatio) {
            imageOrientation = Orientations.HORIZONTAL;
        } else if (imageRatio < screenRatio) {
            imageOrientation = Orientations.VERTICAL;
        } else {
            imageOrientation = Orientations.EXACT;
        }

        let imageZoomable = false;
        const imageScale = this.getImageScale(false, imageOrientation);
        this.imageMinScale = this.getImageScale(true, imageOrientation);

        console.log('Image: onImageLoaded: imageScale: ', imageScale);
        console.log('Image: onImageLoaded: this.imageMinScale: ', this.imageMinScale);
        console.log('Image: onImageLoaded: screenRatio: ', screenRatio);
        /*
        if ((offsetWidth / 1.5 > ScreenSize.width) || (offsetHeight / 1.5 > ScreenSize.height)) {
            imageZoomable = true;
        }
        */

        if (this.imageMinScale < 1) {
            imageZoomable = true;
        }


        this.setState({ imageZoomable, imageScale, imageOrientation });

        // this.initialZoom = offsetWidth
        // this.image.style = `transform: scale(${imageScale}`;
    }

    getImageScale(zoomed, orientation) {
        let imageScale = 1;
        // const { imageOrientation } = this.state;
        const { offsetWidth, offsetHeight } = this.image;

        console.log('ZoomableImage: getImageScale: zoomed: ', zoomed);
        console.log('ZoomableImage: getImageScale: imageOrientation: ', orientation);
        /*
        if (zoomed) {
            if (orientation === Orientations.VERTICAL) {
                imageScale = ScreenSize.height / offsetHeight;
            } else {
                imageScale = ScreenSize.width / offsetWidth;
            }
        } else {
            if (orientation === Orientations.VERTICAL) {
                imageScale = ScreenSize.width / offsetWidth;
            } else {
                imageScale = ScreenSize.height / offsetHeight;

            }
        }
        */

        if ((zoomed && (orientation === Orientations.VERTICAL))
            || (!zoomed && (orientation === Orientations.HORIZONTAL))) {
            imageScale = ScreenSize.height / offsetHeight;
        } else {
            imageScale = ScreenSize.width / offsetWidth;
        }


        return imageScale;
    }

    handleToggleZoom() {
        let { imageZoomed } = this.state;
        const { imageOrientation } = this.state;
        const { onZoom } = this.props;

        imageZoomed = !imageZoomed;
        onZoom(imageZoomed);

        const imageScale = this.getImageScale(imageZoomed, imageOrientation);

        this.setState({ imageZoomed, imageScale });
    }


    handleZoomIn() {
        let { imageScale } = this.state;
        imageScale = Math.min(imageScale += 0.1, 1);
        if (imageScale === 1) return;
        this.setState({ imageScale });
    }

    handleZoomOut() {
        let { imageScale } = this.state;
        imageScale = Math.max(imageScale -= 0.1, this.imageMinScale);
        if (imageScale === this.imageMinScale) return;
        // imageScale -= 0.1;
        this.setState({ imageScale });
    }

    handlePinchIn(e) {
        const { imageZoomed } = this.state;
        if (!imageZoomed) return;
        console.log('Image: handlePinch: e: ', e.distance);
        let { imageScale } = this.state;

        imageScale *= 1000;
        imageScale -= e.distance;
        imageScale /= 1000;

        this.setState({ imageScale });
    }

    handlePinchOut(e) {
        const { imageZoomed } = this.state;
        if (!imageZoomed) return;
        console.log('Image: handlePinch: e: ', e.distance);
        let { imageScale } = this.state;

        imageScale *= 1000;
        imageScale += e.distance;
        imageScale /= 1000;

        this.setState({ imageScale });
    }

    handlePinchStart(e) {
        const { imageScale } = this.state;
        this.initialScale = imageScale;
    }

    handlePinchEnd(e) {

    }

    handlePinch(e) {
        const { imageZoomed } = this.state;
        if (!imageZoomed) return;
        // console.log('Image: handlePinch: e: ', e);
        console.log('Image: handlePinch: e: ', e);

        let { imageScale } = this.state;

        this.debugText.value = `
        Direction:    ${e.direction}
        Distance:    ${e.distance}
        Scale:    ${e.scale}
        initialScale:    ${this.initialScale}
        New Scale:   ${imageScale}
        `;

        imageScale = Math.min(Math.max(this.initialScale * e.scale, this.imageMinScale), 1);

        // console.log(`Image: handlePinch: distance: ${e.distance} imageScale: ${imageScale}`);
        this.setState({ imageScale });
    }

    handlePan(e) {
        const { imageZoomed } = this.state;
        if (!imageZoomed) return;
        // console.log('Image: handlePan: e: ', e);

        // TODO: constrain image to box
    }

    handleDoubleTap(e) {
        if (e.tapCount < 2) return;
        // console.log('Image: handleDoubleTap: e: ', e);
        this.handleToggleZoom();
    }

    render() {
        const { imageZoomed, imageZoomable, imageScale } = this.state;
        const { image } = this.props;

        const zoomed = imageZoomed ? 'zoomedIn' : 'zoomedOut';
        /*
        let transform;
        let top;
        let left;

        if (imageOrientation === Orientations.VERTICAL) {
            transform = 'translateY';
            left = '50%';
            top = '0';
        } else {
            transform = 'translateX';
            left = '0';
            top = '-50%';
        }
        */

        const style = {
            transform: `scale(${imageScale}) translate(-50%, -50%)`,
        };

        return (
            <div className={`ZoomableImage ZoomableImage--${zoomed}`}>
                <Hammer
                    // onPinchIn={this.handlePinchIn}
                    // onPinchOut={this.handlePinchOut}
                    onPinch={this.handlePinch}
                    onPinchStart={this.handlePinchStart}
                    onPinchEnd={this.handlePinchEnd}
                    onPan={this.handlePan}
                    onTap={this.handleDoubleTap}
                    options={{
                        recognizers: {
                            pinch: { enable: true },
                        },
                    }}
                >
                    <div>
                        <img
                            src={image.imageSource}
                            alt=""
                            ref={ref => { this.image = ref; }}
                            onLoad={this.onImageLoaded.bind(this)}
                            style={style}
                        />
                    </div>
                </Hammer>

                <button
                    className="Button ZoomableImage__ZoomButton"
                    type="button"
                    onClick={this.handleToggleZoom.bind(this)}
                >
                        Zoom In/Out
                </button>

                <textarea className="ZoomableImage__Debug" ref={ref => { this.debugText = ref; }} />

                {imageZoomable
                && (
                    <div className="ZoomableImage__ZoomControls">
                        <button
                            className="Button ZoomableImage__ZoomInButton"
                            type="button"
                            onClick={this.handleZoomIn.bind(this)}
                        >
                            Zoom Out
                        </button>
                        <button
                            className="Button ZoomableImage__ZoomOutButton"
                            type="button"
                            onClick={this.handleZoomOut.bind(this)}
                        >
                            Zoom In
                        </button>
                    </div>
                )
                }
            </div>
        );
    }
}

ZoomableImage.propTypes = {
    image: PropTypes.shape({
        imageSource: PropTypes.string.isRequired,
        imageThumbnail: PropTypes.string.isRequired,
        imagePortrait: PropTypes.string.isRequired,
        imageLandscape: PropTypes.string.isRequired,
        nameText: PropTypes.string.isRequired,
        sourceText: PropTypes.string.isRequired,
    }).isRequired,
    onZoom: PropTypes.func.isRequired,
};

export default ZoomableImage;

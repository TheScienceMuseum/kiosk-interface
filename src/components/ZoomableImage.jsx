import React from 'react';
import PropTypes from 'prop-types';
import Hammer from 'react-hammerjs';

import '../styles/components/ZoomableImage.scss';
import { Orientations, ScreenSize } from '../Constants';
import ZoomControls from './ZoomControls';
import propTypes from '../propTypes';

/*
 * NewZoomableImage:
 *
 * @author Gavin Cockrem <gavin@joipolloi.com.
 * @package sciencemuseum-kiosk-interface
 */

class ZoomableImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            width: null,
            height: null,
            x: null,
            y: null,
            zoomable: false,
            fullscreen: false,
        };

        // console.log('ZoomableImage: constructor');

        // this.MIN_SCALE = 1; // 1=scaling when first loaded
        this.imageMaxScale = 1;

        this.imageOrientation = null;

        this.image = null;
        this.imgWidth = null;
        this.imgHeight = null;
        this.viewportWidth = null;
        this.viewportHeight = null;
        this.scale = null;
        this.lastScale = null;
        this.container = null;
        // this.img = null;
        this.x = 0;
        this.y = 0;
        this.lastX = 0;
        this.lastY = 0;
        this.pinchCenter = null;


        this.handleImageLoad = this.handleImageLoad.bind(this);

        this.handlePinch = this.handlePinch.bind(this);
        this.handlePinchEnd = this.handlePinchEnd.bind(this);
        this.handlePan = this.handlePan.bind(this);
        this.handlePanEnd = this.handlePanEnd.bind(this);
        this.handleDoubleTap = this.handleDoubleTap.bind(this);

        this.handleZoomIn = this.handleZoomIn.bind(this);
        this.handleZoomOut = this.handleZoomOut.bind(this);
        this.handleZoomChange = this.handleZoomChange.bind(this);

        this.handleToggleFullScreen = this.handleToggleFullScreen.bind(this);
    }

    componentDidMount() {
        // console.log('ZoomableImage: componentDidMount: parent: ', this.container.parentElement);
        const { offsetWidth, offsetHeight } = this.container;

        this.initialWidth = offsetWidth;
        this.initialHeight = offsetHeight;

        this.viewportWidth = this.initialWidth;
        this.viewportHeight = this.initialHeight;

        // console.log('ZoomableImage: componentDidMount: offsetWidth: ', offsetWidth);
        // console.log('ZoomableImage: componentDidMount: offsetHeight: ', offsetHeight);
    }

    componentDidUpdate(prevProps, prevState) {
        // const { offsetWidth, offsetHeight } = this.container;
        const { fullscreen } = this.state;

        if (fullscreen !== prevState.fullscreen) {
            // console.log('ZoomableImage: componentDidUpdate: change in fullscreen');
            this.viewportWidth = (fullscreen) ? ScreenSize.width : this.initialWidth;
            this.viewportHeight = (fullscreen) ? ScreenSize.height : this.initialHeight;
            const imageScale = (fullscreen) ? this.imageMinScale : this.initialScale;

            // console.log('ZoomableImage: didUpdate: imageScale: ', imageScale);
            // console.log('ZoomableImage: didUpdate: viewportHeight: ', this.viewportHeight);

            // this.handleImageLoad();
            this.calculateImageRatios();
            this.zoomToScale(imageScale);
        }

        this.debugValues();
    }

    getImageScale(zoomed, orientation) {
        let imageScale = 1;
        // const { offsetWidth, offsetHeight } = this.image;

        if ((zoomed && (orientation === Orientations.VERTICAL))
            || (!zoomed && (orientation === Orientations.HORIZONTAL))) {
            imageScale = this.viewportHeight / this.imgHeight;
        } else {
            imageScale = this.viewportWidth / this.imgWidth;
        }
        return imageScale;
    }

    debugValues() {
        const {
            width, height, x, y, fullscreen,
        } = this.state;

        this.debugText.value = `
        width:              ${width}
        height:             ${height}
        x:                  ${x}
        y:                  ${y}

        this.scale:         ${this.scale}
        this.lastScale:     ${this.lastScale}

        fullscreen:         ${fullscreen}

        viewportWidth:      ${this.viewportWidth}
        viewportHeight:     ${this.viewportHeight}

        imageMinZoom:       ${this.imageMinScale}
        imageMaxScale:      ${this.imageMaxScale}
        imageOrientation:   ${this.imageOrientation}
        `;
    }

    /*
    absolutePosition(el) {
        const x = 0;
        const y = 0;
        while (el !== null) {
            x += el.offsetLeft;
            y += el.offsetTop;
            el = el.offsetParent;
        }
        return { x, y };
    }
    */

    restrictScale(scale) {
        let newScale = scale;
        if (scale < this.imageMinScale) {
            newScale = this.imageMinScale;
        } else if (scale > this.imageMaxScale) {
            newScale = this.imageMaxScale;
        }
        return newScale;
    }

    restrictRawPos(pos, viewportDim, imgDim) {
        let newPos = pos;
        if (pos < viewportDim / this.scale - imgDim) { // too far left/up?
            newPos = viewportDim / this.scale - imgDim;
        } else if (pos > 0) { // too far right/down?
            newPos = 0;
        }
        return newPos;
    }

    updateLastPos() {
        this.lastX = this.x;
        this.lastY = this.y;
    }

    updateLastScale() {
        this.lastScale = this.scale;
    }

    translate(deltaX, deltaY) {
        // console.log('ZoomableImage: translate: deltaX: ', deltaX);
        // console.log('ZoomableImage: translate: deltaY: ', deltaY);

        // We restrict to the min of the viewport width/height or current width/height as the
        // current width/height may be smaller than the viewport width/height

        // TODO: centre if image is smaller then dimension
        let newX = this.restrictRawPos(this.lastX + deltaX / this.scale,
            Math.min(this.viewportWidth, this.curWidth), this.imgWidth);

        let newY = this.restrictRawPos(this.lastY + deltaY / this.scale,
            Math.min(this.viewportHeight, this.curHeight), this.imgHeight);

        // console.log('ZoomableImage: translate: newX: ', newX);
        // console.log('ZoomableImage: translate: newY: ', newY);
        //
        // console.log('ZoomableImage: translate: this.imgWidth: ', this.imgWidth);
        // console.log('ZoomableImage: translate: this.imgHeight: ', this.imgHeight);
        // console.log('ZoomableImage: translate: this.curWidth: ', this.curWidth);
        // console.log('ZoomableImage: translate: this.curHeight: ', this.curHeight);
        // console.log('ZoomableImage: translate: this.viewportWidth: ', this.viewportWidth);
        // console.log('ZoomableImage: translate: this.viewportHeight: ', this.viewportHeight);

        if (this.curWidth < this.viewportWidth) {
        // console.log('ZoomableImage: recalculate x');
            newX += ((this.viewportWidth - this.curWidth) / 2) / this.scale;
        } else if (this.curHeight < this.viewportHeight) {
            newY += ((this.viewportHeight - this.curHeight) / 2) / this.scale;
        }

        // console.log('ZoomableImage: translate: newX: ', newX);
        // console.log('ZoomableImage: translate: newY: ', newY);

        this.x = newX;
        this.y = newY;

        this.setState({
            x: Math.ceil(newX * this.scale),
            y: Math.ceil(newY * this.scale),
        }, this.debugValues);
    }

    zoom(scaleBy) {
        // console.log('ZoomableImage: zoom: scaleBy: ', scaleBy);
        // console.log('ZoomableImage: zoom: this.scale: ', this.scale);
        // console.log('ZoomableImage: zoom: this.lastScale: ', this.lastScale);

        this.scale = this.restrictScale(this.lastScale * scaleBy);

        // this.scale = Math.round(this.scale * 10) / 10;

        this.curWidth = Math.ceil(this.imgWidth * this.scale);
        this.curHeight = Math.ceil(this.imgHeight * this.scale);

        // console.log('ZoomableImage: zoom: this.scale: ', this.scale);

        // img.style.width = Math.ceil(curWidth) + 'px';
        // img.style.height = Math.ceil(curHeight) + 'px';

        this.setState({ width: this.curWidth, height: this.curHeight }, this.debugValues);

        // Adjust margins to make sure that we aren't out of bounds
        // console.log('ZoomableImage: zoom:');
        this.translate(0, 0);
    }

    rawCenter(e) {
        // const pos = this.absolutePosition(this.container);

        // We need to account for the scroll position
        // const scrollLeft = window.pageXOffset ? window.pageXOffset : document.body.scrollLeft;
        // const scrollTop = window.pageYOffset ? window.pageYOffset : document.body.scrollTop;
        // const scrollLeft = 0;
        // const scrollTop = 0;

        const zoomX = -this.x + (e.center.x/* - pos.x + scrollLeft */) / this.scale;
        const zoomY = -this.y + (e.center.y/* - pos.y + scrollTop */) / this.scale;

        return { x: zoomX, y: zoomY };
    }


    zoomAround(scaleBy, rawZoomX, rawZoomY, doNotUpdateLast) {
        // Zoom
        this.zoom(scaleBy);

        // New raw center of viewport
        const rawCenterX = -this.x + Math.min(this.viewportWidth, this.curWidth) / 2 / this.scale;
        const rawCenterY = -this.y + Math.min(this.viewportHeight, this.curHeight) / 2 / this.scale;

        console.log('ZoomableImage: zoomAround: rawZoomX, rawZoomY: ', rawZoomX, rawZoomY);
        console.log('ZoomableImage: zoomAround: rawCenterX, rawCenterY: ', rawCenterX, rawCenterY);

        // Delta
        const deltaX = (rawCenterX - rawZoomX) * this.scale;
        const deltaY = (rawCenterY - rawZoomY) * this.scale;

        console.log('ZoomableImage: zoomAround: deltaX, deltaY: ', deltaX, deltaY);

        // Translate back to zoom center
        // console.log('ZoomableImage: zoomAround:');
        this.translate(deltaX, deltaY);

        if (!doNotUpdateLast) {
            this.updateLastScale();
            this.updateLastPos();
        }
    }

    zoomCenter(scaleBy) {
        // Center of viewport
        // if (scaleTo === this.scale) return;

        // console.log('ZoomableImage: zoomCenter: scaleBy: ', scaleBy);
        // console.log('ZoomableImage: zoomCenter: this.scale: ', this.scale);

        // const scaleBy = scaleTo / this.scale;

        // const zoomX = (-this.x + Math.min(this.viewportWidth, this.curWidth)) / 2 / this.scale;
        // const zoomY = (-this.y + Math.min(this.viewportHeight, this.curHeight)) / 2 / this.scale;
        const zoomX = (-this.x + this.curWidth / this.scale) / 2;
        const zoomY = (-this.y + this.curHeight / this.scale) / 2;

        console.log('ZoomableImage: zoomCenter: zoomX, zoomY: ', zoomX, zoomY);

        this.zoomAround(scaleBy, zoomX, zoomY);
    }

    zoomToScale(scaleTo) {
        const scaleBy = scaleTo / this.scale;
        // scaleBy = Math.round(scaleBy * 10) / 10;
        // this.zoom(scaleBy);
        this.zoomCenter(scaleBy);
    }

    handleZoomChange(e) {
        // console.log('ZoomableImage: setZoom: e: ', e);
        // console.log('ZoomableImage: setZoom: target', e.target);
        // console.log('ZoomableImage: setZoom: value', e.target.value);
        this.zoomToScale(e.target.value);
    }

    handleZoomIn() {
        const imageScale = Math.min(this.scale + 0.1, 1);
        // imageScale = Math.round(imageScale * 10) / 10;
        this.zoomToScale(imageScale);
        // this.zoomCenter(1.1);
    }

    handleZoomOut() {
        const imageScale = Math.max(this.scale - 0.1, this.imageMinScale);
        // imageScale = Math.round(imageScale * 10) / 10;
        this.zoomToScale(imageScale);
        // this.zoomCenter(0.9);
    }

    calculateImageRatios() {
        const { offsetWidth, offsetHeight } = this.image;
        const imageRatio = offsetWidth / offsetHeight;
        const screenRatio = this.viewportWidth / this.viewportHeight;

        if (imageRatio > screenRatio) {
            this.imageOrientation = Orientations.HORIZONTAL;
        } else if (imageRatio < screenRatio) {
            this.imageOrientation = Orientations.VERTICAL;
        } else {
            this.imageOrientation = Orientations.EXACT;
        }

        this.initialScale = this.getImageScale(false, this.imageOrientation);
        this.imageMinScale = this.getImageScale(true, this.imageOrientation);

        const zoomable = (this.imageMinScale < 1);

        this.setState({ zoomable });
    }

    handleImageLoad() {
        const { offsetWidth, offsetHeight } = this.image;

        // console.log('ZoomableImage: handleImageLoad');

        this.imgWidth = offsetWidth;
        this.imgHeight = offsetHeight;
        // this.viewportWidth = 1920;
        // this.viewportHeight = 1080;


        /* CALCULATE RATIOS AND SCALES */
        /*
        const imageRatio = offsetWidth / offsetHeight;
        const screenRatio = this.viewportWidth / this.viewportHeight;

        if (imageRatio > screenRatio) {
            this.imageOrientation = Orientations.HORIZONTAL;
        } else if (imageRatio < screenRatio) {
            this.imageOrientation = Orientations.VERTICAL;
        } else {
            this.imageOrientation = Orientations.EXACT;
        }


        this.initialScale = this.getImageScale(false, this.imageOrientation);
        this.imageMinScale = this.getImageScale(true, this.imageOrientation);

       */
        this.calculateImageRatios();
        /* finish calculating */

        this.scale = this.initialScale;
        this.lastScale = this.initialScale;
        this.curWidth = Math.ceil(this.imgWidth * this.scale);
        this.curHeight = Math.ceil(this.imgHeight * this.scale);

        this.x = Math.ceil((this.viewportWidth / 2) - (this.curWidth / 2));
        this.y = Math.ceil((this.viewportHeight / 2) - (this.curHeight / 2));

        this.updateLastPos();
        this.updateLastScale();


        /*
        if (this.imageMinScale < 1) {
            zoomable = true;
        }
        */

        // this.zoomCenter(this.initialScale);

        this.setState({
            width: this.curWidth,
            height: this.curHeight,
            x: this.x,
            y: this.y,
        }, this.debugValues);
    }


    handlePinch(e) {
        const { fullscreen } = this.state;
        if (!fullscreen) return;

        // We only calculate the pinch center on the first pinch event as we want the center to
        // stay consistent during the entire pinch
        let pinchCenterOffset = { x: 0, y: 0 };
        if (this.pinchCenter === null) {
            this.pinchCenter = this.rawCenter(e);
            const offsetX = this.pinchCenter.x * this.scale
                - (-this.x * this.scale
                + Math.min(this.viewportWidth, this.curWidth) / 2);
            const offsetY = this.pinchCenter.y * this.scale
                - (-this.y * this.scale
                + Math.min(this.viewportHeight, this.curHeight) / 2);
            pinchCenterOffset = { x: offsetX, y: offsetY };
        }

        // When the user pinch zooms, she/he expects the pinch center to remain in the same
        // relative location of the screen. To achieve this, the raw zoom center is calculated by
        // first storing the pinch center and the scaled offset to the current center of the
        // image. The new scale is then used to calculate the zoom center. This has the effect of
        // actually translating the zoom center on each pinch zoom event.
        const newScale = this.restrictScale(this.scale * e.scale);

        const zoomX = this.pinchCenter.x * newScale - pinchCenterOffset.x;
        const zoomY = this.pinchCenter.y * newScale - pinchCenterOffset.y;
        const zoomCenter = { x: zoomX / newScale, y: zoomY / newScale };

        this.zoomAround(e.scale, zoomCenter.x, zoomCenter.y, true);
    }

    handlePinchEnd() {
        this.updateLastScale();
        this.updateLastPos();
        this.pinchCenter = null;
    }

    handlePan(e) {
        const { fullscreen } = this.state;
        if (!fullscreen) return;
        this.translate(e.deltaX, e.deltaY);
    }

    handlePanEnd() {
        this.updateLastPos();
    }

    handleDoubleTap(e) {
        const { fullscreen } = this.state;
        if (fullscreen) {
            const c = this.rawCenter(e);
            this.zoomAround(1.1, c.x, c.y);
        } else {
            this.handleToggleFullScreen();
        }
    }

    handleToggleFullScreen() {
        let { fullscreen } = this.state;
        const { onZoom } = this.props;

        fullscreen = !fullscreen;
        onZoom(fullscreen);

        // this.translate(0, 0);
        this.setState({ fullscreen });
    }

    render() {
        const {
            width,
            height,
            x,
            y,
            zoomable,
            fullscreen,
        } = this.state;

        const { image } = this.props;
        const zoomed = fullscreen ? 'zoomedIn' : 'zoomedOut';

        const zoomIconClass = (!fullscreen) ? 'icon-enlarge-img' : 'icon-close';

        const style = {
            // transform: `scale(${imageScale})`,
            // transform: `scale(${imageScale})`,
            width: `${width}px`,
            height: `${height}px`,
            marginLeft: `${x}px`,
            marginTop: `${y}px`,
        };

        return (
            <div
                className={`ZoomableImage ZoomableImage--${zoomed}`}
                ref={(ref) => { this.container = ref; }}
            >
                <Hammer
                    onPinch={this.handlePinch}
                    onPinchEnd={this.handlePinchEnd}
                    onPan={this.handlePan}
                    onPanEnd={this.handlePanEnd}
                    onDoubleTap={this.handleDoubleTap}
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
                            ref={(ref) => { this.image = ref; }}
                            onLoad={this.handleImageLoad}
                            style={style}
                        />
                    </div>

                </Hammer>

                <button
                    className="Button Button--icon ZoomableImage__ZoomButton"
                    type="button"
                    onClick={this.handleToggleFullScreen}
                >
                    <i className={zoomIconClass} />
                </button>

                <textarea
                    className="ZoomableImage__Debug"
                    ref={(ref) => { this.debugText = ref; }}
                />

                {zoomable && fullscreen
                && (
                    <ZoomControls
                        zoomIn={this.handleZoomIn}
                        zoomOut={this.handleZoomOut}
                        imageMinZoom={this.imageMinScale}
                        imageMaxZoom={this.imageMaxScale}
                        handleZoomChange={this.handleZoomChange}
                        currentScale={this.scale}
                    />
                )
                }

            </div>
        );
    }
}

ZoomableImage.propTypes = {
    image: propTypes.image.isRequired,
    onZoom: PropTypes.func.isRequired,
};

export default ZoomableImage;

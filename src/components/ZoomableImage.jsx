import React from 'react';
import PropTypes from 'prop-types';
import Hammer from 'react-hammerjs';

import '../styles/components/ZoomableImage.scss';
import isEmpty from 'lodash.isempty';
import { Orientations, ScreenSize } from '../utils/Constants';
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
        const { image } = props;
        this.state = {
            width: null,
            height: null,
            x: null,
            y: null,
            zoomable: false,
            fullscreen: false,
            imgStyle: {
                width: '100%',
            },
            imgContainerStyle: {
                height: '100%',
            },
            fullSrc: image,
            thumbSrc: '',
            thumbWidth: 0,
            thumbHeight: 0,
            fadeOutFullscreen: false,
        };
        this.asset = props.asset;

        // console.log('ZoomableImage: constructor');

        // this.MIN_SCALE = 1; // 1=scaling when first loaded
        this.imageMaxScale = 1;
        this.imageCalculated = false;

        this.imageOrientation = null;

        this.image = null;
        this.imgWidth = null;
        this.imgHeight = null;
        this.viewportWidth = null;
        this.viewportHeight = null;
        this.scale = null;
        this.lastScale = null;
        this.container = null;
        this.x = 0;
        this.y = 0;
        this.lastX = 0;
        this.lastY = 0;
        this.pinchCenter = null;
        this.cropStyle = {
            marginTop: null,
            marginLeft: null,
        };

        this.animating = false;

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

        this.getImageStyle = this.getImageStyle.bind(this);
        this.calculateImageStyle = this.calculateImageStyle.bind(this);

        this.thumbSrc = image;
        this.fullSrc = image;
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
        const { imgStyle } = this.state;

        // console.log(this.initialHeight, this.initialScale, this.initialWidth);

        if (fullscreen !== prevState.fullscreen) {
            // console.log('ZoomableImage: componentDidUpdate: change in fullscreen');
            this.viewportWidth = (fullscreen)
                ? ScreenSize[window.appJson.aspect_ratio].width
                : this.initialWidth;
            this.viewportHeight = (fullscreen)
                ? ScreenSize[window.appJson.aspect_ratio].height
                : this.initialHeight;
            const imageScale = (fullscreen) ? this.imageMinScale : this.initialScale;

            this.image.style.marginTop = imgStyle.marginTop;
            this.image.style.marginLeft = imgStyle.marginLeft;

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

    getImageStyle() {
        const { fullscreen } = this.state;
        // console.log('getImageStyle POS');
        if (!fullscreen) {
            const { imgStyle } = this.state;
            // console.log('imgStyle: ', imgStyle);
            return {};
            // return imgStyle;
        }
        // console.log('this.state: ', this.state);

        const {
            width,
            height,
            x,
            y,
        } = this.state;

        return {
            width: `${width}px`,
            height: `${height}px`,
            x: `${x}px`,
            y: `${y}px`,
            position: 'absolute',
            marginTop: 0,
            marginLeft: 0,
            transform: 'translateX(0px) translateY(0px)',
            willChange: 'transform',
        };
    }

    getImageContainerStyle() {
        const { fullscreen } = this.state;
        if (!fullscreen) {
            const { imgContainerStyle } = this.state;
            // console.log('imgContainerStyle: ', imgContainerStyle);
            return imgContainerStyle;
        }

        const {
            width,
            height,
            transformOrigin,
            transform,
        } = this.state;

        return {
            width: `${width}px`,
            height: `${height}px`,
            transformOrigin: `${transformOrigin}`,
            transform: `scale(${transform})`,
        };
    }

    static getImagePortion(imgObj, newWidth, newHeight, startX, startY, ratio) {
        const tnCanvas = document.createElement('canvas');
        const tnCanvasContext = tnCanvas.getContext('2d');
        tnCanvas.width = newWidth; tnCanvas.height = newHeight;
        const bufferCanvas = document.createElement('canvas');
        const bufferContext = bufferCanvas.getContext('2d');
        bufferCanvas.width = imgObj.width;
        bufferCanvas.height = imgObj.height;
        bufferContext.drawImage(imgObj, 0, 0);
        tnCanvasContext.drawImage(
            bufferCanvas,
            startX,
            startY,
            newWidth * ratio,
            newHeight * ratio,
            0,
            0,
            newWidth,
            newHeight,
        );
        return tnCanvas.toDataURL();
    }

    calculateImageStyle() {
        if (this.imageCalculated) {
            return;
        }

        if (
            typeof this.asset === 'undefined'
            || typeof this.asset.boundingBox === 'undefined'
        ) {
            return;
        }
        const pixels = {
            width: (this.image.naturalWidth * this.asset.boundingBox.width),
            height: (this.image.naturalHeight * this.asset.boundingBox.height),
            x: (this.image.naturalWidth * this.asset.boundingBox.x),
            y: (this.image.naturalHeight * this.asset.boundingBox.y),
        };

        // const scale = 1; // Not actually used at the minute...

        const difference = this.container.offsetWidth - pixels.width;
        const percentage = difference / pixels.width;
        const imageContainerStyle = {
            width: `${pixels.width}px`,
            height: `${pixels.height}px`,
            transformOrigin: 'top left',
            transform: `scale(${percentage + 1})`,
        };

        let style = {};
        if (isEmpty(style)) {
            // console.log('is empty... updating style');

            // could look at removing this isEmpty function
            // as I believe it only actually runs once anyway...
            style = {
                transform: `translateX(-${pixels.x}px) translateY(-${pixels.y}px)`,
                width: this.image.naturalWidth,
                height: this.image.naturalHeight,
                x: 0,
                y: 0,
                position: 'absolute',
                willChange: 'transform',
            };
        } else {
            // console.log('has style; no update');
        }

        // console.log('style RE-CALCULATED: ', style);

        this.setState({ imgStyle: style, imgContainerStyle: imageContainerStyle });

        if (
            typeof this.asset !== 'undefined'
            && typeof this.asset.boundingBox !== 'undefined'
        ) {
            const newImg = this.constructor.getImagePortion(
                this.image,
                (this.image.offsetWidth * this.asset.boundingBox.width),
                (this.image.offsetHeight * this.asset.boundingBox.height),
                (this.image.offsetWidth * this.asset.boundingBox.x),
                (this.image.offsetHeight * this.asset.boundingBox.y),
                1,
            );
            const newWidth = this.container.offsetWidth;
            this.thumbSrc = newImg;
            this.imgSrc = newImg;
            this.setState({
                thumbSrc: newImg,
                fullSrc: this.fullSrc,
                thumbWidth: newWidth,
                thumbHeight: this.container.offsetHeight,
            });
        }
        this.imageCalculated = true;
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
        const { fullscreen } = this.state;
        // console.log('ZoomableImage: translate: deltaX: ', deltaX);
        // console.log('ZoomableImage: translate: deltaY: ', deltaY);

        // console.log('translate fired:', deltaX, deltaY);
        // TODO: centre if image is smaller then dimension
        let newX = this.restrictRawPos(this.lastX + deltaX / this.scale,
            Math.min(this.viewportWidth, this.curWidth), this.imgWidth);

        let newY = this.restrictRawPos(this.lastY + deltaY / this.scale,
            Math.min(this.viewportHeight, this.curHeight), this.imgHeight);

        if (this.curWidth < this.viewportWidth) {
            newX += ((this.viewportWidth - this.curWidth) / 2) / this.scale;
        } else if (this.curHeight < this.viewportHeight) {
            newY += ((this.viewportHeight - this.curHeight) / 2) / this.scale;
        }

        if (fullscreen) {
            this.image.style.marginLeft = `${Math.ceil(newX * this.scale)}px`;
            this.image.style.marginTop = `${Math.ceil(newY * this.scale)}px`;
        }

        this.x = newX;
        this.y = newY;

        // console.log(this.x, this.y);

        this.setState({
            x: Math.ceil(newX * this.scale),
            y: Math.ceil(newY * this.scale),
        }, this.debugValues);
    }

    zoom(scaleBy) {
        this.scale = this.restrictScale(this.lastScale * scaleBy);

        this.curWidth = Math.ceil(this.imgWidth * this.scale);
        this.curHeight = Math.ceil(this.imgHeight * this.scale);

        this.setState({ width: this.curWidth, height: this.curHeight }, this.debugValues);

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

        // console.log('zoomAround fired');

        // New raw center of viewport
        const rawCenterX = -this.x + Math.min(this.viewportWidth, this.curWidth) / 2 / this.scale;
        const rawCenterY = -this.y + Math.min(this.viewportHeight, this.curHeight) / 2 / this.scale;

        // Delta
        const deltaX = (rawCenterX - rawZoomX) * this.scale;
        const deltaY = (rawCenterY - rawZoomY) * this.scale;

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
        // var zoomX = -x + Math.min(viewportWidth, curWidth)/2/scale;
        // var zoomY = -y + Math.min(viewportHeight, curHeight)/2/scale;
        // zoomAround(scaleBy, zoomX, zoomY);

        const zoomX = (-this.x + Math.min(this.viewportWidth, this.curWidth) / 2 / this.scale);
        const zoomY = (-this.y + Math.min(this.viewportHeight, this.curWidth) / 2 / this.scale);

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
        // console.log('handle zoom change: ', e.target.value);
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
        const { naturalWidth, naturalHeight } = this.image;
        const imageRatio = naturalWidth / naturalHeight;
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
        const { naturalWidth, naturalHeight } = this.image;

        // console.log('ZoomableImage: handleImageLoad');

        this.imgWidth = naturalWidth;
        this.imgHeight = naturalHeight;

        this.calculateImageRatios();
        /* finish calculating */

        this.initialScale = 1;

        this.scale = this.initialScale;
        this.lastScale = this.initialScale;
        this.curWidth = Math.ceil(this.imgWidth * this.scale);
        this.curHeight = Math.ceil(this.imgHeight * this.scale);

        this.x = Math.ceil((this.viewportWidth / 2) - (this.curWidth / 2));
        this.y = Math.ceil((this.viewportHeight / 2) - (this.curHeight / 2));

        this.updateLastPos();
        this.updateLastScale();

        if (
            typeof this.asset !== 'undefined'
            && typeof this.asset.boundingBox !== 'undefined'
        ) {
            // left = (this.image.offsetWidth * this.asset.boundingBox.x);
            // top = (this.image.offsetHeight * this.asset.boundingBox.y);
        }

        this.setState({
            width: this.curWidth,
            height: this.curHeight,
            x: this.x,
            y: this.y,
            // left,
            // top,
        }, this.calculateImageStyle);
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
            // console.log('handleDoubleTap fired - with fullscreen');
            this.zoomAround(1.1, c.x, c.y);
        } else {
            // console.log('handleDoubleTap fired - without fullscreen');
            this.handleToggleFullScreen();
        }
    }

    switchImgSrc(fullscreen) {
        this.imgSrc = (fullscreen ? this.fullSrc : this.thumbSrc);
        this.setState({ imgSrc: this.imgSrc });
    }

    handleToggleFullScreen() {
        if (this.animating) {
            return;
        }

        let { fullscreen } = this.state;
        const { onZoom } = this.props;
        // console.log('handleToggleFullScreen fired');

        fullscreen = !fullscreen;

        if (!fullscreen) {
            // zooming out
            this.setState({
                fadeOutFullscreen: true,
            });
            this.animating = true;
            setTimeout(() => {
                this.switchImgSrc(fullscreen);
                this.animating = false;
                onZoom(fullscreen);
                // this.translate(0, 0);
                this.setState({ fullscreen, fadeOutFullscreen: false });
            }, 1000);
            return;
        }

        this.switchImgSrc(fullscreen);

        onZoom(fullscreen);

        // this.translate(0, 0);
        this.setState({ fullscreen });
    }

    render() {
        const {
            zoomable,
            fullscreen,
            thumbSrc,
            fullSrc,
            thumbWidth,
            thumbHeight,
            fadeOutFullscreen,
        } = this.state;

        const zoomed = fullscreen ? 'zoomedIn' : 'zoomedOut';

        const zoomIconClass = (!fullscreen) ? 'icon-enlarge-img' : 'icon-reduce-img';

        const innerContainerClass = fadeOutFullscreen ? 'innerContainer fadeOutFull' : 'innerContainer';
        const thumbContainerClass = fullscreen ? 'thumbContainer fadeInFull' : 'thumbContainer';

        const zoomingOut = fadeOutFullscreen ? 'true' : 'false';
        return (
            <div className="zoomableWrapper">
                <div className={thumbContainerClass} style={{ width: `${thumbWidth}px`, height: `${thumbHeight}px` }}>
                    <div className="imgThumb" style={{ backgroundImage: `url(${thumbSrc})`, width: `${thumbWidth}px` }} />
                    {/* <img
                        src={thumbSrc}
                        alt=""
                        className="imgThumb"
                        style={{ width: `${thumbWidth}px` }}
                    /> */}
                </div>
                <div
                    className={`ZoomableImage ZoomableImage--${zoomed} zoomingOut--${zoomingOut}`}
                    ref={(ref) => { this.container = ref; }}
                >
                    <div
                        className="imageContainer"
                        ref={(ref) => { this.imageContainer = ref; }}
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
                            <div className={innerContainerClass}>
                                <img
                                    src={fullSrc}
                                    alt=""
                                    ref={(ref) => { this.image = ref; }}
                                    onLoad={this.handleImageLoad}
                                    style={this.getImageStyle()}
                                    className="imgFull"
                                />
                            </div>
                        </Hammer>
                    </div>
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
                <button
                    className="Button Button--icon ZoomableImage__ZoomButton"
                    type="button"
                    onClick={this.handleToggleFullScreen}
                >
                    <i className={zoomIconClass} />
                </button>
            </div>
        );
    }
}

ZoomableImage.propTypes = {
    image: PropTypes.string.isRequired,
    onZoom: PropTypes.func.isRequired,
    asset: propTypes.asset.isRequired,
};

export default ZoomableImage;

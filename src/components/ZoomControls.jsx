import React from 'react';
import PropTypes from 'prop-types';

import '../styles/components/ZoomControls.scss';

/*
 * ZoomControls:
 *
 * @author Gavin Cockrem <gavin@joipolloi.com.
 * @package sciencemuseum-kiosk-interface
 */

class ZoomControls extends React.Component {
    render() {
        const {
            zoomIn, zoomOut, imageMinZoom, imageMaxZoom, handleZoomChange, currentScale,
        } = this.props;

        return (
            <div className="ZoomControls">

                <button
                    className="Button Button--icon ZoomControls__ZoomOutButton"
                    type="button"
                    onClick={zoomOut}
                >
                    <i className="icon-minus" />
                </button>

                <input
                    className="ZoomControls__RangeSlider"
                    type="range"
                    min={imageMinZoom}
                    max={imageMaxZoom}
                    step="0.01"
                    onChange={handleZoomChange}
                    value={currentScale}
                />

                <button
                    className="Button Button--icon ZoomControls__ZoomInButton"
                    type="button"
                    onClick={zoomIn}
                >
                    <i className="icon-plus" />
                </button>
            </div>
        );
    }
}

ZoomControls.propTypes = {
    zoomIn: PropTypes.func.isRequired,
    zoomOut: PropTypes.func.isRequired,
    handleZoomChange: PropTypes.func.isRequired,
    imageMinZoom: PropTypes.number.isRequired,
    imageMaxZoom: PropTypes.number.isRequired,
    currentScale: PropTypes.number.isRequired,
};

export default ZoomControls;

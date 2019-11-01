/* eslint-disable react/forbid-prop-types */
// import React from 'react';
import PropTypes from 'prop-types';

/*
 * Title:
 *
 *
 * @author Bradley Beatson <bradley.beatson@joipolloi.com>
 * @package sciencemuseum-kiosk-interface
 */


function getThumb(props) {
    if (!props.asset) {
        return '';
    }
    return props.asset.thumbnail || props.asset.assetSource;
    // old return props.fullSrc.replace(/\.png|\.jpg|\.jpeg/, '_boundingBox.jpg');
}

getThumb.propTypes = {
    asset: PropTypes.object.isRequired,
};

getThumb.defaultProps = {

};

export default getThumb;

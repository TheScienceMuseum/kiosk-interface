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
    return props.fullSrc.replace(/\.png|\.jpg|\.jpeg/, '_boundingBox.jpg');
}

getThumb.propTypes = {
    fullSrc: PropTypes.string.isRequired,
};

getThumb.defaultProps = {

};

export default getThumb;

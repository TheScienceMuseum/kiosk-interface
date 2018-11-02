import React from 'react';
import PropTypes from 'prop-types'

import '../../styles/Page.scss';

/*
 * Video:
 *
 *
 * @author Gavin Cockrem <gavin@joipolloi.com.
 * @package sciencemuseum-kiosk-interface
 */


function Video(props) {

    const { videoSrc } = props;

    return (
        <div className="Page PageVideo">
            <video controls autoPlay>
                <source src={videoSrc} type="video/mp4" />
            </video>
        </div>
    );
}

Video.propTypes = {
    videoSrc: PropTypes.string.isRequired,
};

export default Video;

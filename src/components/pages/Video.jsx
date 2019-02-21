import React from 'react';
// import PropTypes from 'prop-types';

import '../../styles/components/pages/Video.scss';
import propTypes from '../../propTypes';

/*
 * Video:
 *
 *
 * @author Gavin Cockrem <gavin@joipolloi.com.
 * @package sciencemuseum-kiosk-interface
 */


function Video(props) {
    const { asset } = props;

    return (
        <div className="Page PageVideo">
            <video controls autoPlay>
                <source src={asset.assetSource} type="video/mp4" />
                <track kind="captions" />
            </video>
        </div>
    );
}

Video.propTypes = {
    asset: propTypes.asset.isRequired,
};

export default Video;

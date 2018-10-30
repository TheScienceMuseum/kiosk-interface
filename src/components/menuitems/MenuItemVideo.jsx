import React from 'react';
import PropTypes from 'prop-types';

/*
 * MenuItem-Video.jsx:
 *
 *
 * @author Gavin Cockrem <gavin@joipolloi.com.
 * @package sciencemuseum-kiosk-interface
 */


function MenuItemVideo(props) {

    const { title, titleImage } = props;

    return (
        <div className="MenuItemVideo">
            <img src={titleImage} alt="" />
            <h2>{title}</h2>
        </div>
    );
}

MenuItemVideo.propTypes = {
    title: PropTypes.string.isRequired,
    titleImage: PropTypes.string.isRequired,
};

export default MenuItemVideo;

import React from 'react';
import PropTypes from 'prop-types';

import propTypes from '../../propTypes';

import '../../styles/MenuItems.scss';

/*
 * MenuItem-Video.jsx:
 *
 *
 * @author Gavin Cockrem <gavin@joipolloi.com.
 * @package sciencemuseum-kiosk-interface
 */


class MenuItemVideo extends React.Component {
    render() {
        const {
            title, titleImage, articleID, onClick,
        } = this.props;

        return (
            <li className="MenuItem MenuItem__Video">
                <button type="button" onClick={() => onClick(articleID)}>
                    <img src={titleImage.imageSource} alt="" draggable="false" />
                    <h2>{title}</h2>
                </button>
            </li>
        );
    }
}

MenuItemVideo.propTypes = {
    title: PropTypes.string.isRequired,
    titleImage: propTypes.image.isRequired,
    articleID: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default MenuItemVideo;

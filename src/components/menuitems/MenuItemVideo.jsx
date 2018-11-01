import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import '../../styles/MenuItem.scss';

/*
 * MenuItem-Video.jsx:
 *
 *
 * @author Gavin Cockrem <gavin@joipolloi.com.
 * @package sciencemuseum-kiosk-interface
 */


class MenuItemVideo extends React.Component {
    render() {
        const { title, titleImage, articleID } = this.props;

        return (
            <li className="MenuItem MenuItem__Video">
                <Link to={`/article/${articleID}`}>
                    <img src={titleImage} alt="" />
                    <h2>{title}</h2>
                </Link>
            </li>
        );
    }
}

MenuItemVideo.propTypes = {
    title: PropTypes.string.isRequired,
    titleImage: PropTypes.string.isRequired,
    articleID: PropTypes.string.isRequired,
};

export default MenuItemVideo;

import React from 'react';
import PropTypes from 'prop-types';

import '../../styles/MenuItem.scss';

/*
 * Title:
 *
 *
 * @author Gavin Cockrem <gavin@joipolloi.com.
 * @package sciencemuseum-kiosk-interface
 */


function MenuItemTitle(props) {
    const { title, galleryName } = props;

    return (
        <li className="MenuItem MenuItem__Title">
            <p>{ galleryName }</p>
            <h1>{ title }</h1>
        </li>
    );
}

MenuItemTitle.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
};

MenuItemTitle.defaultProps = {
    subtitle: '',
};

export default MenuItemTitle;

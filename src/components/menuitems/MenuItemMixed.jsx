import React from 'react';
import PropTypes from 'prop-types';

/*
 * MenuItemMixed.jsx:
 *
 *
 * @author Gavin Cockrem <gavin@joipolloi.com.
 * @package sciencemuseum-kiosk-interface
 */


function MenuItemMixed(props) {

    const { title, titleImage } = props;

    return (
        <div className="MenuItemMixed">
            <img src={titleImage} alt="" />
            <h2>{title}</h2>
        </div>
    );
}

MenuItemMixed.propTypes = {

};

export default MenuItemMixed;

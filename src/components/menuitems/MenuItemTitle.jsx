import React from 'react';
import PropTypes from 'prop-types';

import '../../styles/components/menuitems/MenuItems.scss';

/*
 * Title:
 *
 *
 * @author Gavin Cockrem <gavin@joipolloi.com.
 * @package sciencemuseum-kiosk-interface
 */
function CompressMenuTitle(t) {
    if (t.length > 45) {
        return t.substring(0, 45);
    }

    return t;
}

function MenuItemTitle(props) {
    const { title, galleryName } = props;

    return (
        <li className="MenuItem MenuItem__Title">
            <p>{ galleryName }</p>
            <h1>{ CompressMenuTitle(title) }</h1>
        </li>
    );
}

MenuItemTitle.propTypes = {
    title: PropTypes.string.isRequired,
    galleryName: PropTypes.string.isRequired,
};

MenuItemTitle.defaultProps = {

};

export default MenuItemTitle;

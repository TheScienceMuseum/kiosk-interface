import React from 'react';
import PropTypes from 'prop-types';

/*
 * Title:
 *
 *
 * @author Gavin Cockrem <gavin@joipolloi.com.
 * @package sciencemuseum-kiosk-interface
 */


function MenuItemTitle(props) {
    const { title, subtitle } = props;

    return (
        <div className="MenuItem_Title">
            <h1>{ title }</h1>
            <h2>{ subtitle }</h2>
        </div>
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

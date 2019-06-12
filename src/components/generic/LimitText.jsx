// import React from 'react';
import PropTypes from 'prop-types';

import '../../styles/components/menuitems/MenuItems.scss';

/*
 * Title:
 *
 *
 * @author Gavin Cockrem <gavin@joipolloi.com.
 * @package sciencemuseum-kiosk-interface
 */


function LimitText(props) {
    const { text } = props;
    let aText = text;

    if (text.length > 72) {
        aText = `${aText.substr(0, 71)}...`;
    }

    return aText.trim();
}

LimitText.propTypes = {
    text: PropTypes.string.isRequired,
};

LimitText.defaultProps = {

};

export default LimitText;

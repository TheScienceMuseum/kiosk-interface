import React from 'react';
import PropTypes from 'prop-types';

import '../styles/NavButtons.scss';

/*
 * NavButtons:
 *
 *
 * @author Gavin Cockrem <gavin@joipolloi.com.
 * @package sciencemuseum-kiosk-interface
 */


function NavButtons(props) {
    const { onNext, onPrev } = props;

    return (
        <div className="NavButtons">
            <button className="NavButton NavButtons__Prev" type="button" onClick={onPrev}>Previous</button>
            <button className="NavButton NavButtons__Next" type="button" onClick={onNext}>Next</button>
        </div>
    );
}

NavButtons.propTypes = {
    onNext: PropTypes.func.isRequired,
    onPrev: PropTypes.func.isRequired,
};

export default NavButtons;

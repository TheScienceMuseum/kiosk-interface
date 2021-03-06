import React from 'react';
import PropTypes from 'prop-types';

import { Orientations } from '../../utils/Constants';

import '../../styles/components/navbar/NavButtons.scss';
import ProgressDisplay from './ProgressDisplay';

/*
 * NavButtons:
 *
 *
 * @author Gavin Cockrem <gavin@joipolloi.com.
 * @package sciencemuseum-kiosk-interface
 */


function NavButtons(props) {
    const {
        onNext, onPrev, orientation, currentPage, totalPages,
    } = props;

    return (
        <div className={`NavButtons NavButtons--${orientation}`}>
            <button
                className="Button Button-icon NavButton NavButtons__Prev"
                type="button"
                onClick={onPrev}
            >
                <i className="icon-arrow" />
            </button>
            {(orientation === Orientations.VERTICAL)
            && (
                <ProgressDisplay
                    currentPage={currentPage}
                    totalPages={totalPages}
                />
            )
            }
            <button
                className="Button Button-icon NavButton NavButtons__Next"
                type="button"
                onClick={onNext}
            >
                <i className="icon-arrow" />
            </button>
        </div>
    );
}

NavButtons.propTypes = {
    onNext: PropTypes.func.isRequired,
    onPrev: PropTypes.func.isRequired,
    orientation: PropTypes.oneOf(Object.values(Orientations)),
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
};

NavButtons.defaultProps = {
    orientation: Orientations.HORIZONTAL,
};

export default NavButtons;

import React from 'react';
import PropTypes from 'prop-types';
import NavButtonHome from './NavButtonHome';
import NavButtons from './NavButtons';
import { Orientations } from '../../Constants';

import '../../styles/components/navbar/NavBar.scss';

/*
 * NavBar:
 *
 * @author Gavin Cockrem <gavin@joipolloi.com.
 * @package sciencemuseum-kiosk-interface
 */

class NavBar extends React.Component {
    render() {
        const {
            onHomeClick,
            onNext,
            onPrev,
            orientation,
            currentPage,
            totalPages,
            hidden,
            showNav,
            hideHome,
        } = this.props;

        const hiddenClass = (hidden) ? 'NavBar--hidden' : '';
        const noNavClass = (!showNav) ? 'NavBar--noNav' : '';
        const noHomeClass = (hideHome) ? 'NavBar--noHome' : '';

        return (
            <div className={`NavBar ${hiddenClass} ${noNavClass} ${noHomeClass}`}>
                {!hideHome
                    && (
                        <NavButtonHome onClick={onHomeClick} />
                    )
                }

                {showNav
                    && (
                        <NavButtons
                            onNext={onNext}
                            onPrev={onPrev}
                            orientation={orientation}
                            currentPage={currentPage}
                            totalPages={totalPages}
                        />
                    )
                }
            </div>
        );
    }
}

NavBar.propTypes = {
    onHomeClick: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
    onPrev: PropTypes.func.isRequired,
    orientation: PropTypes.oneOf(Object.values(Orientations)),
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    hidden: PropTypes.bool,
    hideHome: PropTypes.bool,
    showNav: PropTypes.bool,
};

NavBar.defaultProps = {
    orientation: Orientations.HORIZONTAL,
    hidden: false,
    hideHome: false,
    showNav: true,
};

export default NavBar;

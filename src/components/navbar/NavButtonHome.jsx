import React from 'react';
import PropTypes from 'prop-types';

import '../../styles/components/navbar/NavButtonHome.scss';

/*
 * NavButtonHome:
 *
 * @author Gavin Cockrem <gavin@joipolloi.com.
 * @package sciencemuseum-kiosk-interface
 */

class NavButtonHome extends React.Component {
    render() {
        const { onClick } = this.props;

        return (
            <div className="NavButtonHome">
                <button
                    type="button"
                    className="Button NavButton"
                    onClick={onClick}
                >
                    Home
                </button>
            </div>
        );
    }
}

NavButtonHome.propTypes = {
    onClick: PropTypes.func.isRequired,
};

export default NavButtonHome;

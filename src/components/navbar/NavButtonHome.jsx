import React from 'react';
import PropTypes from 'prop-types';


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
                    className="Button NavButton Button--icon"
                    onClick={onClick}
                >
                    <i className="icon-home" />
                </button>
            </div>
        );
    }
}

NavButtonHome.propTypes = {
    onClick: PropTypes.func.isRequired,
};

export default NavButtonHome;

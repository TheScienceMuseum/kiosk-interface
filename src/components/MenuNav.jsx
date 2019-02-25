import React from 'react';
import PropTypes from 'prop-types';
import MenuPips from './MenuPips';

import '../styles/components/MenuNav.scss';

/*
 * MenuNav:
 *
 * @author Gavin Cockrem <gavin@joipolloi.com.
 * @package sciencemuseum-kiosk-interface
 */

class MenuNav extends React.Component {
    render() {
        const {
            onNext, onPrev, contents, onJump, currentFocused,
        } = this.props;

        return (
            <div className="MenuNav">
                <button
                    className="Button Button--icon MenuNav__Button MenuNav__Button--Prev"
                    type="button"
                    onClick={onPrev}
                >
                    <i className="icon-arrow" />

                </button>
                <MenuPips
                    contents={contents}
                    onJump={onJump}
                    currentFocused={currentFocused}
                />
                <button
                    className="Button Button--icon MenuNav__Button MenuNav__Button--Next"
                    type="button"
                    onClick={onNext}
                >
                    <i className="icon-arrow" />
                </button>
            </div>
        );
    }
}

MenuNav.propTypes = {
    onNext: PropTypes.func.isRequired,
    onPrev: PropTypes.func.isRequired,
    contents: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    onJump: PropTypes.func.isRequired,
    currentFocused: PropTypes.number.isRequired,
};

MenuNav.defaultProps = {
};

export default MenuNav;

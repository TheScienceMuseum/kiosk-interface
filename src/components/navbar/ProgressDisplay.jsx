import React from 'react';
import PropTypes from 'prop-types';

import '../../styles/components/navbar/ProgressDisplay.scss';

/*
 * ProgressDisplay:
 *
 * @author Gavin Cockrem <gavin@joipolloi.com.
 * @package sciencemuseum-kiosk-interface
 */

class ProgressDisplay extends React.Component {
    render() {
        const {
            currentPage, totalPages, displayBar, scrollStyle,
        } = this.props;
        const text = `${(currentPage + 1)}/${totalPages}`;

        const modifierClass = (displayBar) ? 'ProgressDisplay--bar' : 'ProgressDisplay--text';
        const progress = ((currentPage + 1) / totalPages) * 100;
        const absProgress = (currentPage / totalPages) * 100;
        const style = {};

        // const
        if (scrollStyle) {
            style.height = `${(1 / totalPages) * 100}%`;
            style.top = `${absProgress}%`;
        } else {
            style.height = `${progress}%`;
        }

        return (
            <div className={`ProgressDisplay ${modifierClass}`}>
                { !displayBar && <p>{ text }</p> }
                { displayBar && (
                    <div className="ProgressDisplay__track">
                        <div className="ProgressDisplay__bar" style={style} />
                    </div>
                ) }
            </div>
        );
    }
}

ProgressDisplay.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    displayBar: PropTypes.bool,
    scrollStyle: PropTypes.bool,
};

ProgressDisplay.defaultProps = {
    displayBar: false,
    scrollStyle: false,
};

export default ProgressDisplay;

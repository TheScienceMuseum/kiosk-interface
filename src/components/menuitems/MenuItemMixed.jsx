import React from 'react';
import PropTypes from 'prop-types';
import Hammer from 'react-hammerjs';

import propTypes from '../../propTypes';
import '../../styles/components/menuitems/MenuItems.scss';

/*
 * MenuItemMixed.jsx:
 *
 *
 * @author Gavin Cockrem <gavin@joipolloi.com.
 * @package sciencemuseum-kiosk-interface
 */


class MenuItemMixed extends React.Component {
    render() {
        const {
            title, titleImage, articleID, onClick, selected
        } = this.props;

        const isSelectedClass = selected ? 'MenuItem__Selected' : '';

        return (
            <li className={`MenuItem MenuItem__Mixed ${isSelectedClass}`}>
                <Hammer onTap={() => onClick(articleID)}>
                    <button type="button">
                        <div className="Image--withGrad">
                            <img src={titleImage.assetSource} alt="" />
                        </div>
                        <h2>{title}</h2>
                    </button>
                </Hammer>
            </li>
        );
    }
}

MenuItemMixed.propTypes = {
    title: PropTypes.string.isRequired,
    titleImage: propTypes.asset.isRequired,
    articleID: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    selected: PropTypes.bool,
};

MenuItemMixed.defaultProps = {
    selected: false,
};

export default MenuItemMixed;

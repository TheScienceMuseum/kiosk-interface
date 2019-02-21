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
            title, titleImage, articleID, onClick,
        } = this.props;

        return (
            <li className="MenuItem MenuItem__Mixed">
                <Hammer onTap={() => onClick(articleID)}>
                    <button type="button">
                        <div className="Image--withGrad">
                            <img src={titleImage} alt="" />
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
    titleImage: PropTypes.string.isRequired,
    articleID: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default MenuItemMixed;

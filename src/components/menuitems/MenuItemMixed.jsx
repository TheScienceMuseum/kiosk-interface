/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import Hammer from 'react-hammerjs';

import propTypes from '../../propTypes';
import '../../styles/components/menuitems/MenuItems.scss';
import getFirstContentImage from '../generic/getFirstContentImage';
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
            title, titleImage, articleID, onClick, selected, aspect, subpages,
        } = this.props;
        const isSelectedClass = selected ? 'MenuItem__Selected' : '';

        let imgSource = titleImage.assetSource;
        if (aspect === 'portrait' && subpages) {
            const portImage = getFirstContentImage({ subpages });
            imgSource = portImage.thumbnail;
        }

        return (
            <li className={`MenuItem MenuItem__Mixed ${isSelectedClass}`}>
                <Hammer onTap={() => onClick(articleID)}>
                    <button type="button">
                        <div className="Image--withGrad">
                            <img src={imgSource} alt="" />
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
    aspect: PropTypes.string.isRequired,
    subpages: PropTypes.array,
};

MenuItemMixed.defaultProps = {
    selected: false,
    subpages: [],
};

export default MenuItemMixed;

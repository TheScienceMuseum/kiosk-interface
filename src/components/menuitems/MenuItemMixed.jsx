/* eslint-disable class-methods-use-this */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import Hammer from 'react-hammerjs';

import propTypes from '../../propTypes';
import '../../styles/components/menuitems/MenuItems.scss';
import getFirstContentImage from '../generic/getFirstContentImage';
import getThumb from '../generic/getThumb';
/*
 * MenuItemMixed.jsx:
 *
 *
 * @author Gavin Cockrem <gavin@joipolloi.com.
 * @package sciencemuseum-kiosk-interface
 */


class MenuItemMixed extends React.Component {
    getBackgroundStyle() {
        const { titleImage, aspect, subpages } = this.props;
        let imgSource = getThumb({ asset: titleImage });
        if (aspect === 'portrait' && subpages) {
            const portImage = getFirstContentImage({ titleImage, subpages });
            imgSource = portImage.thumbnail;
        }
        return {
            backgroundImage: `url('${imgSource}')`,
        };
    }

    getPlayButtonStyle() {
        const { titleImage, aspect, subpages } = this.props;
        if (aspect === 'portrait' && subpages) {
            const portImage = getFirstContentImage({ titleImage, subpages });
            if (portImage.showPlayButton) {
                return {
                    display: 'none',
                };
            }
        }
        return {
            display: 'none',
        };
    }

    render() {
        const {
            title, articleID, onClick, selected,
        } = this.props;
        const isSelectedClass = selected ? 'MenuItem__Selected' : '';

        return (
            <li className={`MenuItem MenuItem__Mixed ${isSelectedClass}`}>
                <Hammer onTap={() => onClick(articleID)}>
                    <button type="button">
                        <div className="Image--withGrad" style={this.getBackgroundStyle()} />
                        <h2>{title}</h2>
                        <div className="playButton" style={this.getPlayButtonStyle()} />
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

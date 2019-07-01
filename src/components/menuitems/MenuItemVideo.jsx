import React from 'react';
import PropTypes from 'prop-types';
import Hammer from 'react-hammerjs';

import '../../styles/components/menuitems/MenuItems.scss';
import propTypes from '../../propTypes';

/*
 * MenuItem-Video.jsx:
 *
 *
 * @author Gavin Cockrem <gavin@joipolloi.com.
 * @package sciencemuseum-kiosk-interface
 */


class MenuItemVideo extends React.Component {
    render() {
        const {
            title, articleID, onClick, onClickAuto, asset,
        } = this.props;

        return (
            <li className="MenuItem MenuItem__Video">
                <Hammer>
                    <div className="buttonsContainer">
                        <button type="button" onClick={() => onClick(articleID)}>
                            <div className="Image--withGrad">
                                <img src={asset.posterImage} alt="" draggable="false" />
                            </div>
                            <h2>{title}</h2>
                        </button>
                        <button
                            type="button"
                            className="playButton"
                            onClick={() => onClickAuto(articleID)}
                        />
                    </div>
                </Hammer>
            </li>
        );
    }
}

MenuItemVideo.propTypes = {
    title: PropTypes.string.isRequired,
    articleID: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    asset: propTypes.videoAsset.isRequired,
    onClickAuto: PropTypes.func.isRequired,
};

export default MenuItemVideo;

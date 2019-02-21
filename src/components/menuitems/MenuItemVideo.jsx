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
            title, titleImage, articleID, onClick,
        } = this.props;

        return (
            <li className="MenuItem MenuItem__Video">
                <Hammer onTap={() => onClick(articleID)}>
                    <button type="button">
                        <div className="Image--withGrad">
                            <img src={titleImage.assetSource} alt="" draggable="false" />
                        </div>
                        <h2>{title}</h2>
                    </button>
                </Hammer>
            </li>
        );
    }
}

MenuItemVideo.propTypes = {
    title: PropTypes.string.isRequired,
    titleImage: propTypes.asset.isRequired,
    articleID: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default MenuItemVideo;

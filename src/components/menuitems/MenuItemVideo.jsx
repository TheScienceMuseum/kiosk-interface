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
            title, articleID, onClick, asset,
        } = this.props;

        console.log('asset: ', asset);
        console.log('asset.posterImage: ', asset.posterImage);
        console.log('asset === \'undefined\': ', asset === 'undefined');

        return (
            <li className="MenuItem MenuItem__Video">
                <Hammer onTap={() => onClick(articleID)}>
                    <button type="button">
                        <div className="Image--withGrad">
                            <img src={asset.posterImage} alt="" draggable="false" />
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
    articleID: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    asset: propTypes.videoAsset,
};

MenuItemVideo.defaultProps = {
    asset: '',
};

export default MenuItemVideo;

/* eslint-disable react/forbid-prop-types */
// import React from 'react';
import PropTypes from 'prop-types';
import getThumb from './getThumb';
import { PageTypes } from '../../utils/Constants';
/*
 * Title:
 *
 *
 * @author Bradley Beatson <bradley.beatson@joipolloi.com>
 * @package sciencemuseum-kiosk-interface
 */


function getFirstContentImage(props) {
    const { subpages } = props;
    const page = subpages[0];

    switch (page.type) {
    case PageTypes.TEXT_IMAGE:
    case PageTypes.TITLE:
    case PageTypes.IMAGE:
    case PageTypes.TEXT_AUDIO:
        return {
            full: page.asset.assetSource,
            thumbnail: getThumb({ fullSrc: page.asset.assetSource }),
        };
    case PageTypes.VIDEO:
    case PageTypes.VIDEO_TEXT:
        return {
            full: page.titleImage.assetSource,
            thumbnail: getThumb({ fullSrc: page.titleImage.assetSource }),
        };
    default:
        return {
            full: '',
            thumbnail: '',
        };
    }
}

getFirstContentImage.propTypes = {
    subpages: PropTypes.array.isRequired,
};

getFirstContentImage.defaultProps = {

};

export default getFirstContentImage;

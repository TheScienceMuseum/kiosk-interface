import PropTypes from 'prop-types';
import { AssetTypes } from './utils/Constants';

const asset = PropTypes.shape({
    assetSource: PropTypes.string.isRequired,
    assetType: PropTypes.oneOf(Object.values(AssetTypes)).isRequired,
    boundingBox: PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number,
        width: PropTypes.number,
        height: PropTypes.number,
    }),
    nameText: PropTypes.string,
    sourceText: PropTypes.string,
});

const videoAsset = PropTypes.shape({
    assetSource: PropTypes.string.isRequired,
    assetType: PropTypes.oneOf(Object.values(AssetTypes)).isRequired,
    nameText: PropTypes.string,
    sourceText: PropTypes.string,
    bslSource: PropTypes.string,
    subtitlesSource: PropTypes.string,
    posterImage: PropTypes.string,
});

const modelAsset = PropTypes.shape({
    obj: PropTypes.string.isRequired,
    mtl: PropTypes.string.isRequired,
    assetType: PropTypes.oneOf(Object.values(AssetTypes)).isRequired,
    nameText: PropTypes.string,
    sourceText: PropTypes.string,
    position: PropTypes.arrayOf(PropTypes.number).isRequired,
    rotation: PropTypes.arrayOf(PropTypes.number).isRequired,
});

const titleImage = PropTypes.shape({
    assetSource: PropTypes.string.isRequired,
    assetType: PropTypes.string.isRequired,
});

export default {
    asset,
    videoAsset,
    modelAsset,
    titleImage,
};

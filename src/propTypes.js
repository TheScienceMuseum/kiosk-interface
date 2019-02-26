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

export default { asset };

import PropTypes from 'prop-types';

const image = PropTypes.shape({
    imageSource: PropTypes.string.isRequired,
    boundingBox: PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number,
        width: PropTypes.number,
        height: PropTypes.number,
    }),
    nameText: PropTypes.string.isRequired,
    sourceText: PropTypes.string.isRequired,
});

export default { image };

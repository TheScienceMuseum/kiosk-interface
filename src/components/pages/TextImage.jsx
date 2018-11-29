import React from 'react';
import PropTypes from 'prop-types';

import { Layouts } from '../../Constants';

import '../../styles/pages/TextImage.scss';
import ZoomableImage from '../ZoomableImage';

/*
 * :
 *
 *
 * @author Gavin Cockrem <gavin@joipolloi.com.
 * @package sciencemuseum-kiosk-interface
 */


class TextImage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            contentHidden: false,
        };

        this.handleHideContent = this.handleHideContent.bind(this);
    }

    handleHideContent(imageZoomed) {
        let { contentHidden } = this.state;
        const { toggleNavHide } = this.props;

        if (!imageZoomed) {
            contentHidden = !contentHidden;
        } else {
            contentHidden = imageZoomed;
        }

        this.setState({ contentHidden });
        toggleNavHide(contentHidden);
    }

    render() {
        const {
            title, content, image, layout,
        } = this.props;

        const { contentHidden } = this.state;
        const imageState = contentHidden ? 'imageFull' : 'imageWindowed';
        const mainClass = 'Page PageTextImage'
            + `PageTextImage--${layout} PageTextImage--${imageState}`;

        return (
            <div className={mainClass}>
                <div className="ImageContainer">
                    <ZoomableImage image={image} onZoom={this.handleHideContent} />
                </div>
                <div className="ContentContainer">
                    <h2>{title}</h2>
                    <p>{content}</p>
                    <div className="ImageCaption">
                        <h3>{image.nameText}</h3>
                        <p>{image.sourceText}</p>
                    </div>
                </div>
            </div>
        );
    }
}

TextImage.propTypes = {
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    image: PropTypes.shape({
        imageSource: PropTypes.string.isRequired,
        imageThumbnail: PropTypes.string.isRequired,
        imagePortrait: PropTypes.string.isRequired,
        imageLandscape: PropTypes.string.isRequired,
        nameText: PropTypes.string.isRequired,
        sourceText: PropTypes.string.isRequired,
    }).isRequired,
    layout: PropTypes.oneOf(Object.values(Layouts)).isRequired,
    toggleNavHide: PropTypes.func.isRequired,
};

export default TextImage;

import React from 'react';
import PropTypes from 'prop-types';

import { Layouts } from '../../Constants';
import '../../styles/components/pages/TextImage.scss';
import propTypes from '../../propTypes';
import createBodyTag from '../createBodyTag';

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
            title, content, asset, layout,
        } = this.props;

        const { contentHidden } = this.state;
        const imageState = contentHidden ? 'imageFull' : 'imageWindowed';
        const mainClass = 'Page PageTextImage '
            + `PageTextImage--${layout} PageTextImage--${imageState}`;

        return (
            <div className={mainClass}>
                <div className="ImageContainer">
                    <ZoomableImage image={asset.assetSource} onZoom={this.handleHideContent} />
                </div>
                <div className="ContentContainer">
                    <h2>{title}</h2>
                    <div
                        className="ContentContainer__body"
                        dangerouslySetInnerHTML={{ __html: createBodyTag(content) }}
                    />
                    <div className="ImageCaption">
                        <h3>{asset.nameText}</h3>
                        <p>{asset.sourceText}</p>
                    </div>
                </div>
            </div>
        );
    }
}

TextImage.propTypes = {
    title: PropTypes.string.isRequired,
    content: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string)])
        .isRequired,
    asset: propTypes.asset.isRequired,
    layout: PropTypes.oneOf(Object.values(Layouts)).isRequired,
    toggleNavHide: PropTypes.func.isRequired,
};

export default TextImage;

import React from 'react';
import PropTypes from 'prop-types';

import propTypes from '../../propTypes';

import '../../styles/components/pages/Image.scss';
import ZoomableImage from '../ZoomableImage';

/*
 * Image.jsx:
 *
 *
 * @author Gavin Cockrem <gavin@joipolloi.com.
 * @package sciencemuseum-kiosk-interface
 */


class Image extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            contentHidden: false,
        };

        this.handleHideContent = this.handleHideContent.bind(this);
    }


    handleHideContent(imageZoomed = null) {
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
        const { title, content, asset, layout } = this.props;
        const { contentHidden } = this.state;

        const zoomed = contentHidden ? 'zoomedIn' : 'zoomedOut';

        return (
            <div className="Page PageImage">
                <div className="ImageContainer">
                    <ZoomableImage
                        image={asset.assetSource}
                        asset={asset}
                        onZoom={this.handleHideContent}
                    />
                </div>
                <div className={`ContentContainer ContentContainer--${zoomed} ContentContainer--${layout}`}>
                    <h2>{title}</h2>
                    <p>{content}</p>
                    <div className="ImageCaption">
                        <h3>{asset.nameText}</h3>
                        <p>{asset.sourceText}</p>
                    </div>
                </div>
            </div>
        );
    }
}

Image.propTypes = {
    title: PropTypes.string.isRequired,
    content: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string)])
        .isRequired,
    asset: propTypes.asset.isRequired,
    toggleNavHide: PropTypes.func.isRequired,
};

export default Image;

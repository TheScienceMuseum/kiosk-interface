import React from 'react';
import PropTypes from 'prop-types';


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
        const { title, content, image } = this.props;
        const { contentHidden } = this.state;

        const zoomed = contentHidden ? 'zoomedIn' : 'zoomedOut';

        return (
            <div className="Page PageImage">
                <div className="ImageContainer">
                    <ZoomableImage image={image} onZoom={this.handleHideContent} />
                </div>
                <div className={`ContentContainer ContentContainer--${zoomed}`}>
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

Image.propTypes = {
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
    toggleNavHide: PropTypes.func.isRequired,
};

export default Image;

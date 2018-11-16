import React from 'react';
import PropTypes from 'prop-types';

import { Layouts } from '../../Constants';

import '../../styles/pages/TextImage.scss';

/*
 * :
 *
 *
 * @author Gavin Cockrem <gavin@joipolloi.com.
 * @package sciencemuseum-kiosk-interface
 */


function TextImage(props) {
    const {
        title, content, image, layout,
    } = props;


    return (
        <div className={`Page PageTextImage PageTextImage--${layout}`}>
            <div className="ImageContainer">
                <img src={image.imageSource} alt="" />
            </div>
            <div className="ContentContainer">
                <h2>{ title }</h2>
                <p>{ content }</p>
                <div className="ImageCaption">
                    <h3>{image.nameText}</h3>
                    <p>{image.sourceText}</p>
                </div>
            </div>


        </div>
    );
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
};

export default TextImage;

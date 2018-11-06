import React from 'react';
// import PropTypes from 'prop-types';

/*
 * :
 *
 *
 * @author Gavin Cockrem <gavin@joipolloi.com.
 * @package sciencemuseum-kiosk-interface
 */


function TextImage(props) {
    const { title, content, image } = props;

    return (
        <div className="Page PageTextImage PageTextImage--left">
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

TextImage.propTypes = {};

export default TextImage;

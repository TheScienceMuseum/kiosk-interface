/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';

import { Layouts } from '../../utils/Constants';
import '../../styles/components/pages/TextImage.scss';
import propTypes from '../../propTypes';
import createBodyTag from '../../utils/createBodyTag';

import ZoomableImage from '../ZoomableImage';
import Audio from './Audio';
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
        this.showTitle = true;
        const { title } = props;
        if (!title || title === 'none' || title === 'NONE' || title === '') {
            this.showTitle = false;
        }
    }

    getAnimationClasses() {
        const { nextBack, active } = this.state;
        let animationClass;
        if (nextBack) {
            animationClass += ' reverse';
        }
        if (active) {
            animationClass += ' pageActive';
        }

        return animationClass;
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
            title, content, asset, layout, date, audio, pauseTimer, resetInactiveTimer,
        } = this.props;

        const { contentHidden } = this.state;
        const imageState = contentHidden ? 'imageFull' : 'imageWindowed';
        const isAudioClass = typeof audio !== 'undefined' ? 'PageTextAudio' : 'PageTextNoAudio';
        const mainClass = `${'Page PageTextImage '
            + `PageTextImage--${layout} PageTextImage--${imageState} ${isAudioClass}`}`;

        /* eslint-disable react/no-danger */
        return (
            <div className={mainClass}>
                { typeof date !== 'undefined' && (
                    <div className="dateCircle">
                        { date }
                    </div>
                ) }

                <div className="ImageContainer">
                    <ZoomableImage
                        image={asset.assetSource}
                        asset={asset}
                        onZoom={this.handleHideContent}
                    />
                </div>
                <div className="ContentContainer">
                    {typeof audio === 'undefined' && (
                        <React.Fragment>
                            {this.showTitle && (
                                <h2>{title}</h2>
                            )}
                            <div
                                className="ContentContainer__body"
                                dangerouslySetInnerHTML={{ __html: createBodyTag(content) }}
                            />
                        </React.Fragment>
                    )}
                    {typeof audio !== 'undefined' && (
                        <React.Fragment>
                            <Audio
                                nameText={title}
                                sourceText={content}
                                audio={audio}
                                pauseTimer={pauseTimer}
                                resetInactiveTimer={resetInactiveTimer}
                            />
                        </React.Fragment>
                    )}
                    <div className="ImageCaption">
                        <h3>{asset.nameText}</h3>
                        <p>{asset.sourceText}</p>
                    </div>
                </div>
            </div>
        );
        /* eslint-enable react/no-danger */
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
    date: PropTypes.string,
    audio: PropTypes.any,
    pauseTimer: PropTypes.func.isRequired,
    resetInactiveTimer: PropTypes.func.isRequired,
};

TextImage.defaultProps = {
    date: undefined,
    audio: undefined,
};

export default TextImage;

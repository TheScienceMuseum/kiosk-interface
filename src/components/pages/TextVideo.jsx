import React from 'react';
import PropTypes from 'prop-types';

import { Player, ControlBar } from 'video-react';
import has from 'lodash.has';

import { Layouts } from '../../utils/Constants';
import '../../styles/components/pages/TextImage.scss';
import propTypes from '../../propTypes';
import createBodyTag from '../../utils/createBodyTag';
import getThumb from '../generic/getThumb';

/*
 * :
 *
 *
 * @author Gavin Cockrem <gavin@joipolloi.com.
 * @package sciencemuseum-kiosk-interface
 */


class TextVideo extends React.Component {
    constructor(props) {
        super(props);
        this.asset = props.asset;
        this.titleImage = props.titleImage;
        this.state = {
            contentHidden: false,
            showBSL: has(this.asset, 'bslSource'),
            showSubtitles: has(this.asset, 'subtitlesSource'),
            bslEnabled: false,
            subtitlesEnabled: false,
            played: false,
        };

        this.handleHideContent = this.handleHideContent.bind(this);

        this.onPause = this.onPause.bind(this);
        this.onPlay = this.onPlay.bind(this);
        this.handlePlayerState = this.handlePlayerState.bind(this);
        this.handleBSL = this.handleBSL.bind(this);
        this.handleSubtitles = this.handleSubtitles.bind(this);
        this.getBslClass = this.getBslClass.bind(this);
        this.getSubClass = this.getSubClass.bind(this);
        this.beginPlay = this.beginPlay.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            this.disableSubTitles();
        }, 100);
    }

    onPause() {
        const { resetInactiveTimer } = this.props;
        resetInactiveTimer();
    }

    onPlay() {
        const { pauseTimer } = this.props;
        pauseTimer();
    }

    getBslClass() {
        const { bslEnabled } = this.state;
        if (bslEnabled) {
            return 'enabled';
        }
        return '';
    }

    getSubClass() {
        const { subtitlesEnabled } = this.state;
        if (subtitlesEnabled) {
            return 'enabled';
        }
        return '';
    }

    getSubTrack() {
        return {
            type: 'title',
            value: this.asset.subtitlesSource,
        };
    }


    getPosterStyle() {
        let posterImg = this.titleImage.assetSource ? this.titleImage.assetSource : null;
        if (posterImg) {
            getThumb({ fullSrc: this.titleImage.assetSource });
        }
        return {
            backgroundImage: `url('${posterImg}')`,
        };
    }

    disableSubTitles() {
        this.player.video.video.textTracks[0].mode = 'disabled';
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

    handleBSL() {
        const { bslEnabled } = this.state;

        // get current play time
        const playerState = this.player.getState();

        if (bslEnabled) {
            // disable
            this.player.video.video.src = this.asset.assetSource;
            this.player.load(this.asset.assetSource);
            this.player.seek(playerState.player.currentTime);
            this.setState({ bslEnabled: false });
            return;
        }

        // enable & change source
        this.player.video.video.src = this.asset.bslSource;
        this.player.load(this.asset.bslSource);
        this.player.seek(playerState.player.currentTime);
        this.setState({ bslEnabled: true });
    }

    handleSubtitles() {
        let { subtitlesEnabled } = this.state;
        subtitlesEnabled = !subtitlesEnabled;
        if (subtitlesEnabled) {
            this.player.video.video.textTracks[0].mode = 'showing';
        } else {
            this.player.video.video.textTracks[0].mode = 'disabled';
        }
        this.setState({ subtitlesEnabled });
    }

    handlePlayerState(state, prevState) {
        if (prevState.paused !== state.paused) {
            if (!state.paused) {
                this.onPlay();
                return;
            }
            this.onPause();
        }
    }

    beginPlay() {
        this.setState({ played: true });
        this.player.play();
    }

    render() {
        const {
            title, content, asset, layout,
        } = this.props;

        const { contentHidden } = this.state;
        const imageState = contentHidden ? 'imageFull' : 'imageWindowed';

        const { showBSL, showSubtitles, played } = this.state;

        let showVideo = '';
        let showPoster = 'poster ';
        let articleStyle = '';
        if (played) {
            showVideo = 'show';
            showPoster = 'poster hide';
            articleStyle = 'open';
        }

        const mainClass = 'Page PageTextVideo PageTextImage '
            + `PageTextVideo--${layout} PageTextVideo--${imageState} ${articleStyle}`;

        /* eslint-disable react/no-danger */
        return (
            <div className={mainClass}>
                <div className="ImageContainer">
                    <button
                        type="button"
                        className={showPoster}
                        onClick={this.beginPlay}
                        style={this.getPosterStyle()}
                    />
                    <Player
                        ref={(node) => { this.player = node; }}
                        // crossOrigin="anonymous"
                        selectedTextTrack={this.getSubTrack().value}
                        poster={getThumb({ fullSrc: this.titleImage.assetSource })}
                        className={showVideo}
                        onEnded={this.onPause}
                    >
                        <source src={this.asset.assetSource} type="video/mp4" />
                        <track
                            kind="captions"
                            src="testing.vtt"
                            srcLang="en"
                            label="English"
                            default
                        />
                        <ControlBar autoHide={false} className="kioskControlBar">
                            {
                                showBSL && (
                                    <button
                                        type="button"
                                        className={`
                                            kioskPlayerControl end bsl ${this.getBslClass()}
                                        `}
                                        onClick={this.handleBSL}
                                    >
                                        Enable/Disable BSL
                                    </button>
                                )
                            }
                            {
                                showSubtitles && (
                                    <button
                                        type="button"
                                        className={`
                                            kioskPlayerControl end subtitles ${this.getSubClass()}
                                        `}
                                        onClick={this.handleSubtitles}
                                    >
                                        Enable/Disable subtitles
                                    </button>
                                )
                            }
                        </ControlBar>
                    </Player>
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
        /* eslint-enable react/no-danger */
    }
}

TextVideo.propTypes = {
    title: PropTypes.string.isRequired,
    content: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string)])
        .isRequired,
    asset: propTypes.asset.isRequired,
    layout: PropTypes.oneOf(Object.values(Layouts)).isRequired,
    toggleNavHide: PropTypes.func.isRequired,
    pauseTimer: PropTypes.func.isRequired,
    resetInactiveTimer: PropTypes.func.isRequired,
    titleImage: propTypes.titleImage.isRequired,
};

export default TextVideo;

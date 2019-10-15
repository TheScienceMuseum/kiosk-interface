/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';

import '../../styles/components/pages/Video.scss';
import { Player, ControlBar } from 'video-react';
import has from 'lodash.has';
import propTypes from '../../propTypes';
import createBodyTag from '../../utils/createBodyTag';

/*
 * Video:
 *
 *
 * @author Gavin Cockrem <gavin@joipolloi.com.
 * @package sciencemuseum-kiosk-interface
 */


class Video extends React.Component {
    constructor(props) {
        super(props);
        this.asset = props.asset;
        this.titleImage = props.titleImage;
        this.handleCloseButton = props.handleCloseButton;
        this.onPause = this.onPause.bind(this);
        this.onPlay = this.onPlay.bind(this);
        this.handlePlayerState = this.handlePlayerState.bind(this);
        this.handleBSL = this.handleBSL.bind(this);
        this.handleSubtitles = this.handleSubtitles.bind(this);
        this.getBslClass = this.getBslClass.bind(this);
        this.getSubClass = this.getSubClass.bind(this);
        this.beginPlay = this.beginPlay.bind(this);
        this.endPlay = this.endPlay.bind(this);
        this.state = {
            showBSL: has(this.asset, 'bslSource'),
            showSubtitles: has(this.asset, 'subtitlesSource'),
            bslEnabled: false,
            subtitlesEnabled: true,
            played: false,
            hasClosed: false,
            bslFadeAnim: false,
        };
        this.getBSLOverClass = this.getBSLOverClass.bind(this);
        this.handleBSLtimeOut = this.handleBSLtimeOut.bind(this);
        this.seekTime = false;
    }

    componentDidMount() {
        setTimeout(() => {
            this.disableSubTitles();
            this.seekEventHandle();
        }, 100);
        const {
            autoPlay, resetInactiveTimer, pauseTimer,
        } = this.props;

        if (!autoPlay) {
            resetInactiveTimer();
        } else {
            pauseTimer();
        }
    }

    onPause() {
        const { resetInactiveTimer } = this.props;
        resetInactiveTimer();
    }

    onPlay() {
        const { pauseTimer } = this.props;
        pauseTimer();
    }

    getBSLOverClass() {
        const { bslFadeAnim } = this.state;
        let bsl = 'bslOver';
        if (bslFadeAnim) {
            bsl += ' open';
        }
        return bsl;
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
            posterImg = this.titleImage.assetSource;
        }
        return {
            backgroundImage: `url('${posterImg}')`,
        };
    }

    seekEventHandle() {
        this.player.video.video.addEventListener('loadeddata', () => {
            if (this.seekTime) {
                this.player.seek(this.seekTime);
                this.seekTime = false;
                this.player.video.video.play();
            }
        });
    }

    handleBSL() {
        const { bslEnabled } = this.state;

        if (bslEnabled) {
            // disable
            this.setState({ bslEnabled: false, bslFadeAnim: true }, () => {
                setTimeout(this.handleBSLtimeOut, 500);
                setTimeout(() => {
                    this.setState({ bslFadeAnim: false });
                }, 1000);
            });
            return;
        }

        // enable & change source
        this.setState({ bslEnabled: true, bslFadeAnim: true }, () => {
            setTimeout(this.handleBSLtimeOut, 500);
            setTimeout(() => {
                this.setState({ bslFadeAnim: false });
            }, 1000);
        });
    }

    handleBSLtimeOut() {
        const { bslEnabled } = this.state;
        const playerState = this.player.getState();
        this.seekTime = playerState.player.currentTime;

        if (!bslEnabled) {
            // disable
            this.player.video.video.src = this.asset.assetSource;
            this.player.load(this.asset.assetSource);
            // this.player.seek(playerState.player.currentTime);
            return;
        }

        // enable & change source
        this.player.video.video.src = this.asset.bslSource;
        this.player.load(this.asset.bslSource);
        // this.player.seek(playerState.player.currentTime);
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

    disableSubTitles() {
        this.player.video.video.textTracks[0].mode = 'disabled';
    }

    beginPlay() {
        this.setState({ played: true, hasClosed: false });
        const { pauseTimer } = this.props;
        pauseTimer();
        this.player.play();
    }

    endPlay() {
        this.setState({ played: false, hasClosed: true });
        const { resetInactiveTimer } = this.props;
        resetInactiveTimer();
        this.player.pause();
    }

    render() {
        const {
            showBSL, showSubtitles, played, hasClosed,
        } = this.state;
        const {
            autoPlay, date, title, subtitle,
        } = this.props;
        let showVideo = '';
        let showPoster = 'poster ';
        let articleStyle = '';
        if ((autoPlay || played) && !hasClosed) {
            showVideo = 'show';
            showPoster = 'poster hide';
            articleStyle = 'open';
        }
        return (
            <React.Fragment>
                <div className={this.getBSLOverClass()} />
                <div className={`Page PageVideo ${articleStyle}`}>
                    { typeof date !== 'undefined' && (
                        <div className="dateCircle">
                            { date }
                        </div>
                    ) }
                    <button
                        type="button"
                        className={showPoster}
                        onClick={this.beginPlay}
                        style={this.getPosterStyle()}
                    >
                        <div className="Image--withGrad" />
                        <div className="PageTitle__Content">
                            <h1>{title}</h1>
                            {subtitle && (
                                <h3
                                    dangerouslySetInnerHTML={{ __html: createBodyTag(subtitle) }}
                                />
                            )}
                        </div>
                    </button>
                    <Player
                        ref={(node) => { this.player = node; }}
                        autoPlay={!!autoPlay}
                        // crossOrigin="anonymous"
                        selectedTextTrack={this.getSubTrack().value}
                        poster="/media/white1x1.jpg"
                        className={showVideo}
                        onEnded={this.onPause}
                        onPause={this.onPause}
                        onPlay={this.onPlay}
                    >
                        <source src={this.asset.assetSource} type="video/mp4" />
                        {
                            showSubtitles && (
                                <track
                                    kind="captions"
                                    src={this.asset.subtitlesSource}
                                    srcLang="en"
                                    label="English"
                                    default
                                />
                            )
                        }
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
                                        <span className="inner bsl" />
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
                                        <span className="inner subtitles" />
                                    </button>
                                )
                            }
                            <button
                                type="button"
                                className="kioskPlayerControl end close"
                                onClick={this.endPlay}
                            >
                                <span className="inner close" />
                            </button>
                        </ControlBar>
                    </Player>
                </div>
            </React.Fragment>
        );
    }
}

Video.propTypes = {
    asset: propTypes.videoAsset.isRequired,
    handleCloseButton: PropTypes.func.isRequired,
    pauseTimer: PropTypes.func.isRequired,
    resetInactiveTimer: PropTypes.func.isRequired,
    autoPlay: PropTypes.bool.isRequired,
    date: PropTypes.bool,
    title: PropTypes.string,
    titleImage: propTypes.titleImage.isRequired,
    subtitle: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string)])
        .isRequired,
};

Video.defaultProps = {
    date: undefined,
    title: '',
};

export default Video;

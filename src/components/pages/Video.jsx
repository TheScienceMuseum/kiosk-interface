import React from 'react';
import PropTypes from 'prop-types';

import '../../styles/components/pages/Video.scss';
import { Player, ControlBar } from 'video-react';
import has from 'lodash.has';
import propTypes from '../../propTypes';
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

        this.state = {
            showBSL: has(this.asset, 'bslSource'),
            showSubtitles: has(this.asset, 'subtitlesSource'),
            bslEnabled: false,
            subtitlesEnabled: false,
            played: false,
        };
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
        const posterImg = this.titleImage.assetSource ? this.titleImage.assetSource : null;
        return {
            backgroundImage: `url('${posterImg}')`,
        };
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

    disableSubTitles() {
        this.player.video.video.textTracks[0].mode = 'disabled';
    }

    beginPlay() {
        this.setState({ played: true });
        this.player.play();
    }

    render() {
        const { showBSL, showSubtitles, played } = this.state;
        const { autoPlay, date, title } = this.props;
        // console.log('this.asset: ', this.asset);
        let showVideo = '';
        let showPoster = 'poster ';
        let articleStyle = '';
        if (autoPlay || played) {
            showVideo = 'show';
            showPoster = 'poster hide';
            articleStyle = 'open';
        }
        return (
            <React.Fragment>
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
                        </div>
                    </button>
                    <Player
                        ref={(node) => { this.player = node; }}
                        autoPlay={!!autoPlay}
                        // crossOrigin="anonymous"
                        selectedTextTrack={this.getSubTrack().value}
                        poster={this.titleImage.assetSource ? this.titleImage.assetSource : null}
                        className={showVideo}
                        onEnded={this.onPause}
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
                            <button
                                type="button"
                                className="kioskPlayerControl end close"
                                onClick={this.handleCloseButton}
                            >
                                Close
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
};

Video.defaultProps = {
    date: undefined,
    title: '',
};

export default Video;

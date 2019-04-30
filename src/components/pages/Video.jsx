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
        this.handleCloseButton = props.handleCloseButton;
        this.onPause = this.onPause.bind(this);
        this.onPlay = this.onPlay.bind(this);
        this.handlePlayerState = this.handlePlayerState.bind(this);
        this.handleBSL = this.handleBSL.bind(this);
        this.handleSubtitles = this.handleSubtitles.bind(this);
        this.getBslClass = this.getBslClass.bind(this);
        this.getSubClass = this.getSubClass.bind(this);

        this.state = {
            showBSL: has(this.asset, 'bslSource'),
            showSubtitles: has(this.asset, 'subtitlesSource'),
            bslEnabled: false,
            subtitlesEnabled: false,
        };
    }

    componentDidMount() {
        // this.player.subscribeToStateChange(this.handlePlayerState);
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
        const { subtitlesEnabled } = this.state;

        if (this.player.video.video.textTracks[0].mode === 'disabled') {
            this.player.video.video.textTracks[0].mode = 'showing';
        } else {
            this.player.video.video.textTracks[0].mode = 'disabled';
        }
        this.setState({ subtitlesEnabled: !subtitlesEnabled });
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

    render() {
        const { showBSL, showSubtitles } = this.state;
        const { autoPlay } = this.props;
        // console.log('this.asset: ', this.asset);
        return (
            <div className="Page PageVideo">
                <Player
                    ref={(node) => { this.player = node; }}
                    autoPlay={!!autoPlay}
                    // crossOrigin="anonymous"
                    selectedTextTrack={this.getSubTrack().value}
                    poster={this.asset.posterImage ? this.asset.posterImage : null}
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
        );
    }
}

Video.propTypes = {
    asset: propTypes.videoAsset.isRequired,
    handleCloseButton: propTypes.isRequired,
    pauseTimer: PropTypes.func.isRequired,
    resetInactiveTimer: PropTypes.func.isRequired,
    autoPlay: PropTypes.bool.isRequired,
};

export default Video;

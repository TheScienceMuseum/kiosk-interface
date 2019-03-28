import React from 'react';
import PropTypes from 'prop-types';

import '../../styles/components/pages/Video.scss';
import { Player, ControlBar } from 'video-react';
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
    }

    componentDidMount() {
        this.player.subscribeToStateChange(this.handlePlayerState);
    }

    onPause() {
        const { resetInactiveTimer } = this.props;
        resetInactiveTimer();
    }

    onPlay() {
        const { pauseTimer } = this.props;
        pauseTimer();
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
        return (
            <div className="Page PageVideo">
                <Player ref={(node) => { this.player = node; }} autoPlay>
                    <source src={this.asset.assetSource} type="video/mp4" />
                    <ControlBar autoHide={false} className="kioskControlBar">
                        <button type="button" className="kioskPlayerControl end subtitles">
                            Enable/Disable subtitles
                        </button>
                        <button type="button" className="kioskPlayerControl end bsl">
                            Enable/Disable BSL
                        </button>
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
    asset: propTypes.asset.isRequired,
    handleCloseButton: propTypes.isRequired,
    pauseTimer: PropTypes.func.isRequired,
    resetInactiveTimer: PropTypes.func.isRequired,
};

export default Video;

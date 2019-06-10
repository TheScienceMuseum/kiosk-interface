/* eslint-disable react/forbid-prop-types */
/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';
import PropTypes from 'prop-types';

import { Media, Player, controls, utils } from 'react-media-player';

import propTypes from '../../propTypes';

import '../../styles/components/pages/Image.scss';
import '../../styles/components/pages/Audio.scss';
import createBodyTag from '../../utils/createBodyTag';

const {
    PlayPause,
    CurrentTime,
    Progress,
    SeekBar,
    Duration,
    MuteUnmute,
    Volume,
    Fullscreen,
} = controls;

/*
 * Image.jsx:
 *
 *
 * @author Gavin Cockrem <gavin@joipolloi.com.
 * @package sciencemuseum-kiosk-interface
 */


class Audio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            transcriptShowing: false,
        };
        this.onTimeUpdate = this.onTimeUpdate.bind(this);
        this.onPause = this.onPause.bind(this);
        this.onPlay = this.onPlay.bind(this);
    }

    getSourceTextStyle() {
        const { transcriptShowing } = this.state;

        if (transcriptShowing) {
            return {
                height: 0,
                overflow: 'hidden',
            };
        }

        return {};
    }


    getAudioStyle() {
        const { transcriptShowing } = this.state;

        if (transcriptShowing) {
            return {};
        }

        return {
            height: 0,
            overflow: 'hidden',
        };
    }

    handleTranscriptClick() {
        const { transcriptShowing } = this.state;
        if (transcriptShowing) {
            this.closeTranscript();
            return;
        }
        this.openTranscript();
    }

    openTranscript() {
        this.setState({ transcriptShowing: true });
    }

    closeTranscript() {
        this.setState({ transcriptShowing: false });
    }

    onPlay(d) {

    }

    onPause(d) {

    }

    onTimeUpdate(d) {
        console.log(d);
        //d.currentTime
        //d.duration
    }

    render() {
        const { nameText, sourceText, audio } = this.props;
        console.log(audio);
        /* eslint-disable react/no-danger */
        return (
            <div>
                <div className="sourceText" style={this.getSourceTextStyle()}>
                    <h2>{nameText}</h2>
                    <div
                        className="ContentContainer__body"
                        dangerouslySetInnerHTML={{ __html: createBodyTag(sourceText) }}
                    />
                </div>
                <div className="audio">
                    <Media>
                        <div className="media">
                            <Player src={audio.assetSource} onTimeUpdate={this.onTimeUpdate} onPlay={this.onPlay} onPause={this.onPause}  className="media-player" />
                            <div className="media-controls">
                                <div className="audioIcon" />
                                <PlayPause className="playPause" />
                                
                                <Progress />
                                <SeekBar />
                                <Duration />
                            </div>
                        </div>
                    </Media>
                    <button type="button" className="transcriptBtn" onClick={this.openTranscript.bind(this)}>
                        transcript
                    </button>
                    <div className="transcript" style={this.getAudioStyle()}>
                        Something
                    </div>
                </div>
            </div>
        );
        /* eslint-enable react/no-danger */
    }
}

Audio.propTypes = {
    nameText: PropTypes.string.isRequired,
    sourceText: PropTypes.string.isRequired,
    audio: PropTypes.any.isRequired,
};

export default Audio;

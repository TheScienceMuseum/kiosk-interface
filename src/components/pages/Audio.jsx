/* eslint-disable spaced-comment */
/* eslint-disable react/sort-comp */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';
import ScrollArea from 'react-scrollbar';
import PropTypes from 'prop-types';

// eslint-disable-next-line object-curly-newline
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
            trackPercentage: 0,
            playing: false,
            playButtonClasses: 'playPauseContainer',
        };
        this.onTimeUpdate = this.onTimeUpdate.bind(this);
        this.onPause = this.onPause.bind(this);
        this.onPlay = this.onPlay.bind(this);
        this.getBarStyle = this.getBarStyle.bind(this);
        this.getPlayStyle = this.getPlayStyle.bind(this);
    }

    componentDidMount() {
        this.getPlayStyle();
    }

    getSourceTextStyle() {
        const { transcriptShowing } = this.state;

        if (transcriptShowing) {
            return {
                opacity: 0,
                display: 'none',
                visibility: 'hidden',
            };
        }

        return {
            opacity: 1,
            visibility: 'visible',
        };
    }


    getAudioStyle() {
        const { transcriptShowing } = this.state;

        if (transcriptShowing) {
            return {
                visibility: 'visible',
                opacity: 1,
            };
        }

        return {
            opacity: 0,
            visibility: 'hidden',
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
        const { pauseTimer } = this.props;
        pauseTimer();
        this.setState({ playing: true }, () => {
            this.getPlayStyle();
        });
    }

    onPause(d) {
        const { resetInactiveTimer } = this.props;
        resetInactiveTimer();
        this.setState({ playing: false }, () => {
            this.getPlayStyle();
        });
    }

    onTimeUpdate(d) {
        const perc = (d.currentTime / d.duration) * 100;
        this.setState({ trackPercentage: perc });
        this.getPlayStyle();
    }

    getBarStyle() {
        const { trackPercentage } = this.state;
        // console.log(trackPercentage);
        return {
            width: `${trackPercentage}%`,
        };
    }

    getPlayStyle() {
        let classes = 'playPauseContainer';
        const { playing } = this.state;
        if (!playing) {
            classes = `${classes} paused`;
        }
        this.setState({ playButtonClasses: classes });
    }

    getAudioContainerClass() {
        const { transcriptShowing } = this.state;
        if (transcriptShowing) {
            return 'audio transcript-open';
        }
        return 'audio';
    }

    render() {
        const { nameText, sourceText, audio } = this.props;
        const { transcriptShowing, playButtonClasses } = this.state;
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
                <div className={this.getAudioContainerClass()}>
                    <h3>{audio.soundTitle}</h3>
                    <div className="controller">
                        <Media>
                            <div className="media">
                                <Player src={audio.assetSource} onTimeUpdate={this.onTimeUpdate} onPlay={this.onPlay} onPause={this.onPause} className="media-player" />
                                <div className="media-controls">
                                    <div className="audioIcon" />
                                    <div className={playButtonClasses}>
                                        <PlayPause className="playPause" />
                                    </div>
                                    <Progress />
                                    <div className="seekBarProgress">
                                        <SeekBar />
                                        <div className="bar" style={this.getBarStyle()} />
                                    </div>
                                    <Duration />
                                </div>
                            </div>
                        </Media>
                        { !transcriptShowing && (
                            <button type="button" className="transcriptBtn" onClick={this.openTranscript.bind(this)}>
                                transcript
                            </button>
                        )}
                        { transcriptShowing && (
                            <button type="button" className="transcriptBtn open" onClick={this.closeTranscript.bind(this)}>
                                close transcript
                            </button>
                        )}
                    </div>
                    <div
                        className="transcript"
                        style={this.getAudioStyle()}
                        onPointerUp={(e) => {
                            // Ignore pointer up for hammerjs swiping on the model viewer
                            e.stopPropagation();
                        }}
                    >
                        <ScrollArea
                            speed={0.8}
                            className="area"
                            contentClassName="content"
                            horizontal={false}
                        >
                            <div>{audio.transcript}</div>
                        </ScrollArea>
                    </div>
                </div>
            </div>
        );
        /* eslint-enable react/no-danger */
    }
}

Audio.propTypes = {
    nameText: PropTypes.string.isRequired,
    sourceText: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
    ]).isRequired,
    audio: PropTypes.any.isRequired,
    pauseTimer: PropTypes.func.isRequired,
    resetInactiveTimer: PropTypes.func.isRequired,
};

export default Audio;

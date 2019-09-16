/* eslint-disable react/no-array-index-key */
/* eslint-disable spaced-comment */
/* eslint-disable react/sort-comp */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable jsx-a11y/media-has-caption */
import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';

// eslint-disable-next-line object-curly-newline
import { Media, Player, controls, utils } from 'react-media-player';

import propTypes from '../../propTypes';

import 'react-perfect-scrollbar/dist/css/styles.css';
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
            transcriptScrolling: false,
            titleFadeIn: false,
        };
        this.onTimeUpdate = this.onTimeUpdate.bind(this);
        this.onPause = this.onPause.bind(this);
        this.onPlay = this.onPlay.bind(this);
        this.getBarStyle = this.getBarStyle.bind(this);
        this.getPlayStyle = this.getPlayStyle.bind(this);
        this.scrollRef = React.createRef();
        this.actionScrollDown = this.actionScrollDown.bind(this);
        this.actionScrollUp = this.actionScrollUp.bind(this);
        this.scrollTranscriptDown = this.scrollTranscriptDown.bind(this);
        this.scrollTranscriptUp = this.scrollTranscriptUp.bind(this);
        this.stopScrolling = this.stopScrolling.bind(this);
    }

    componentDidMount() {
        this.getPlayStyle();
    }

    getSourceTextClass() {
        const { transcriptShowing, titleFadeIn } = this.state;
        let sourceClass = 'sourceTextContainer';
        if (transcriptShowing) {
            sourceClass += ' closed';
        }
        if (titleFadeIn && !transcriptShowing) {
            sourceClass += ' audioFadeIn';
        }
        return sourceClass;
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

    openTranscript() {
        this.setState({ transcriptShowing: true, titleFadeIn: true });
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

    stopScrolling() {
        this.setState({ transcriptScrolling: false });
    }

    scrollTranscriptDown() {
        this.setState({ transcriptScrolling: true }, () => {
            this.actionScrollDown();
        });
    }

    scrollTranscriptUp() {
        this.setState({ transcriptScrolling: true }, () => {
            this.actionScrollUp();
        });
    }

    actionScrollUp() {
        const { transcriptScrolling } = this.state;
        if (!transcriptScrolling) return;
        setTimeout(() => {
            if (!this || !this.scrollRef) return;
            const curScroll = this.scrollRef.scrollTop;
            this.scrollRef.scrollTop = curScroll - 10;
            this.actionScrollUp();
        }, 10);
    }

    actionScrollDown() {
        const { transcriptScrolling } = this.state;
        if (!transcriptScrolling) return;
        setTimeout(() => {
            if (!this || !this.scrollRef) return;
            const curScroll = this.scrollRef.scrollTop;
            this.scrollRef.scrollTop = curScroll + 10;
            this.actionScrollDown();
        }, 10);
    }

    render() {
        const { nameText, sourceText, audio } = this.props;
        const { transcriptShowing, playButtonClasses } = this.state;
        /* eslint-disable react/no-danger */
        return (
            <div className={this.getSourceTextClass()}>
                <div className="sourceText">
                    <h2>{nameText}</h2>
                    <div
                        className="ContentContainer__body"
                        dangerouslySetInnerHTML={{ __html: createBodyTag(sourceText) }}
                    />
                </div>
                <div className={this.getAudioContainerClass()}>
                    <h3>{audio.nameText}</h3>
                    <div className="controller">
                        <Media>
                            <div className="media">
                                <Player
                                    src={audio.assetSource}
                                    onTimeUpdate={this.onTimeUpdate}
                                    onPlay={this.onPlay}
                                    onPause={this.onPause}
                                    className="media-player"
                                />
                                <div className="media-controls">
                                    <div className="audioIcon" />
                                    <div className={playButtonClasses}>
                                        <PlayPause className="playPause">
                                            <i className="icon-SoundPlay" />
                                        </PlayPause>
                                        <i className="icon-SoundPlay" />
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
                            <button
                                type="button"
                                className="transcriptBtn"
                                onClick={this.openTranscript.bind(this)}
                            >
                                Transcript
                            </button>
                        )}
                        { transcriptShowing && (
                            <button
                                type="button"
                                className="transcriptBtn open"
                                onClick={this.closeTranscript.bind(this)}
                            >
                                Close transcript
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
                        <button
                            type="button"
                            className="perfectScrollButton perfectScrollUp"
                            onMouseDown={this.scrollTranscriptUp}
                            onMouseUp={this.stopScrolling}
                            onTouchStart={this.scrollTranscriptUp}
                            onTouchEnd={this.stopScrolling}
                        />
                        <PerfectScrollbar
                            options={{
                                suppressScrollX: true,
                            }}
                            className="area"
                            containerRef={(containerRef) => { this.scrollRef = containerRef; }}
                        >
                            <div className="content">
                                {audio.transcript.split('\n').map((item, key) => (
                                    <span key={key}>
                                        {item}
                                        <br />
                                    </span>
                                ))
                                }
                            </div>
                        </PerfectScrollbar>
                        <button
                            type="button"
                            className="perfectScrollButton perfectScrollDown"
                            onMouseDown={this.scrollTranscriptDown}
                            onMouseUp={this.stopScrolling}
                            onTouchStart={this.scrollTranscriptDown}
                            onTouchEnd={this.stopScrolling}
                        />
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

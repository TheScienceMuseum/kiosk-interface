/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';

import PerfectScrollbar from 'react-perfect-scrollbar';
import { Player, ControlBar } from 'video-react';
import has from 'lodash.has';

import { Layouts } from '../../utils/Constants';
import '../../styles/components/pages/TextImage.scss';
import '../../styles/components/pages/TextVideo.scss';
import propTypes from '../../propTypes';
import createBodyTag from '../../utils/createBodyTag';

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
            canPlay: false,
            transcriptShowing: false,
            transcriptScrolling: false,
            titleFadeIn: false,
            bslFadeAnim: false,
        };
        this.scrollRef = React.createRef();
        this.handleHideContent = this.handleHideContent.bind(this);

        this.onPause = this.onPause.bind(this);
        this.onPlay = this.onPlay.bind(this);
        this.handlePlayerState = this.handlePlayerState.bind(this);
        this.handleBSL = this.handleBSL.bind(this);
        this.handleSubtitles = this.handleSubtitles.bind(this);
        this.getBslClass = this.getBslClass.bind(this);
        this.getSubClass = this.getSubClass.bind(this);
        this.beginPlay = this.beginPlay.bind(this);
        this.endPlay = this.endPlay.bind(this);
        this.scrollTranscriptDown = this.scrollTranscriptDown.bind(this);
        this.scrollTranscriptUp = this.scrollTranscriptUp.bind(this);
        this.stopScrolling = this.stopScrolling.bind(this);
        this.actionScrollUp = this.actionScrollUp.bind(this);
        this.actionScrollDown = this.actionScrollDown.bind(this);
        this.getBSLOverClass = this.getBSLOverClass.bind(this);
        this.handleBSLtimeOut = this.handleBSLtimeOut.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            // this.disableSubTitles();
            this.setState({
                canPlay: true,
            });
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
        if (window.appJson.aspect_ratio === '9:16') {
            if (this.titleImage.thumbnail) {
                return {
                    backgroundImage: `url('${this.titleImage.thumbnail}')`,
                };
            }
        }
        let posterImg = this.titleImage.assetSource ? this.titleImage.assetSource : null;
        if (posterImg) {
            posterImg = this.titleImage.assetSource;
        }
        return {
            backgroundImage: `url('${posterImg}')`,
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

        if (!bslEnabled) {
            // disable
            this.player.video.video.src = this.asset.assetSource;
            this.player.load(this.asset.assetSource);
            this.player.seek(playerState.player.currentTime);
            return;
        }

        // enable & change source
        this.player.video.video.src = this.asset.bslSource;
        this.player.load(this.asset.bslSource);
        this.player.seek(playerState.player.currentTime);
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
        const { canPlay } = this.state;
        const { toggleNavHide } = this.props;
        if (canPlay) {
            if (window.appJson.aspect_ratio === '16:9') {
                toggleNavHide(true);
            }
            this.setState({ played: true });
            this.player.play();
        }
    }

    endPlay() {
        const { toggleNavHide } = this.props;
        if (window.appJson.aspect_ratio === '16:9') {
            toggleNavHide(false);
        }
        this.player.pause();
        this.setState({ played: false });
        const { resetInactiveTimer } = this.props;
        resetInactiveTimer();
    }

    openTranscript() {
        this.setState({ transcriptShowing: true, titleFadeIn: true });
    }

    closeTranscript() {
        this.setState({ transcriptShowing: false });
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
        const {
            title, content, layout,
        } = this.props;

        const { contentHidden, transcriptShowing } = this.state;
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

        const PosterImg = (
            window.appJson.aspect_ratio === '9:16'
                ? this.titleImage.thumbnail : this.titleImage.assetSource
        );

        /* eslint-disable react/no-danger */
        return (
            <div className={mainClass}>
                <div className={this.getBSLOverClass()} />
                <div className="ImageContainer">
                    <button
                        type="button"
                        className={showPoster}
                        onClick={this.beginPlay}
                        style={this.getPosterStyle()}
                    >
                        <span className="play" />
                    </button>
                    <Player
                        ref={(node) => { this.player = node; }}
                        // crossOrigin="anonymous"
                        selectedTextTrack={this.getSubTrack().value}
                        poster={PosterImg}
                        className={showVideo}
                        onEnded={this.onPause}
                        onPause={this.onPause}
                        onPlay={this.onPlay}
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
                <div className="ContentContainer">
                    <div className={this.getSourceTextClass()}>
                        <div className="sourceText">
                            <h2>{title}</h2>
                            <div
                                className="ContentContainer__body"
                                dangerouslySetInnerHTML={{ __html: createBodyTag(content) }}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={this.beginPlay}
                            className="ContentContainer__play"
                        >
                            Play Video
                        </button>
                        { (!transcriptShowing && this.asset.transcript) && (
                            <button
                                type="button"
                                className="transcriptBtn"
                                onClick={this.openTranscript.bind(this)}
                            >
                                Transcript
                            </button>
                        )}
                        { (transcriptShowing && this.asset.transcript) && (
                            <button
                                type="button"
                                className="transcriptBtn open"
                                onClick={this.closeTranscript.bind(this)}
                            >
                                Close transcript
                            </button>
                        )}
                        {this.asset.transcript && (
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
                                    containerRef={
                                        (containerRef) => { this.scrollRef = containerRef; }
                                    }
                                >
                                    <div className="content">
                                        {this.asset.transcript.split('\n').map((item, key) => (
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
                        )}
                    </div>
                    <div className="ImageCaption">
                        <h3>{this.titleImage.nameText}</h3>
                        <p>{this.titleImage.sourceText}</p>
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

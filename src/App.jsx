import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import IdleTimer from 'react-idle-timer';

import './styles/App.scss';

import Menu from './components/Menu';
import Article from './components/Article';
import { AppStates, Environments } from './utils/Constants';
import Attractor from './components/Attractor';


class App extends Component {
    constructor(props) {
        super(props);

        const singleArticleMode = (props.content.contents.length === 1);

        this.state = {
            activeArticle: null,
            location: AppStates.ATTRACTOR,
            singleArticleMode,
            initial: true,
        };
        this.setActiveArticle = this.setActiveArticle.bind(this);
        this.loadArticle = this.loadArticle.bind(this);
        this.onStart = this.start.bind(this);

        this.pauseTimer = this.pauseTimer.bind(this);
        this.resetTimer = this.resetTimer.bind(this);
        this.onIdle = this.onIdle.bind(this);

        this.idleTimer = null;
        this.idleTimeout = 60; // in seconds

        // this.startInactiveTimer = this.startInactiveTimer.bind(this);
        // this.pauseTimer = this.pauseTimer.bind(this);

        // this.inactiveTimer = null;
        // this.timeout = 999;
    }

    onIdle(e) {
        console.log('user is idle', e);
        this.setState({ location: AppStates.ATTRACTOR, initial: true });
    }

    setActiveArticle(activeArticle) {
        // console.log('App: setActiveArticle: activeArticle: ', activeArticle);
        this.setState({ activeArticle });
    }

    getPage() {
        const {
            activeArticle, location, singleArticleMode, initial,
        } = this.state;
        const { content } = this.props;

        switch (location) {
        case AppStates.ATTRACTOR:
            return (
                <Attractor {...content.titles} start={this.onStart} />
            );
        case AppStates.MENU:
            return (
                <Menu
                    titles={content.titles}
                    contents={content.contents}
                    location={location}
                    activeArticle={activeArticle}
                    setActiveArticle={this.setActiveArticle}
                    loadArticle={this.loadArticle}
                    resetInactiveTimer={this.resetTimer}
                    initial={initial}
                />
            );
        default:
            return (
                <Article
                    contents={content.contents}
                    articleID={location}
                    loadArticle={this.loadArticle}
                    resetInactiveTimer={this.resetTimer}
                    pauseTimer={this.pauseTimer}
                    singleArticleMode={singleArticleMode}
                />
            );
        }
    }

    start() {
        const { content } = this.props;
        const { singleArticleMode } = this.state;
        console.log('App: start: ', content.contents.length);
        const startState = !singleArticleMode ? AppStates.MENU : content.contents[0].articleID;
        this.setState({
            location: startState,
            initial: true,
            activeArticle: null,
        },
        this.resetTimer);
    }

    loadArticle(articleID) {
        // console.log('App: loadArticle: articleID: ', articleID);
        // this.startInactiveTimer(true);
        this.setState({ location: articleID, initial: false });
    }

    pauseTimer() {
        console.log('App: pauseTimer: time: ', this.idleTimer.getRemainingTime());
        this.idleTimer.pause();
    }

    resetTimer() {
        console.log('App: resetTimer: time: ', this.idleTimer.getRemainingTime());
        this.idleTimer.reset();
    }


    render() {
        const {
            label, version, env, clientVersion,
        } = this.props;
        const { location } = this.state;

        // console.log('App: render: ', this.state.inactiveTime);

        return (
            <div className="App">
                <IdleTimer
                    ref={(ref) => { this.idleTimer = ref; }}
                    element={document}
                    onIdle={this.onIdle}
                    debounce={250}
                    timeout={1000 * this.idleTimeout}
                />
                {env !== Environments.PRODUCTION
                && (
                    <div className="DebugPanel">
                        <p>{`Package Name: ${label}`}</p>
                        <p>{`Package Version: ${version}`}</p>
                        <p>{`Client Environment: ${env}`}</p>
                        <p>{`Client Version: ${clientVersion}`}</p>
                    </div>
                )
                }

                <TransitionGroup className="transition-group">
                    <CSSTransition
                        key={location}
                        timeout={{ enter: 300, exit: 300 }}
                        classNames="fade"
                    >
                        { this.getPage() }
                    </CSSTransition>
                </TransitionGroup>
            </div>

        );
    }
}

App.propTypes = {
    content: PropTypes.shape().isRequired,
    label: PropTypes.string.isRequired,
    version: PropTypes.number.isRequired,
    env: PropTypes.oneOf(Object.values(Environments)),
    clientVersion: PropTypes.string,
};

App.defaultProps = {
    env: Environments.BROWSER,
    clientVersion: 'n/a',
};

export default App;

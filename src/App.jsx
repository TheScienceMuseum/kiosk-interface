import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import IdleTimer from 'react-idle-timer';

import './styles/App.scss';

import Menu from './components/Menu';
import Article from './components/Article';
import { AppStates, Environments } from './utils/Constants';
import Attractor from './components/Attractor';
import ErrorBoundary from './components/ErrorBoundary';
import ModelLoader from './components/pages/Model/PreLoader';


class App extends Component {
    constructor(props) {
        super(props);

        const singleArticleMode = (props.content.contents.length === 1);

        this.state = {
            activeArticle: null,
            location: AppStates.ATTRACTOR,
            singleArticleMode,
            initial: true,
            autoPlayNext: false,
        };
        this.setActiveArticle = this.setActiveArticle.bind(this);
        this.loadArticle = this.loadArticle.bind(this);
        this.onStart = this.start.bind(this);

        this.pauseTimer = this.pauseTimer.bind(this);
        this.resetTimer = this.resetTimer.bind(this);
        this.onIdle = this.onIdle.bind(this);

        this.idleTimer = null;
        this.idleTimeout = props.content.titles.idleTimeout || 120; // in seconds

        ModelLoader.loadModels();
    }

    onIdle(e) {
        console.log('user is idle', e);
        this.setState({ location: AppStates.ATTRACTOR, initial: true });
    }

    getAspectRotation() {
        // eslint-disable-next-line camelcase
        const { aspect_ratio } = this.props;
        // eslint-disable-next-line camelcase
        switch (aspect_ratio) {
        case '16:9':
            return 'landscape';
        case '9:16':
            return 'portrait';
        default:
            return 'landscape';
        }
    }

    getAspectClass() {
        return this.getAspectRotation();
    }

    setActiveArticle(activeArticle) {
        // console.log('App: setActiveArticle: activeArticle: ', activeArticle);
        this.setState({ activeArticle });
    }

    getPage() {
        const {
            activeArticle, location, singleArticleMode, initial, autoPlayNext,
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
                    aspect={this.getAspectRotation()}
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
                    autoPlay={autoPlayNext}
                    aspect={this.getAspectRotation()}
                />
            );
        }
    }

    appClasses() {
        let classes = '';
        classes += this.getAspectClass();
        return classes;
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

    loadArticle(articleID, autoPlay = false) {
        // console.log('App: loadArticle: articleID: ', articleID);
        // this.startInactiveTimer(true);
        this.setState({ location: articleID, initial: false, autoPlayNext: autoPlay });
    }

    pauseTimer() {
        this.idleTimer.pause();
    }

    resetTimer() {
        this.idleTimer.reset();
    }


    render() {
        const {
            label, version, env, clientVersion,
        } = this.props;
        const { location } = this.state;

        // console.log('App: render: ', this.state.inactiveTime);

        return (
            <ErrorBoundary>
                <div className={`App ${this.appClasses()}`}>
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
                            timeout={{ enter: 1200, exit: 1200 }}
                            classNames="grow"
                        >
                            {this.getPage()}
                        </CSSTransition>
                    </TransitionGroup>
                </div>
            </ErrorBoundary>
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

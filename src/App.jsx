import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import './styles/App.scss';

import Menu from './components/Menu';
import Article from './components/Article';
import { AppStates, Environments } from './Constants';
import Attractor from './components/Attractor';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeArticle: null,
            location: AppStates.ATTRACTOR,
            inactiveTime: 0,
        };
        this.setActiveArticle = this.setActiveArticle.bind(this);
        this.loadArticle = this.loadArticle.bind(this);
        this.onStart = this.start.bind(this);
        this.startInactiveTimer = this.startInactiveTimer.bind(this);
        this.stopTimer = this.stopTimer.bind(this);

        this.inactiveTimer = null;
        this.timeout = 999;
    }

    setActiveArticle(activeArticle) {
        // console.log('App: setActiveArticle: activeArticle: ', activeArticle);
        this.setState({ activeArticle });
    }

    getPage() {
        const { activeArticle, location } = this.state;
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
                    resetInactiveTimer={this.startInactiveTimer}
                />
            );
        default:
            return (
                <Article
                    contents={content.contents}
                    articleID={location}
                    loadArticle={this.loadArticle}
                    resetInactiveTimer={this.startInactiveTimer}
                    stopTimer={this.stopTimer}
                />
            );
        }
    }

    startInactiveTimer(reset) {
        let { inactiveTime } = this.state;
        inactiveTime = (reset) ? 0 : inactiveTime + 1;

        if (this.inactiveTimer) clearTimeout(this.inactiveTimer);

        if (inactiveTime > this.timeout) {
            this.kioskTimeout();
        } else {
            this.setState({ inactiveTime });
            this.inactiveTimer = setTimeout(this.startInactiveTimer.bind(this), 1000);
        }

    }

    stopTimer() {
        clearTimeout(this.inactiveTimer);
        //this.setState( {inactive})
    }

    kioskTimeout() {
        this.setState({ location: AppStates.ATTRACTOR, inactiveTime: 0 });
    }

    start() {
        this.setState({ location: AppStates.MENU }, this.startInactiveTimer);
    }

    loadArticle(articleID) {
        // console.log('App: loadArticle: articleID: ', articleID);
        this.startInactiveTimer(true);
        this.setState({ location: articleID });
    }

    render() {
        const {
            label, version, env, clientVersion,
        } = this.props;
        const { location } = this.state;

        return (

            <div className="App">
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

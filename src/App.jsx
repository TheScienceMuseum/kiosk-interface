import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import './styles/App.scss';

import Menu from './components/Menu';
import Article from './components/Article';
import { Environments } from './DataTypes';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeArticle: null,
            location: 'menu',
        };
        this.setActiveArticle = this.setActiveArticle.bind(this);
        this.loadArticle = this.loadArticle.bind(this);
    }

    setActiveArticle(activeArticle) {
        console.log('App: setActiveArticle: activeArticle: ', activeArticle);
        this.setState({ activeArticle });
    }

    getPage() {
        const { activeArticle, location } = this.state;
        const { content } = this.props;

        if (location === 'menu') {
            return (
                <Menu
                    titles={content.titles}
                    contents={content.contents}
                    location={location}
                    activeArticle={activeArticle}
                    setActiveArticle={this.setActiveArticle}
                    loadArticle={this.loadArticle}
                />
            );
        }
        return (
            <Article
                contents={content.contents}
                articleID={location}
                loadArticle={this.loadArticle}
            />
        );
    }

    loadArticle(articleID) {
        console.log('App: loadArticle: articleID: ', articleID);
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
    name: PropTypes.string.isRequired,
    version: PropTypes.number.isRequired,
    env: PropTypes.oneOf(Object.values(Environments)),
    clientVersion: PropTypes.string,
};

App.defaultProps = {
    env: Environments.BROWSER,
    clientVersion: 'n/a',
};

export default App;

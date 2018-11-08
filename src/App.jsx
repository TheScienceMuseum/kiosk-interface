import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import './styles/App.scss';

import Menu from './components/Menu';
import Article from './components/Article';


const initialState = {
    activeArticle: null,
    page: null,
    location: 'menu',
};

class App extends Component {
    constructor(props) {
        super(props);
        this.state = { ...initialState };
        this.setActiveArticle = this.setActiveArticle.bind(this);
        this.loadArticle = this.loadArticle.bind(this);
    }

    setActiveArticle(activeArticle) {
        console.log('App: setActiveArticle: activeArticle: ', activeArticle);
        this.setState({ activeArticle });
    }

    loadArticle(articleID) {
        console.log('App: loadArticle: articleID: ', articleID);
        this.setState({ location: articleID });
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

    render() {
        const { location } = this.state;

        return (
            <TransitionGroup className="transition-group">
                <CSSTransition
                    key={location}
                    timeout={{ enter: 300, exit: 300 }}
                    classNames="fade"
                >
                    { this.getPage() }
                </CSSTransition>
            </TransitionGroup>

        );
    }
}

App.propTypes = {
    content: PropTypes.shape().isRequired,
};

export default App;

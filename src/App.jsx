import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router } from 'react-router-dom';
// import { TransitionGroup, CSSTransition } from 'react-transition-group';
// import { spring, AnimatedSwitch } from 'react-router-transition';

import './styles/App.scss';

import Container from './components/Container';
// import Menu from './components/Menu';
// import Article from './components/Article';


const initialState = {
    activeArticle: -1,
    page: null,
};

class App extends Component {
    constructor(props) {
        super(props);
        this.state = { ...initialState };
        this.setActiveArticle = this.setActiveArticle.bind(this);
    }

    setActiveArticle(activeArticle) {
        this.setState({ activeArticle });
    }

    render() {
        const { content } = this.props;
        const { activeArticle } = this.state;

        return (
            <Router basename="/sciencemuseum-kiosk-interface/build">
                <Container
                    data={content}
                    activeArticle={activeArticle}
                    onArticleLoad={this.setActiveArticle}
                />
            </Router>
        );
    }
}

App.propTypes = {
    content: PropTypes.shape().isRequired,
};

export default App;

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
    activeArticle: null,
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
        const { data } = this.props;
        const { activeArticle } = this.state;

        return (
            <Router>
                <Container
                    data={data}
                    activeArticle={activeArticle}
                    onArticleLoad={this.setActiveArticle}
                />
            </Router>
        );
    }
}

App.propTypes = {
    data: PropTypes.shape().isRequired,
};

export default App;

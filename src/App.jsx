import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';


import Menu from './components/Menu';
import Article from './components/Article';

import './styles/App.scss';

const initialState = {
    page: 0,
};

class App extends Component {
    constructor(props) {
        super(props);
        this.state = { ...initialState };
    }

    render() {
        const { data } = this.props;

        // console.log( 'App: render: location: ', location );

        return (
            <BrowserRouter>
                <div className="App">
                    <TransitionGroup>
                        <Route
                            exact
                            path="/"
                            render={match => <Menu titles={data.titles} show={match !== null} contents={data.contents} />}
                        />
                        <Route
                            path="/article/:articleID"
                            render={match => <Article contents={data.contents} show={match !== null} {...match} />}
                        />
                    </TransitionGroup>
                </div>
            </BrowserRouter>
        );
    }
}

App.propTypes = {
    data: PropTypes.shape().isRequired,
};

export default App;

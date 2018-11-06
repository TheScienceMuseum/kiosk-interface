import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import './styles/App.scss';

import Menu from './components/Menu';
import Article from './components/Article';



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

        //console.log('App: render: location: ', location);

        return (
            <BrowserRouter>
                <Route render={({ location }) => (
                    <div className="App">
                        {/*<TransitionGroup>*/}
                           {/*<CSSTransition*/}
                                {/*key={location.key}*/}
                                {/*classNames="fade"*/}
                                {/*timeout={1000}*/}
                            {/*>*/}
                                {/*<Switch>*/}
                                    <Route
                                        exact
                                        path="/"
                                        render={match => <Menu titles={data.titles} show={match !== null} contents={data.contents} />}
                                    />
                                    <Route
                                        path="/article/:articleID"
                                        render={match => <Article contents={data.contents} show={match !== null} {...match} />}
                                    />
                                    <Route render={() => <div>Not Found</div>} />
                                {/*</Switch>*/}
                            {/*</CSSTransition>*/}
                        {/*</TransitionGroup>*/}
                    </div>
                )}
                />
            </BrowserRouter>
        );
    }
}

App.propTypes = {
    data: PropTypes.shape().isRequired,
};

export default App;

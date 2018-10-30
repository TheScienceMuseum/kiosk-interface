import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import './App.css';
import Menu from './components/Menu';

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

        return (
            <div className="App">
                <h1>
                    Hello World, I am
                    { ' ' }
                    { data.packageName }

                    <Route exact path="/" render={() => <Menu titles={data.titles} contents={data.contents} />} />

                </h1>
            </div>
        );
    }
}

App.propTypes = {
    data: PropTypes.shape().isRequired,
};

export default App;

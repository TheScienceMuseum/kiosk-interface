import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
// import * as serviceWorker from './serviceWorker';
// import data from './data.json';


fetch('manifest.json').then(resp => resp.json()).then(json => {
    if (process.env.NODE_ENV !== 'production') {
        console.log('JSON data version:', json.version);
        // console.log('Package version:', packageFile.version);
    }
    ReactDOM.render(<App {...json} />, document.getElementById('root'));
});


// ReactDOM.render(<App data={data} />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();

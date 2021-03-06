import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
// import * as serviceWorker from './serviceWorker';
// import data from './data.json';

import './styles/galleries/themedicinegallery.scss';
import './styles/galleries/thefootballgallery.scss';

fetch('manifest.json').then(resp => resp.json()).then(json => {
    if (process.env.NODE_ENV !== 'production') {
        console.log('JSON data version:', json.version);
        // console.log('Package version:', packageFile.version);
    }

    window.appJson = json;
    ReactDOM.render(<App {...json} env={window.electon_env} clientVersion={window.client_ver} />, document.getElementById('root'));
});


// ReactDOM.render(<App data={data} />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();

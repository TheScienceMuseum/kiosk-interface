import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import data from '../public/manifest';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App {...data} env="testing" clientVersion="0.0.0" />, div);
    ReactDOM.unmountComponentAtNode(div);
});

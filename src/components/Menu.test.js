import React from 'react';
import ReactDOM from 'react-dom';

import { shallow, mount, render } from 'enzyme';

import Menu from './Menu';
import data from '../../public/manifest';

it('renders', () => {
    mount(<Menu titles={data.content.titles} contents={data.content.contents} />);
});

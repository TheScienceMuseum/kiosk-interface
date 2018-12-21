import React from 'react';

import { shallow } from 'enzyme';

import MenuItemMixed from './MenuItemMixed';
import data from '../../../public/manifest';

const pageData = data.content.contents[0];

it('renders', () => {
    shallow(<MenuItemMixed {...pageData} onClick={() => {}} />);
});

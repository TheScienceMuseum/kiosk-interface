import React from 'react';

import { shallow } from 'enzyme';

import MenuItemTitle from './MenuItemTitle';
import data from '../../../public/manifest';

const pageData = data.content.titles;

it('renders', () => {
    shallow(<MenuItemTitle {...pageData} />);
});

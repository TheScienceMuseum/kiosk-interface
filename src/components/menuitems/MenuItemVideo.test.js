import React from 'react';

import { shallow } from 'enzyme';

import MenuItemVideo from './MenuItemVideo';
import data from '../../../public/manifest';

const pageData = data.content.contents[1];

it('renders', () => {
    shallow(<MenuItemVideo {...pageData} onClick={() => {}} />);
});

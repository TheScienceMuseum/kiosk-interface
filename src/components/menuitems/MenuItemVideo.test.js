import React from 'react';

import { shallow } from 'enzyme';
import { find } from 'lodash';

import MenuItemVideo from './MenuItemVideo';
import data from '../../../public/manifest';

const pageData = find(data.content.contents, article => article.type === 'video');

it('renders', () => {
    shallow(<MenuItemVideo {...pageData} onClick={() => {}} onClickAuto={() => {}} />);
});

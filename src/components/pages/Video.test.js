import React from 'react';

import { shallow } from 'enzyme';

import Video from './Video';
import data from '../../../public/manifest';

const pageData = data.content.contents[4];

it('renders', () => {
    const video = shallow(<Video {...pageData} toggleNavHide={() => {}} />);
    // console.log(page.debug());
});

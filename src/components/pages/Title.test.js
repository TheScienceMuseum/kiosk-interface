import React from 'react';

import { shallow } from 'enzyme';

import Title from './Title';
import data from '../../../public/manifest';

const pageData = data.content.contents[0].subpages[0];

it('renders', () => {
    const title = shallow(<Title {...pageData} toggleNavHide={() => {}} />);
    // console.log(page.debug());
});

import React from 'react';

import { shallow } from 'enzyme';

import Image from './Image';
import data from '../../../public/manifest';

// TODO: get an article id to pass.
const pageData = data.content.contents[0].subpages[1];

it('renders', () => {
    //const page = shallow(<TextImage {...pageData} toggleNavHide={() => {}} />);
    const image = shallow(<Image {...pageData} toggleNavHide={() => {}} />);
    // console.log(page.debug());
});

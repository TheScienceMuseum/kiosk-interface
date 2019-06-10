import React from 'react';

import { shallow } from 'enzyme';

import Image from './Image';

const data = {
    pageID: '1-1-2',
    type: 'textImage',
    layout: 'left',
    asset: {
        assetSource: './media/02.jpg',
        assetType: 'image',
        boundingBox: {
            x: 0.2,
            y: 0.2,
            width: 0.26,
            height: 0.55
        },
        nameText: 'James Watson (b. 1928) pictured in 2018.',
        sourceText: 'Science Museum Group.',
    },
    title: 'James Watson: discovering the Double Helix',
    content: [
        'James Watson speaks about the journey to discovering the double helix:',
        '[Audio clip]',
    ],
};

it('renders', () => {
    // const page = shallow(<TextImage {...pageData} toggleNavHide={() => {}} />);
    const image = shallow(<Image {...data} toggleNavHide={() => {}} />);
    // console.log(page.debug());
});

import React from 'react';

import { mount } from 'enzyme';

import ZoomableImage from './ZoomableImage';

// TODO: get an article id to pass.
const imageData = {
    asset: {
        assetSource: '../../public/media/autopsy.png',
        assetThumbnail: '',
        assetPortrait: '',
        assetLandscape: '',
        assetType: 'image',
        nameText: 'Image name',
        sourceText: 'Source: Science Museum/SSPL',
    },
    image: '../../public/media/autopsy.png',
};

it('renders', () => {
    const image = mount(<ZoomableImage {...imageData} onZoom={() => {}} />);
    // console.log(image.debug());
});

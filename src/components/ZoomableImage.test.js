import React from 'react';

import { mount } from 'enzyme';

import ZoomableImage from './ZoomableImage';
import data from '../../public/manifest';

// TODO: get an article id to pass.
const imageData = {
    image: {
        imageSource: '../../public/media/autopsy.png',
        imageThumbnail: '',
        imagePortrait: '',
        imageLandscape: '',
        nameText: 'Image name',
        sourceText: 'Source: Science Museum/SSPL',
    },
};

it('renders', () => {
    const image = mount(<ZoomableImage {...imageData} onZoom={() => {}} />);
    // console.log(image.debug());
});

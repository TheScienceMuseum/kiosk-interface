import React from 'react';

import { shallow } from 'enzyme';

import Video from './Video';

const pageData = {
    articleID: '1-5',
    title: 'Knowledge is power: Peter’s story',
    subtitle: 'Some subtitle to show under the main text',
    titleImage: {
        assetType: 'image',
        assetSource: './media/3d-science-animation-footage-000458869_prevstill.jpeg',
    },
    type: 'video',
    asset: {
        posterImage: './media/3d-science-animation-footage-000458869_prevstill.jpeg',
        assetSource: 'http://media.w3.org/2010/05/bunny/movie.mp4',
        assetType: 'video',
        subtitlesSource: 'testing.vtt',
    },
};

it('renders', () => {
    const video = shallow(
        <Video
            toggleNavHide={() => {}}
            handleCloseButton={() => {}}
            pauseTimer={() => {}}
            resetInactiveTimer={() => {}}
            autoPlay
            {...pageData}
        />
    );
    // console.log(page.debug());
});

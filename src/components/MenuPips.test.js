import React from 'react';

import { mount } from 'enzyme';

import MenuPips from './MenuPips';
import data from '../../public/manifest';

it('renders', () => {
    mount(<MenuPips contents={data.content.contents} onJump={() => {}} currentFocused={0} />);
});

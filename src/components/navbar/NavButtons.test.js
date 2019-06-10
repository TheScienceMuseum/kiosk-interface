import React from 'react';

import { mount } from 'enzyme';
import NavButtons from './NavButtons';

it('renders', () => {
    // mount(<MenuPips contents={data.content.contents} onJump={() => {}} currentFocused={0} />);
    mount(<NavButtons onNext={() => {}} onPrev={() => {}} currentPage={1} totalPages={2} />);
});

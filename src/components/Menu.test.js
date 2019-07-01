import React from 'react';
import ReactDOM from 'react-dom';

import { shallow, mount, render } from 'enzyme';

import Menu from './Menu';
import data from '../../public/manifest';

it('renders', () => {
    mount(
        <Menu
            titles={data.content.titles}
            contents={data.content.contents}
            aspect="landscape"
            initial
        />
    );
});

it('renders a menu item for each entry in data', () => {
    const menu = mount(
        <Menu
            titles={data.content.titles}
            contents={data.content.contents}
            aspect="landscape"
            initial
        />
    );
    // expect(menu.find('ul').children()).toHaveLength(data.content.contents.length);
    expect(menu.find('li')).toHaveLength(data.content.contents.length + 2);
});

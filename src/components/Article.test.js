import React from 'react';

import { mount, shallow } from 'enzyme';

import Article from './Article';
import data from '../../public/manifest';

// TODO: get an article id to pass.
const { articleID } = data.content.contents[0];

it('renders', () => {
    const article = shallow(
        <Article
            articleID={articleID}
            contents={data.content.contents}
            loadArticle={() => {}}
            pauseTimer={() => {}}
            resetInactiveTimer={() => {}}
        />
    );
    // console.log(article.debug());
});

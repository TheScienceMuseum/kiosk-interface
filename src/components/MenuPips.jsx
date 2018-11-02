import React from 'react';
import PropTypes from 'prop-types';

import { ArticleTypes } from './DataTypes';

import '../styles/MenuPips.scss';

/*
 * MenuPips:
 *
 *
 * @author Gavin Cockrem <gavin@joipolloi.com.
 * @package sciencemuseum-kiosk-interface
 */


function MenuPips(props) {
    const { contents, currentFocused } = props;

    const handleClick = targetID => {
        // console.log('MenuPips: handleClick: targetID: ', targetID);
        props.onJump(targetID);
    };

    const output = contents.map((articleContent, idx) => {
        // console.log('MenuPips: output map: articleContent: ', articleContent);

        const out = (
            <button
                className={`MenuPips__Button ${currentFocused === (idx + 1) ? 'MenuPips__Button--active' : ''}`}
                type="button"
                onClick={handleClick.bind(this, articleContent.articleID)}
                key={`button_${articleContent.articleID}`}
            >
                {`Jump to ${articleContent.title}`}
            </button>
        );

        return out;
    });

    return (
        <div className="MenuPips">
            <button
                className={`MenuPips__Button ${currentFocused === 0 ? 'MenuPips__Button--active' : ''}`}
                type="button"
                onClick={handleClick.bind(this, ArticleTypes.TITLE)}
                key="button_title"
            >
                {'Jump to Title'}
            </button>
            {output}
        </div>
    );
}

MenuPips.propTypes = {
    contents: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    onJump: PropTypes.func.isRequired,
    currentFocused: PropTypes.number.isRequired,
};

export default MenuPips;

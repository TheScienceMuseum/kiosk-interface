import React from 'react';
import PropTypes from 'prop-types';

import { ArticleTypes, Orientations } from '../Constants';

import '../styles/components/MenuPips.scss';

/*
 * MenuPips:
 *
 *
 * @author Gavin Cockrem <gavin@joipolloi.com.
 * @package sciencemuseum-kiosk-interface
 */


function MenuPips(props) {
    const {
        contents, currentFocused, showTitlePip, orientation,
    } = props;

    const handleClick = targetID => {
        // console.log('MenuPips: handleClick: targetID: ', targetID);
        props.onJump(targetID);
    };

    // console.log('MenuPips: contents: ', contents);

    const output = contents.map((articleContent, idx) => {
        // console.log('MenuPips: output map: articleContent: ', articleContent);
        const index = showTitlePip ? idx + 1 : idx;
        const key = articleContent.articleID ? articleContent.articleID : articleContent.pageID;

        // console.log('MenuPips: output map: index: ', index);
        // console.log('MenuPips: output map: currentFocused: ', currentFocused);

        const out = (
            <button
                className={
                    `MenuPips__Button ${currentFocused === (index)
                        ? 'MenuPips__Button--active'
                        : ''}`
                }
                type="button"
                onClick={handleClick.bind(this, key)}
                key={`button_${key}`}
            >
                {`Jump to ${articleContent.title}`}
            </button>
        );

        return out;
    });

    return (
        <div className={`MenuPips MenuPips--${orientation}`}>
            { showTitlePip
            && (
                <button
                    className={
                        `MenuPips__Button ${currentFocused === 0
                            ? 'MenuPips__Button--active'
                            : ''}`
                    }
                    type="button"
                    onClick={handleClick.bind(this, ArticleTypes.TITLE)}
                    key="button_title"
                >

                    {'Jump to Title'}
                </button>
            )
            }
            {output}
        </div>
    );
}

MenuPips.propTypes = {
    contents: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    onJump: PropTypes.func.isRequired,
    currentFocused: PropTypes.number.isRequired,
    showTitlePip: PropTypes.bool,
    orientation: PropTypes.oneOf(Object.values(Orientations)),
};

MenuPips.defaultProps = {
    showTitlePip: false,
    orientation: Orientations.HORIZONTAL,
};

export default MenuPips;

import React from 'react';
import PropTypes from 'prop-types';

import '../styles/MenuPips.scss';

/*
 * MenuPips:
 *
 *
 * @author Gavin Cockrem <gavin@joipolloi.com.
 * @package sciencemuseum-kiosk-interface
 */


function MenuPips(props) {
    const { contents } = props;

    const handleClick = targetID => {
        //console.log('MenuPips: handleClick: targetID: ', targetID);
        props.onJump(targetID);
    };

    const output = contents.map(articleContent => {
        //console.log('MenuPips: output map: articleContent: ', articleContent);
        const out = (
            <button
                data-target={articleContent.articleID}
                type="button"
                onClick={handleClick.bind(this, articleContent.articleID)}
                key={`button${articleContent.articleID}`}
            >
                {`Jump to ${articleContent.title}`}
            </button>
        );

        return out;
    });

    return (
        <div className="MenuPips">
            {output}
        </div>
    );
}

MenuPips.propTypes = {
    contents: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    onJump: PropTypes.func.isRequired,
};

export default MenuPips;

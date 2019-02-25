import React from 'react';
import PropTypes from 'prop-types';

import { MoveDirections, Orientations } from '../utils/Constants';

import '../styles/components/MenuPips.scss';

/*
 * MenuPips:
 *
 *
 * @author Gavin Cockrem <gavin@joipolloi.com.
 * @package sciencemuseum-kiosk-interface
 */


class MenuPips extends React.Component {
    constructor(props) {
        super(props);
        this.lastActive = null;
        this.moveDirection = MoveDirections.RIGHT;
        this.handleClick = this.handleClick.bind(this);
    }

    componentWillUpdate(nextProps) {
        // console.log('MenuPips: componentWillUpdate: nextProps: ', nextProps);

        const { currentFocused } = this.props;

        if (nextProps.currentFocused !== currentFocused) {
            // console.log('MenuPips: componentWillUpdate: currentFocussed: ', currentFocused);
            // console.log('MenuPips: componentWillUpdate: nextProps: ', nextProps.currentFocused);
            this.lastActive = currentFocused;
        }

        this.moveDirection = (currentFocused > nextProps.currentFocused)
            ? MoveDirections.LEFT
            : MoveDirections.RIGHT;

        console.log('MenuPips: componentWillUpdate: moveDirection: ', this.moveDirection);
    }

    makePips() {
        const {
            contents, showTitlePip, currentFocused,
        } = this.props;

        // console.log('MenuPips: makePips: moveDirection: ', this.moveDirection);
        // console.log('MenuPips: makePips: currentFocused: ', currentFocused);
        // console.log('MenuPips: makePips: this.lastActive: ', this.lastActive);

        const output = contents.map((articleContent, idx) => {
            // console.log('MenuPips: output map: articleContent: ', articleContent);
            const index = showTitlePip ? idx + 1 : idx;
            const key = articleContent.articleID ? articleContent.articleID : articleContent.pageID;

            // console.log('MenuPips: output map: index: ', index);
            // console.log('MenuPips: output map: currentFocused: ', currentFocused);
            // console.log('MenuPips: output map: this.lastActive: ', this.lastActive);

            const classList = ['MenuPips__Button', `MenuPips__Button--${this.moveDirection}`];
            if (currentFocused === (index)) classList.push('MenuPips__Button--active');
            if (this.lastActive === (index)) classList.push('MenuPips__Button--exiting');

            const className = classList.join(' ');

            return (
                <button
                    className={className}
                    type="button"
                    onClick={this.handleClick}
                    key={`button_${key}`}
                    data-key={key}
                >
                    {`Jump to ${articleContent.title}`}
                </button>
            );
        });

        // this.lastActive = currentFocused;

        return output;
    }

    handleClick(e) {
        const { onJump } = this.props;
        const { target } = e;
        const targetID = target.getAttribute('data-key');

        onJump(targetID);
    }

    render() {
        const {
            currentFocused, showTitlePip, orientation,
        } = this.props;
        /*
        const handleClick = (targetID) => {
            // console.log('MenuPips: handleClick: targetID: ', targetID);
            this.props.onJump(targetID);
        };
        */

        // console.log('MenuPips: contents: ', contents);
        const classList = ['MenuPips__Button', `MenuPips__Button--${this.moveDirection}`];
        if (currentFocused === (0)) classList.push('MenuPips__Button--active');
        if (this.lastActive === (0)) classList.push('MenuPips__Button--exiting');
        const className = classList.join(' ');


        return (
            <div className={`MenuPips MenuPips--${orientation}`}>
                {showTitlePip
                && (
                    <button
                        className={className}
                        type="button"
                        onClick={this.handleClick}
                        key="button_title"
                        data-key="button_title"
                    >
                        {'Jump to Title'}
                    </button>
                )
                }
                {this.makePips()}
            </div>
        );
    }
}

MenuPips.propTypes = {
    contents: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    onJump: PropTypes.func.isRequired,
    currentFocused: PropTypes.number.isRequired,
    showTitlePip: PropTypes.bool,
    orientation: PropTypes.oneOf(Object.values(Orientations)),
};

MenuPips.defaultProps = {
    showTitlePip: true,
    orientation: Orientations.HORIZONTAL,
};

export default MenuPips;

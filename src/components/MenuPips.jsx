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
        this.highlighterStyle = this.highlighterStyle.bind(this);
        this.state = {
            highlighterMarginLeft: 0,
        };
        this.goToActive = this.goToActive.bind(this);
    }

    componentWillUpdate(nextProps) {
        const { currentFocused } = this.props;
        if (nextProps.currentFocused !== currentFocused) {
            this.lastActive = currentFocused;
            if (currentFocused > nextProps.currentFocused) {
                this.moveDirection = MoveDirections.LEFT;
            } else if (currentFocused < nextProps.currentFocused) {
                this.moveDirection = MoveDirections.RIGHT;
            }

            setTimeout(() => {
                this.goToActive();
            }, 100);
        }
    }

    static getElementOffset(el) {
        const rect = el.getBoundingClientRect();
        const ret = {
            top: rect.top + document.body.scrollTop,
            left: rect.left + document.body.scrollLeft,
        };
        return ret;
    }

    goToActive() {
        const domElement = document.getElementsByClassName('MenuPips__Button--active')[0];

        const offset = this.constructor.getElementOffset(domElement);
        const parentOffset = this.constructor.getElementOffset(this.pipsContainer);

        const l = (offset.left - parentOffset.left) + domElement.style.borderLeftWidth;

        this.setState({ highlighterMarginLeft: l });
    }

    makePips() {
        const {
            contents, showTitlePip, currentFocused,
        } = this.props;

        const output = contents.map((articleContent, idx) => {
            const index = showTitlePip ? idx + 1 : idx;
            const key = articleContent.articleID ? articleContent.articleID : articleContent.pageID;

            const classList = ['MenuPips__Button', `MenuPips__Button--${this.moveDirection}`];
            if (currentFocused === (index)) classList.push('MenuPips__Button--active');
            if (this.lastActive === (index)) classList.push('MenuPips__Button--exiting');

            const className = classList.join(' ');

            return (
                <>
                    <div className="spacer" />
                    <button
                        className={className}
                        type="button"
                        onClick={this.handleClick}
                        key={`button_${key}`}
                        data-key={key}
                    >
                        {`Jump to ${articleContent.title}`}
                    </button>
                </>
            );
        });

        return output;
    }


    handleClick(e) {
        const { onJump } = this.props;
        const { target } = e;
        const targetID = target.getAttribute('data-key');
        const domElement = e.target;

        const offset = this.constructor.getElementOffset(domElement);
        const parentOffset = this.constructor.getElementOffset(this.pipsContainer);

        const l = (offset.left - parentOffset.left);

        this.setState({ highlighterMarginLeft: l });

        onJump(targetID);
    }

    highlighterStyle() {
        const model = this.state;
        const mLeft = `${model.highlighterMarginLeft}px`;
        const style = {
            marginLeft: mLeft,
        };
        return style;
    }

    render() {
        const {
            currentFocused, showTitlePip, orientation,
        } = this.props;

        const classList = ['MenuPips__Button', `MenuPips__Button--${this.moveDirection}`];
        if (currentFocused === (0)) classList.push('MenuPips__Button--active');
        if (this.lastActive === (0)) classList.push('MenuPips__Button--exiting');
        const className = classList.join(' ');


        return (
            <div className={`MenuPips MenuPips--${orientation}`} ref={(node) => { this.pipsContainer = node; }}>
                <div className="MenuPipHighlighter" style={this.highlighterStyle()} />
                <div className="MenuPipsContainer">
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

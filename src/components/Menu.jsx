import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { TweenMax } from 'gsap/all';
import { Transition } from 'react-transition-group';
import Hammer from 'react-hammerjs';


import MenuItemTitle from './menuitems/MenuItemTitle';
import MenuItemMixed from './menuitems/MenuItemMixed';
import MenuItemVideo from './menuitems/MenuItemVideo';
import MenuPips from './MenuPips';
import { ArticleTypes } from './DataTypes';

import '../styles/Menu.scss';


/*
 * Menu:
 *
 * @author Gavin Cockrem <gavin@joipolloi.com.
 * @package sciencemuseum-kiosk-interface
 */

class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentFocused: null,
        };

        this.DOMrefs = {};

        this.onNext = this.nextItem.bind(this);
        this.onPrev = this.previousItem.bind(this);
        this.onJump = this.jumpToItem.bind(this);

        this.handleSwipe = this.handleSwipe.bind(this);

        this.scrollElem = null;
    }

    nextItem() {
        console.log('Menu: nextItem');
        let { currentFocused } = this.state;
        console.log('Menu: nextItem: currentFocused: ', currentFocused);
        if (currentFocused != null) {
            console.log('Menu: nextItem: add one: ');
            currentFocused += 1;
        } else {
            currentFocused = 0;
        }
        //console.log('Menu: nextItem: currentFocused: ', currentFocused);
        this.setState({ currentFocused }, this.jumpToItem(this.props.contents[currentFocused].articleID));
    }

    previousItem() {
        let { currentFocused } = this.state;
        console.log('Menu: previousItem: currentFocused: ', currentFocused);
        if (currentFocused !== null && currentFocused !== 0) {
            console.log('Menu: nextItem: delete one: ');
            currentFocused -= 1;
        } else {
            currentFocused = 0;
        }
        console.log('Menu: nextItem: currentFocused: ', currentFocused);
        this.setState({ currentFocused }, this.jumpToItem(this.props.contents[currentFocused].articleID));
    }

    handleSwipe(e) {
        console.log('Menu: handleSwipe: e: ', e);
        if (e.direction === 2) {
            this.nextItem();
        } else if (e.direction === 4) {
            this.previousItem();
        }
    }

    jumpToItem(targetID) {
        console.log('Menu: jumpToItem: targetID: ', targetID);
        // console.log('Menu: jumpToItem: getDOMElement: ', this.DOMrefs);
        const itemElem = this.DOMrefs[targetID];
        console.log('Menu: jumpToItem: itemElem: ', itemElem);
        console.log('Menu: jumpToItem: scrollElem: ', this.scrollElem);
        console.log('Menu: jumpToItem: itemElem rect: ', itemElem.getBoundingClientRect());
        const targetRect = itemElem.getBoundingClientRect();
        // const targetLeft = itemElem.offsetLeft;
        const targetCenter = itemElem.offsetLeft + (targetRect.width / 2);
        const currentScroll = this.scrollElem.scrollLeft;
        // console.log('Menu: jumpToItem: targetLeft: ', targetLeft);
        console.log('Menu: jumpToItem: targetCenter: ', targetCenter);
        console.log('Menu: jumpToItem: currentScroll: ', currentScroll);

        // whats the current scroll?
        // where do i need to scroll to?

        this.scrollElem.scrollLeft = (targetCenter - 960);
    }

    storeRef(ref, id) {
        // console.log('Menu: storeRef: ref: ', ref);
        // console.log('Menu: storeRef: id: ', id);
        // eslint:disable-next-line:react/no-find-dom-node
        this.DOMrefs[id] = ReactDOM.findDOMNode(ref);
    }


    render() {
        const { contents, titles } = this.props;
        const { show } = this.props;
        const startState = { autoAlpha: 0, y: -50 };

        const menuItems = contents.map(item => {
            const id = item.articleID;
            let output;
            switch (item.type) {
            case ArticleTypes.VIDEO:
                output = (
                    <MenuItemVideo
                        key={id}
                        articleID={id}
                        ref={ref => {
                            this.storeRef(ref, id);
                        }}
                        {...item}
                    />
                );
                break;
            case ArticleTypes.MIXED:
                output = (
                    <MenuItemMixed
                        key={id}
                        articleID={id}
                        ref={ref => { this.storeRef(ref, id); }}
                        {...item}
                    />
                );
                break;
            default:
                output = '';
            }

            return output;
        });
        return (
            <Transition
                unmountOnExit
                in={show}
                timeout={1000}
                onEnter={node => TweenMax.set(node, startState)}
                addEndListener={(node, done) => {
                    TweenMax.to(node, 0.5, {
                        autoAlpha: show ? 1 : 0,
                        y: show ? 0 : 50,
                        onComplete: done,
                    });
                }}
            >
                <Hammer onSwipe={this.handleSwipe}>
                    <nav className="Menu">
                        <ul className="Menu__Container" ref={ref => { this.scrollElem = ref; }}>
                            <MenuItemTitle {...titles} />
                            {menuItems}
                        </ul>
                        <MenuPips onJump={this.onJump} contents={contents} />
                    </nav>
                </Hammer>
            </Transition>
        );
    }
}

Menu.propTypes = {
    contents: PropTypes.arrayOf(
        PropTypes.shape,
    ),
    titles: PropTypes.shape({
        type: PropTypes.oneOf(['text', 'image']),
        galleryName: PropTypes.string,
        title: PropTypes.string,
    }).isRequired,
};

Menu.defaultProps = {
    contents: {},
};

export default Menu;

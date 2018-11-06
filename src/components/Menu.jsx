import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { TweenLite, Ease } from 'gsap/all';
import Hammer from 'react-hammerjs';


import MenuItemTitle from './menuitems/MenuItemTitle';
import MenuItemMixed from './menuitems/MenuItemMixed';
import MenuItemVideo from './menuitems/MenuItemVideo';
import MenuPips from './MenuPips';
import NavButtons from './NavButtons';
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

        const currentFocused = (props.activeArticle)
            ? props.activeArticle
            : 0;

        this.state = {
            currentFocused,
        };

        this.DOMrefs = {};

        this.onNext = this.nextItem.bind(this);
        this.onPrev = this.previousItem.bind(this);
        this.onJump = this.scrollToItem.bind(this);

        this.handleSwipe = this.handleSwipe.bind(this);

        this.scrollElem = null;
        this.scrollTween = null;
    }

    componentDidMount() {
        const { currentFocused } = this.state;
        this.jumpToItem(currentFocused);
    }

    nextItem() {
        // console.log('Menu: nextItem');
        const { contents } = this.props;
        let { currentFocused } = this.state;
        // console.log('Menu: nextItem: currentFocused: ', currentFocused);

        if (currentFocused === (contents.length)) return;

        currentFocused += 1;

        const targetID = (currentFocused === 0)
            ? ArticleTypes.TITLE
            : contents[currentFocused - 1].articleID;
        // console.log('Menu: nextItem: currentFocused: ', currentFocused);
        this.setState({ currentFocused }, this.scrollToItem(targetID));
    }

    previousItem() {
        const { contents } = this.props;
        let { currentFocused } = this.state;
        // console.log('Menu: previousItem: currentFocused: ', currentFocused);

        if (currentFocused === null || currentFocused === 0) return;

        currentFocused -= 1;

        // console.log('Menu: nextItem: currentFocused: ', currentFocused);
        const targetID = (currentFocused === 0)
            ? ArticleTypes.TITLE
            : contents[currentFocused - 1].articleID;
        this.setState({ currentFocused }, this.scrollToItem(targetID));
    }

    handleSwipe(e) {
        // console.log('Menu: handleSwipe: e: ', e);
        if (e.direction === 2) {
            this.nextItem();
        } else if (e.direction === 4) {
            this.previousItem();
        }
    }

    scrollToItem(targetID) {
        // console.log('Menu: jumpToItem: targetID: ', targetID);

        let targetScroll;
        let index;

        if (targetID === ArticleTypes.TITLE) {
            targetScroll = 0;
            index = 0;
        } else {
            const itemElem = this.DOMrefs[targetID];
            const targetRect = itemElem.getBoundingClientRect();
            const targetCenter = itemElem.offsetLeft + (targetRect.width / 2);
            // const currentScroll = this.scrollElem.scrollLeft;
            index = (Object.keys(this.DOMrefs).indexOf(targetID) + 1);

            targetScroll = (targetCenter - 960);
        }

        //
        // console.log('Menu: scrollToItem: targetID: ', this.DOMrefs);
        // // console.log('Menu: scrollToItem: getDOMElement: ', this.DOMrefs);
        //
        // console.log('Menu: scrollToItem: itemElem: ', itemElem);
        // console.log('Menu: scrollToItem: scrollElem: ', this.scrollElem);
        // console.log('Menu: scrollToItem: itemElem rect: ', itemElem.getBoundingClientRect());
        //
        // // const targetLeft = itemElem.offsetLeft;
        //
        // // console.log('Menu: scrollToItem: targetLeft: ', targetLeft);
        // console.log('Menu: scrollToItem: targetCenter: ', targetCenter);
        // console.log('Menu: scrollToItem: currentScroll: ', currentScroll);

        // whats the current scroll?
        // where do i need to scroll to?

        // this.scrollElem.scrollLeft = (targetCenter - 960);

        // const idx = this.DOMrefs.indexOf(targetID);

        console.log('Menu: scrollToItem: index: ', index);
        console.log('Menu: scrollToItem: targetScroll: ', targetScroll);
        // alert(index);
        const { onArticleLoad } = this.props;
        onArticleLoad(index);

        this.setState({ currentFocused: index });
        const options = { scrollLeft: targetScroll, ease: Ease.easeOut };
        this.scrollTween = TweenLite.to(this.scrollElem, 0.25, options);
    }

    jumpToItem(itemNum) {
        // const targetScroll = (itemNum) * 1442
        let targetScroll;
        if (itemNum === 0) {
            targetScroll = 0;
        } else {
            targetScroll = 671 + ((itemNum - 1) * 1442);
        }

        console.log('Menu: jumpToItem: itemNum: ', itemNum);
        console.log('Menu: jumpToItem: targetScroll: ', targetScroll);

        this.scrollElem.scrollLeft = targetScroll;
    }

    storeRef(ref, id) {
        // eslint-disable-next-line react/no-find-dom-node
        this.DOMrefs[id] = ReactDOM.findDOMNode(ref);
    }

    render() {
        const { contents, titles } = this.props;
        const { currentFocused } = this.state;
        // const startState = { autoAlpha: 0, y: -50 };

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
            // <Transition
            //    unmountOnExit
            // in={show}
            //     timeout={1000}
            //     onEnter={node => TweenMax.set(node, startState)}
            //     addEndListener={(node, done) => {
            //         TweenMax.to(node, 0.5, {
            //             autoAlpha: show ? 1 : 0,
            //             y: show ? 0 : 50,
            //             onComplete: done,
            //         });
            //     }}
            // >
            <Hammer onSwipe={this.handleSwipe}>
                <nav className="Menu">
                    <ul className="Menu__Container" ref={ref => { this.scrollElem = ref; }}>
                        <MenuItemTitle {...titles} />
                        {menuItems}
                    </ul>
                    <MenuPips
                        onJump={this.onJump}
                        contents={contents}
                        currentFocused={currentFocused}
                        showTitlePip
                    />
                    <NavButtons onPrev={this.onPrev} onNext={this.onNext} />
                </nav>
            </Hammer>
            // </Transition>
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

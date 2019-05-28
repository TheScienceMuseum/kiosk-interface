import React from 'react';
import PropTypes from 'prop-types';
import { TweenLite, Ease } from 'gsap/umd/TweenLite';
import Hammer from 'react-hammerjs';
import HammerJS from 'hammerjs';

import '../styles/components/Menu.scss';

import MenuItemTitle from './menuitems/MenuItemTitle';
import MenuItemMixed from './menuitems/MenuItemMixed';
import MenuItemVideo from './menuitems/MenuItemVideo';

import {
    ArticleTypes, Dimensions, ScreenSize,
} from '../utils/Constants';
import MenuNav from './MenuNav';


/*
 * Menu:
 *
 * @author Gavin Cockrem <gavin@joipolloi.com.
 * @package sciencemuseum-kiosk-interface
 */

class Menu extends React.Component {
    static getScrollAmount(index) {
        let targetScroll;

        // the width of the menu title item
        const menuTitleOffset = Dimensions.MENU_ITEM_PADDING
            + Dimensions.TITLE_ITEM_WIDTH
            + Dimensions.MENU_ITEM_SPACING;

        // the space to the left and right of the active menu item
        const activeItemSpacing = (ScreenSize.width - Dimensions.MENU_ITEM_WIDTH) / 2;
        const firstItemLeftOffset = menuTitleOffset - activeItemSpacing;

        if (index === 0) {
            targetScroll = 0;
        } else {
            targetScroll = firstItemLeftOffset + ((index - 1) * (
                Dimensions.MENU_ITEM_WIDTH + Dimensions.MENU_ITEM_SPACING)
            );
        }
        return targetScroll;
    }

    constructor(props) {
        super(props);

        const { initial } = props;

        const currentFocused = (!initial || props.activeArticle)
            ? props.activeArticle
            : 0;

        this.state = {
            currentFocused,
        };

        this.onNext = this.nextItem.bind(this);
        this.onPrev = this.previousItem.bind(this);
        this.onJump = this.scrollToItem.bind(this);

        this.handleSwipe = this.handleSwipe.bind(this);
        this.itemClick = this.onItemClick.bind(this);

        this.scrollElem = null;
        // this.scrollTween = null;
        // console.log('Menu: constructor: props.initial: ', initial);
        // console.log('Menu: constructor: currentFocused: ', currentFocused);

        // this.moveDirection = MoveDiections.RIGHT;
    }

    componentDidMount() {
        const { currentFocused } = this.state;
        this.jumpToItem(currentFocused);
    }

    componentWillUpdate(nextProps) {
        // console.log('Menu: componentWillUpdate: nextProps.initial: ', nextProps.initial);

        // console.log('Menu: componentWillUpdate: nextProps: ', nextProps);
        // console.log('Menu: componentWillUpdate: this.props: ', this.props);

        if (nextProps.initial) {
            this.state = {
                currentFocused: 0,
            };
        }
    }

    componentWillUnmount() {
        // console.log('Menu: componentWillUnmount:');
    }

    onItemClick(articleID) {
        // console.log('Menu: onItemClick: e: ', e);
        // console.log('Menu: onItemClick: e.target: ', e.target);
        // e.stopImmediatePropagation();

        const { currentFocused } = this.state;
        const { loadArticle } = this.props;
        // console.log('Menu: onItemClick: articleID: ', articleID);
        if (this.getIndexFromID(articleID) === currentFocused) {
            // console.log('Menu: onItemClick: navigate to article');
            // console.log('Menu: onItemClick: this.context: ', this.context.router);
            // this.setState({ redirect: `/article/${articleID}` });
            // history.push(`./article/${articleID}`);
            loadArticle(articleID);
        } else {
            // console.log('Menu: onItemClick: scroll to article');
            this.scrollToItem(articleID);
        }
    }


    getIndexFromID(articleID) {
        const { contents } = this.props;
        return (contents.map(e => e.articleID).indexOf(articleID) + 1);
    }

    nextItem() {
        // console.log('Menu: nextItem');
        const { contents } = this.props;
        let { currentFocused } = this.state;
        // this.moveDirection = MoveDiections.RIGHT;
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
        // this.moveDirection = MoveDiections.LEFT;
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
        if (e.direction === HammerJS.DIRECTION_LEFT) {
            this.nextItem();
        } else if (e.direction === HammerJS.DIRECTION_RIGHT) {
            this.previousItem();
        }
    }

    scrollToItem(targetID) {
        // console.log('Menu: jumpToItem: targetID: ', targetID);

        // let targetScroll;
        let index;
        if (targetID === ArticleTypes.TITLE) {
            index = 0;
        } else {
            index = this.getIndexFromID(targetID);
        }

        const { setActiveArticle } = this.props;
        setActiveArticle(index);
        // resetInactiveTimer(true);

        this.setState({ currentFocused: index });
        // this.jumpToItem(index);

        const options = { scrollLeft: Menu.getScrollAmount(index), ease: Ease.easeOut };
        this.scrollTween = TweenLite.to(this.scrollElem, 0.25, options);
    }


    jumpToItem(itemNum) {
        // console.log('Menu: jumpToItem: itemNum: ', itemNum);
        // console.log('Menu: jumpToItem: targetScroll: ', Menu.getScrollAmount(itemNum));
        this.scrollElem.scrollLeft = Menu.getScrollAmount(itemNum);
    }


    render() {
        const { contents, titles } = this.props;
        const { currentFocused } = this.state;

        // console.log('Menu: render: location: ', location);

        // const startState = { autoAlpha: 0, y: -50 };

        // if (redirect) {
        //     // const path = redirect;
        //     return <Redirect push to={redirect} />;
        // }


        const menuItems = contents.map((item) => {
            const id = item.articleID;
            let output;
            switch (item.type) {
            case ArticleTypes.VIDEO:
                output = (
                    <MenuItemVideo
                        key={id}
                        articleID={id}
                        {...item}
                        onClick={this.itemClick}
                    />
                );
                break;
            case ArticleTypes.MIXED:
                output = (
                    <MenuItemMixed
                        key={id}
                        articleID={id}
                        {...item}
                        onClick={this.itemClick}
                    />
                );
                break;
            case ArticleTypes.MODEL:
                output = (
                    <MenuItemMixed
                        key={id}
                        articleID={id}
                        {...item}
                        onClick={this.itemClick}
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
                    <ul className="Menu__Container" ref={(ref) => { this.scrollElem = ref; }}>
                        <MenuItemTitle {...titles} />
                        {menuItems}
                    </ul>

                    <MenuNav
                        onNext={this.onNext}
                        onPrev={this.onPrev}
                        contents={contents}
                        onJump={this.onJump}
                        currentFocused={currentFocused}
                    />
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

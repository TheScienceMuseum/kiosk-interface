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
        this.itemClickAuto = this.onItemClickAuto.bind(this);

        this.scrollElem = null;
        // this.scrollTween = null;
        // console.log('Menu: constructor: props.initial: ', initial);
        // console.log('Menu: constructor: currentFocused: ', currentFocused);

        // this.moveDirection = MoveDiections.RIGHT;
        this.scrolling = false;
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

    onItemClickAuto(articleID) {
        const { currentFocused } = this.state;
        const { loadArticle } = this.props;
        // console.log('Menu: onItemClick: articleID: ', articleID);
        if (this.getIndexFromID(articleID) === currentFocused) {
            // console.log('Menu: onItemClick: navigate to article');
            // console.log('Menu: onItemClick: this.context: ', this.context.router);
            // this.setState({ redirect: `/article/${articleID}` });
            // history.push(`./article/${articleID}`);
            loadArticle(articleID, true);
        } else {
            // console.log('Menu: onItemClick: scroll to article');
            this.scrollToItem(articleID);
        }
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
            loadArticle(articleID, false);
        } else {
            // console.log('Menu: onItemClick: scroll to article');
            // only if not scrolling
            if (this.scrolling) return;
            this.scrollToItem(articleID);
        }
    }

    getScrollAmount(index) {
        let targetScroll;
        const { aspect } = this.props;
        const dimension = Dimensions[aspect];

        // the width of the menu title item
        const menuTitleOffset = dimension.MENU_ITEM_PADDING
            + dimension.TITLE_ITEM_WIDTH
            + dimension.MENU_ITEM_SPACING;

        // the space to the left and right of the active menu item
        const activeItemSpacing = (
            ScreenSize[dimension.ASPECT_RATIO].width - dimension.MENU_ITEM_WIDTH
        ) / 2;
        const firstItemLeftOffset = menuTitleOffset - activeItemSpacing;

        if (index === 0) {
            targetScroll = 0;
        } else {
            targetScroll = firstItemLeftOffset + ((index - 1) * (
                dimension.MENU_ITEM_WIDTH + dimension.MENU_ITEM_SPACING)
            );
        }
        return targetScroll;
    }

    getIndexFromID(articleID) {
        const { contents } = this.props;
        return (contents.map(e => e.articleID).indexOf(articleID) + 1);
    }

    nextItem() {
        const { contents } = this.props;
        let { currentFocused } = this.state;
        // this.moveDirection = MoveDiections.RIGHT;
        // console.log('Menu: nextItem: currentFocused: ', currentFocused);

        if (currentFocused === (contents.length)) {
            return;
        }

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
        if (e.direction === HammerJS.DIRECTION_LEFT) {
            this.nextItem();
        } else if (e.direction === HammerJS.DIRECTION_RIGHT) {
            this.previousItem();
        }
    }

    scrollToItem(targetID) {
        // let targetScroll;
        this.scrolling = true;
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

        const options = {
            scrollLeft: this.getScrollAmount(index),
            ease: Ease.easeIn,
            onComplete: () => { this.scrolling = false; },
        };
        this.scrollTween = TweenLite.to(this.scrollElem, 0.4, options);
    }


    jumpToItem(itemNum) {
        // console.log('Menu: jumpToItem: itemNum: ', itemNum);
        // console.log('Menu: jumpToItem: targetScroll: ', Menu.getScrollAmount(itemNum));
        this.scrollElem.scrollLeft = this.getScrollAmount(itemNum);
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


        const menuItems = contents.map((item, i) => {
            const id = item.articleID;
            let output;
            const selected = (i + 1) === currentFocused;
            switch (item.type) {
            case ArticleTypes.VIDEO:
                output = (
                    <MenuItemVideo
                        key={id}
                        articleID={id}
                        {...item}
                        onClick={this.itemClick}
                        onClickAuto={this.itemClickAuto}
                        selected={selected}
                    />
                );
                break;
            case ArticleTypes.MIXED:
            case ArticleTypes.TIMELINE:
                output = (
                    <MenuItemMixed
                        key={id}
                        articleID={id}
                        {...item}
                        onClick={this.itemClick}
                        selected={selected}
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
                        selected={selected}
                    />
                );
                break;
            default:
                output = '';
            }

            return output;
        });
        return (
            <Hammer onSwipe={this.handleSwipe}>
                <nav className="Menu">
                    <ul className="Menu__Container" ref={(ref) => { this.scrollElem = ref; }}>
                        <MenuItemTitle {...titles} />
                        {menuItems}
                        <li className="MenuItem hidden" />
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
    aspect: PropTypes.oneOf(Object.keys(Dimensions)).isRequired,
};

Menu.defaultProps = {
    contents: {},
};

export default Menu;

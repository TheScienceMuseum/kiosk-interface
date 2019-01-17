import React from 'react';
import PropTypes from 'prop-types';

import { TweenLite, Ease } from 'gsap/umd/TweenLite';
import Hammer from 'react-hammerjs';
import HammerJS from 'hammerjs';

import {
    ArticleTypes, PageTypes, Orientations, ScreenSize,
} from '../Constants';
import Title from './pages/Title';
import Video from './pages/Video';
import TextImage from './pages/TextImage';
import Image from './pages/Image';

import '../styles/components/Article.scss';

import NavButtons from './navbar/NavButtons';
import MenuPips from './MenuPips';
import NavBar from './navbar/NavBar';

/*
 * Article:
 *
 * @author Gavin Cockrem <gavin@joipolloi.com.
 * @package sciencemuseum-kiosk-interface
 */

class Article extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 0,
            navHidden: false,
        };

        this.handleSwipe = this.handleSwipe.bind(this);
        this.scrollToPage = this.scrollToPage.bind(this);
        this.prevPage = this.prevPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.onJump = this.jumpToPage.bind(this);
        this.toggleNavHide = this.toggleNavHide.bind(this);
        this.handleHomeButton = this.handleHomeButton.bind(this);
        // this.article = null;

        const { articleID } = this.props;
        // const articleID = location;

        this.articleContent = this.getArticleContents(articleID);
        this.article = this.makeArticle(this.articleContent);
        this.articleTween = null;
        this.scrollElem = null;
    }


    componentDidMount() {
        // console.log('Article: componentDidMount: this.scrollElem: ', this.scrollElem);
    }

    getArticleContents(articleID) {
        const { contents } = this.props;
        const thisContent = contents.filter(item => (item.articleID === articleID));
        // console.log('Article: getArticleContents: thisContent: ', thisContent);
        return thisContent[0];
    }

    toggleNavHide(forceHidden = null) {
        let { navHidden } = this.state;
        if (!forceHidden) {
            navHidden = !navHidden;
        } else {
            navHidden = forceHidden;
        }
        this.setState({ navHidden });
    }

    makeArticle(articleContent) {
        // let pagesOutput;

        const { stopTimer } = this.props;

        switch (articleContent.type) {
        case ArticleTypes.MIXED:
            return this.makeMixedArticle(articleContent);
        case ArticleTypes.VIDEO:
            stopTimer();
            return <Video {...articleContent} />;
        default:
            return null;
        }
    }

    makeMixedArticle(articleContent) {
        const pages = articleContent.subpages;
        // console.log('Article: makeArticle: pages: ', pages);
        const pagesOutput = pages.map(page => {
            const { pageID } = page;
            let pageOut;
            switch (page.type) {
            case PageTypes.TITLE:
                pageOut = <Title key={pageID} {...page} />;
                break;
            case PageTypes.TEXT_IMAGE:
                pageOut = <TextImage key={pageID} toggleNavHide={this.toggleNavHide} {...page} />;
                break;
            case PageTypes.IMAGE:
                pageOut = <Image key={pageID} toggleNavHide={this.toggleNavHide} {...page} />;
                break;
            default:
                break;
            }
            return pageOut;
        });

        return pagesOutput;
    }

    handleSwipe(e) {
        // console.log('Article: handleSwipe: e: ', e);
        // console.log('Article: handleSwipe: e.direction: ', e.direction);
        // console.log('Article: handleSwipe: ', HammerJS.DIRECTION_DOWN);
        // console.log('Article: handleSwipe: ', HammerJS.DIRECTION_UP);

        if (e.direction === HammerJS.DIRECTION_UP) {
            this.nextPage();
        } else if (e.direction === HammerJS.DIRECTION_DOWN) {
            this.prevPage();
        }
    }

    nextPage() {
        // console.log('Article: nextPage');

        let { currentPage } = this.state;
        const { navHidden } = this.state;
        const { subpages } = this.articleContent;

        if (currentPage === (subpages.length - 1) || navHidden) return;

        currentPage += 1;

        this.setState({ currentPage }, this.scrollToPage);
    }

    prevPage() {
        // console.log('Article: prevPage');
        let { currentPage } = this.state;
        const { navHidden } = this.state;

        if (currentPage === 0 || navHidden) return;
        currentPage -= 1;
        this.setState({ currentPage }, this.scrollToPage);
    }

    jumpToPage(pageID) {
        const { subpages } = this.articleContent;
        // console.log('Article: jumpToPage: pageID: ', pageID);
        const currentPage = subpages.map(e => e.pageID).indexOf(pageID);
        // console.log('Article: jumpToPage: currentPage: ', currentPage);
        this.setState({ currentPage }, this.scrollToPage);
    }


    scrollToPage() {
        // console.log('Article: scrollToPage: this.scrollElem: ', this.scrollElem);
        const { currentPage } = this.state;
        const { resetInactiveTimer } = this.props;
        const targetScroll = currentPage * ScreenSize.height;
        // console.log('Article: scrollToPage: targetScroll: ', targetScroll);
        // this.scrollElem.scrollTop = targetScroll;
        resetInactiveTimer(true);
        const options = { scrollTop: targetScroll, ease: Ease.easeOut };
        this.articleTween = TweenLite.to(this.scrollElem, 0.25, options);
    }

    handleHomeButton() {
        const { loadArticle } = this.props;
        loadArticle('menu');
    }

    render() {
        // const { show } = this.props;
        // const startState = { autoAlpha: 0, y: -50 };

        const { currentPage, navHidden } = this.state;
        const { subpages } = this.articleContent;
        const subpagesCount = (subpages) ? subpages.length : 1;

        const articleClass = (navHidden) ? 'Article--fullScreen' : '';

        return (
            <Hammer onSwipe={this.handleSwipe} direction="DIRECTION_VERTICAL">
                <article className={`Article ${articleClass}`}>

                    <div className="Article__Container" ref={ref => { this.scrollElem = ref; }}>
                        { this.article }
                    </div>
                    <NavBar
                        showNav={subpages && (subpages.length > 1)}
                        onHomeClick={this.handleHomeButton}
                        onPrev={this.prevPage}
                        onNext={this.nextPage}
                        orientation={Orientations.VERTICAL}
                        currentPage={currentPage}
                        totalPages={subpagesCount}
                        hidden={navHidden}
                    />
                </article>
            </Hammer>

        );
    }
}

Article.propTypes = {
    articleID: PropTypes.string.isRequired,
    contents: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    loadArticle: PropTypes.func.isRequired,
    resetInactiveTimer: PropTypes.func.isRequired,
    stopTimer: PropTypes.func.isRequired,
};

export default Article;

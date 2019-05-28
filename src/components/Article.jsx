import React from 'react';
import PropTypes from 'prop-types';

import { TweenLite, Ease } from 'gsap/umd/TweenLite';
import Hammer from 'react-hammerjs';
import HammerJS from 'hammerjs';

import {
    ArticleTypes, PageTypes, Orientations, ScreenSize,
} from '../utils/Constants';
import Title from './pages/Title';
import Video from './pages/Video';
import TextImage from './pages/TextImage';
import Image from './pages/Image';

import '../styles/components/Article.scss';

// import NavButtons from './navbar/NavButtons';
// import MenuPips from './MenuPips';
import NavBar from './navbar/NavBar';
import Model from './pages/Model';

/*
 * Article:
 *
 * @author Gavin Cockrem <gavin@joipolloi.com.
 * @package sciencemuseum-kiosk-interface
 */

class Article extends React.Component {
    static pauseOnNavigation() {
        const videoPlayer = document.querySelector('.video-react-video');
        if (videoPlayer === null) {
            return;
        }
        videoPlayer.pause();
    }

    constructor(props) {
        super(props);
        this.state = {
            currentPage: 0,
            currentPageType: 'title',
            navHidden: false,
        };

        this.handleSwipe = this.handleSwipe.bind(this);
        this.scrollToPage = this.scrollToPage.bind(this);
        this.prevPage = this.prevPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
        // this.onJump = this.jumpToPage.bind(this);
        this.toggleNavHide = this.toggleNavHide.bind(this);
        this.handleHomeButton = this.handleHomeButton.bind(this);
        Article.pauseOnNavigation = Article.pauseOnNavigation.bind(this);
        // this.article = null;

        const { articleID } = this.props;
        // const articleID = location;

        this.articleContent = this.getArticleContents(articleID);
        this.article = this.makeArticle(this.articleContent);
        // this.articleTween = null;
        this.scrollElem = null;
    }


    componentDidMount() {
        // console.log('Article: componentDidMount: this.scrollElem: ', this.scrollElem);
        // console.log(' articleID: ', articleID);
    }

    // componentDidUpdate(prevProps, prevState, snapshot) {
    //     // console.log(prevProps);
    //     // console.log('this.articleContent: ', this.articleContent);
    // }

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

        const { pauseTimer, resetInactiveTimer } = this.props;

        // console.log('articleConten: ', articleContent);

        switch (articleContent.type) {
        case ArticleTypes.MIXED:
            return this.makeMixedArticle(articleContent);
        case ArticleTypes.VIDEO:
            pauseTimer();
            // console.log('VIDEO articleContent: ', articleContent);
            return (
                <Video
                    {...articleContent}
                    handleCloseButton={this.handleHomeButton}
                    pauseTimer={pauseTimer}
                    resetInactiveTimer={resetInactiveTimer}
                    autoPlay
                />
            );
        case ArticleTypes.MODEL:
            console.log('MODEL articleContent: ', articleContent);

            return (
                <Model {...articleContent} />
            );
        default:
            return null;
        }
    }

    makeMixedArticle(articleContent) {
        const pages = articleContent.subpages;
        const { pauseTimer, resetInactiveTimer } = this.props;
        // console.log('Article: makeArticle: pages: ', pages);
        const pagesOutput = pages.map((page) => {
            const { pageID } = page;
            // console.log('page: ', page);
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
            case PageTypes.VIDEO:
                pageOut = (
                    <Video
                        {...page}
                        handleCloseButton={this.handleHomeButton}
                        pauseTimer={pauseTimer}
                        resetInactiveTimer={resetInactiveTimer}
                        autoPlay={false}
                    />
                );
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
        let { currentPageType } = this.state;
        const { navHidden } = this.state;
        const { subpages } = this.articleContent;

        Article.pauseOnNavigation();

        if (currentPage === (subpages.length - 1) || navHidden) return;
        currentPage += 1;
        currentPageType = subpages[currentPage].type;

        // console.log(currentPageType);

        this.setState({ currentPage, currentPageType }, this.scrollToPage);
    }

    prevPage() {
        // console.log('Article: prevPage');

        let { currentPageType } = this.state;
        let { currentPage } = this.state;
        const { navHidden } = this.state;
        const { subpages } = this.articleContent;

        Article.pauseOnNavigation();

        if (currentPage === 0 || navHidden) return;
        currentPage -= 1;
        currentPageType = subpages[currentPage].type;

        // console.log(currentPageType);

        this.setState({ currentPage, currentPageType }, this.scrollToPage);
    }

    // jumpToPage(pageID) {
    //     const { subpages } = this.articleContent;
    //     // console.log('Article: jumpToPage: pageID: ', pageID);
    //     const currentPage = subpages.map(e => e.pageID).indexOf(pageID);
    //     // console.log('Article: jumpToPage: currentPage: ', currentPage);
    //     this.setState({ currentPage }, this.scrollToPage);
    // }


    scrollToPage() {
        // console.log('Article: scrollToPage: this.scrollElem: ', this.scrollElem);
        const { currentPage } = this.state;
        // const { resetInactiveTimer } = this.props;
        const targetScroll = currentPage * ScreenSize.height;
        // console.log('Article: scrollToPage: targetScroll: ', targetScroll);
        // this.scrollElem.scrollTop = targetScroll;
        // resetInactiveTimer(true);
        const options = { scrollTop: targetScroll, ease: Ease.easeOut };
        this.articleTween = TweenLite.to(this.scrollElem, 0.25, options);
    }

    handleHomeButton() {
        const { loadArticle, resetInactiveTimer } = this.props;
        resetInactiveTimer();
        loadArticle('menu');
    }

    render() {
        // const { show } = this.props;
        // const startState = { autoAlpha: 0, y: -50 };
        let { navHidden } = this.state;
        const { currentPage, currentPageType } = this.state;
        const { singleArticleMode } = this.props;
        const { subpages } = this.articleContent;
        const subpagesCount = (subpages) ? subpages.length : 1;

        if (this.articleContent.type === ArticleTypes.VIDEO) {
            navHidden = true;
        }

        const articleClass = (navHidden) ? 'Article--fullScreen' : '';

        // console.log('Article: render: subpages: ', subpages);
        // console.log('Article: render: subpagesCount: ', subpagesCount);

        return (
            <Hammer onSwipe={this.handleSwipe} direction="DIRECTION_VERTICAL">
                <article className={`Article ${articleClass}`}>
                    <div className="Article__Container" ref={(ref) => { this.scrollElem = ref; }}>
                        {(this.articleContent.type === ArticleTypes.MODEL
                            && <Model currentSection={currentPage} {...this.articleContent} />
                        ) || (
                            this.article
                        )}
                    </div>
                    {this.articleContent.type !== ArticleTypes.VIDEO && (
                        <NavBar
                            showNav={(subpagesCount > 1)}
                            onHomeClick={this.handleHomeButton}
                            onPrev={this.prevPage}
                            onNext={this.nextPage}
                            orientation={Orientations.VERTICAL}
                            currentPage={currentPage}
                            currentPageType={currentPageType}
                            totalPages={subpagesCount}
                            hidden={navHidden}
                            hideHome={singleArticleMode}
                        />
                    )}
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
    pauseTimer: PropTypes.func.isRequired,
    singleArticleMode: PropTypes.bool,
};

Article.defaultProps = {
    singleArticleMode: false,
};

export default Article;

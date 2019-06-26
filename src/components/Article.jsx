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
import TextVideo from './pages/TextVideo';

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
            dateLineClosed: true,
            firstDate: -1,
        };

        this.handleSwipe = this.handleSwipe.bind(this);
        this.scrollToPage = this.scrollToPage.bind(this);
        this.prevPage = this.prevPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
        // this.onJump = this.jumpToPage.bind(this);
        this.toggleNavHide = this.toggleNavHide.bind(this);
        this.handleHomeButton = this.handleHomeButton.bind(this);
        this.handleChangeCurrentPage = this.handleChangeCurrentPage.bind(this);
        Article.pauseOnNavigation = Article.pauseOnNavigation.bind(this);
        // this.article = null;

        const { articleID } = this.props;
        // const articleID = location;

        this.articleContent = this.getArticleContents(articleID);

        // this.articleTween = null;
        this.scrollElem = null;
    }


    componentDidMount() {
        // console.log('Article: componentDidMount: this.scrollElem: ', this.scrollElem);
        // console.log(' articleID: ', articleID);
        this.article = this.makeArticle(this.articleContent);
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

    getDateLineClass() {
        const { currentPage, firstDate } = this.state;

        // eslint-disable-next-line max-len
        const targetHeight = ((currentPage - firstDate) * ScreenSize[window.appJson.aspect_ratio].height);
        // eslint-disable-next-line max-len
        const targetTop = (firstDate * ScreenSize[window.appJson.aspect_ratio].height) + (ScreenSize[window.appJson.aspect_ratio].height / 2);

        const { dateLineClosed } = this.state;
        if (dateLineClosed) {
            return {
                height: '0px',
                top: `${targetTop}px`,
            };
        }

        return {
            height: `${targetHeight}px`,
            top: `${targetTop}px`,
        };
    }

    getFirstDateLineClass() {
        const { dateLineClosed } = this.state;
        if (!dateLineClosed) {
            return 'open';
        }
        return '';
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

        const { pauseTimer, resetInactiveTimer, autoPlay } = this.props;
        console.log(articleContent);
        // console.log('articleConten: ', articleContent);

        switch (articleContent.type) {
        case ArticleTypes.MIXED:
        case ArticleTypes.TIMELINE:
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
                    autoPlay={autoPlay}
                    showNav
                />
            );
        default:
            return null;
        }
    }

    makeMixedArticle(articleContent) {
        const pages = articleContent.subpages;
        const { pauseTimer, resetInactiveTimer } = this.props;
        // console.log('Article: makeArticle: pages: ', pages);
        let firstDateSet = false;

        const pagesOutput = pages.map((page, n) => {
            const { pageID } = page;
            // console.log('page: ', page);
            let pageOut;
            if (typeof page.date !== 'undefined' && !firstDateSet) {
                this.setState({ firstDate: n });
                firstDateSet = true;
            }
            switch (page.type) {
            case PageTypes.TITLE:
                pageOut = <Title key={pageID} {...page} />;
                break;
            case PageTypes.TEXT_IMAGE:
            case PageTypes.TEXT_AUDIO:
                pageOut = (
                    <TextImage
                        key={pageID}
                        toggleNavHide={this.toggleNavHide}
                        {...page}
                        pauseTimer={pauseTimer}
                        resetInactiveTimer={resetInactiveTimer}
                    />
                );
                break;
            case PageTypes.VIDEO_TEXT:
                pageOut = (
                    <TextVideo
                        key={pageID}
                        toggleNavHide={this.toggleNavHide}
                        pauseTimer={pauseTimer}
                        resetInactiveTimer={resetInactiveTimer}
                        {...page}
                    />
                );
                break;
            case PageTypes.IMAGE:
                pageOut = <Image key={pageID} toggleNavHide={this.toggleNavHide} {...page} />;
                break;
            case PageTypes.VIDEO:
                pageOut = (
                    <Video
                        {...page}
                        key={pageID}
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
        const { firstDate } = this.state;
        let { dateLineClosed } = this.state;
        if (currentPage <= firstDate) {
            dateLineClosed = true;
        } else {
            dateLineClosed = false;
        }

        this.setState({ currentPage, currentPageType, dateLineClosed }, this.scrollToPage);
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
        const { firstDate } = this.state;
        let { dateLineClosed } = this.state;
        if (currentPage <= firstDate) {
            dateLineClosed = true;
        } else {
            dateLineClosed = false;
        }

        this.setState({ currentPage, currentPageType, dateLineClosed }, this.scrollToPage);
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
        const targetScroll = currentPage * ScreenSize[window.appJson.aspect_ratio].height;
        // console.log('Article: scrollToPage: targetScroll: ', targetScroll);
        // this.scrollElem.scrollTop = targetScroll;
        // resetInactiveTimer(true);
        const options = { scrollTop: targetScroll, ease: Ease.easeOut };
        this.articleTween = TweenLite.to(this.scrollElem, 0.4, options);
    }

    handleHomeButton() {
        const { loadArticle, resetInactiveTimer } = this.props;
        resetInactiveTimer();
        loadArticle('menu');
    }

    handleChangeCurrentPage(currentPage) {
        this.setState(prevState => ({
            ...prevState,
            currentPage,
        }));
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
        const { firstDate } = this.state;
        return (
            <Hammer onSwipe={this.handleSwipe} direction="DIRECTION_VERTICAL">
                <article className={`Article ${articleClass}`}>
                    <div className="Article__Container" ref={(ref) => { this.scrollElem = ref; }}>
                        {(this.articleContent.type === ArticleTypes.MODEL
                            && (
                                <Model
                                    currentSection={currentPage}
                                    onChangeCurrentPage={this.handleChangeCurrentPage}
                                    {...this.articleContent}
                                />
                            )
                        ) || (
                            <React.Fragment>
                                { firstDate > -1 && (
                                    <React.Fragment>
                                        <div className="dateLine" style={this.getDateLineClass()} />
                                    </React.Fragment>
                                )}
                                { this.article }
                            </React.Fragment>
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
                    {this.articleContent.type === ArticleTypes.VIDEO && (
                        <NavBar
                            showNav={false}
                            onHomeClick={this.handleHomeButton}
                            onPrev={() => {}}
                            onNext={() => {}}
                            orientation={Orientations.VERTICAL}
                            currentPage={0}
                            totalPages={0}
                            hidden={false}
                            hideHome={false}
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
    autoPlay: PropTypes.bool,
};

Article.defaultProps = {
    singleArticleMode: false,
    autoPlay: false,
};

export default Article;

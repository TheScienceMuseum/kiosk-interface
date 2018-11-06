import React from 'react';
// import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';
import { Link } from 'react-router-dom';
import { Ease, TweenMax } from 'gsap/all';
import Hammer from 'react-hammerjs';


import { ArticleTypes, PageTypes, Orientations } from './DataTypes';
import Title from './pages/Title';
import Video from './pages/Video';
import TextImage from './pages/TextImage';
import Image from './pages/Image';

import '../styles/Article.scss';
import TweenLite from 'gsap/TweenLite';
import NavButtons from './NavButtons';
import MenuPips from './MenuPips';

/*
 * Article:
 *
 * @author Gavin Cockrem <gavin@joipolloi.com.
 * @package sciencemuseum-kiosk-interface
 */

class Article extends React.Component {
    static makeMixedArticle(articleContent) {
        const pages = articleContent.subpages;
        console.log('Article: makeArticle: pages: ', pages);
        const pagesOutput = pages.map(page => {
            const { pageID } = page;
            let pageOut;
            switch (page.type) {
            case PageTypes.TITLE:
                pageOut = <Title key={pageID} {...page} />;
                break;
            case PageTypes.TEXT_IMAGE:
                pageOut = <TextImage key={pageID} {...page} />;
                break;
            case PageTypes.IMAGE:
                pageOut = <Image key={pageID} {...page} />;
                break;
            default:
                break;
            }
            return pageOut;
        });

        return pagesOutput;
    }

    static makeArticle(articleContent) {
        // let pagesOutput;

        switch (articleContent.type) {
        case ArticleTypes.MIXED:
            return Article.makeMixedArticle(articleContent);
        case ArticleTypes.VIDEO:
            return <Video {...articleContent} />;
        default:
            break;
        }
    }

    constructor(props) {
        super(props);
        this.state = { currentPage: 0 };

        this.handleSwipe = this.handleSwipe.bind(this);
        this.scrollToPage = this.scrollToPage.bind(this);
        this.prevPage = this.prevPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.onJump = this.jumpToPage.bind(this);
        // this.article = null;

        const { match } = this.props;
        const { articleID } = match.params;

        this.articleContent = this.getArticleContents(articleID);
        this.article = Article.makeArticle(this.articleContent);
        this.articleTween = null;
        this.scrollElem = null;
    }

    componentDidMount() {
        console.log('Article: componentDidMount: this.scrollElem: ', this.scrollElem);
    }

    getArticleContents(articleID) {
        const { contents } = this.props;
        const thisContent = contents.filter(item => (item.articleID === articleID));
        // console.log('Article: getArticleContents: thisContent: ', thisContent);
        return thisContent[0];
    }

    handleSwipe(e) {
        // console.log('Article: handleSwipe: e: ', e);
        // console.log('Article: handleSwipe: e.direction: ', e.direction);
        if (e.direction === 8) {
            this.nextPage();
        } else if (e.direction === 16) {
            this.prevPage();
        }
    }

    nextPage() {
        // console.log('Article: nextPage');

        let { currentPage } = this.state;
        const { subpages } = this.articleContent;

        if (currentPage === (subpages.length - 1)) return;

        currentPage += 1;

        this.setState({ currentPage }, this.scrollToPage);
    }

    prevPage() {
        // console.log('Article: prevPage');
        let { currentPage } = this.state;
        if (currentPage === 0) return;
        currentPage -= 1;
        this.setState({ currentPage }, this.scrollToPage);
    }

    jumpToPage(pageID) {
        console.log('Article: jumpToPage: pageID: ', pageID);
    }

    scrollToPage() {
        // console.log('Article: scrollToPage: this.scrollElem: ', this.scrollElem);
        const { currentPage } = this.state;
        const targetScroll = currentPage * 1080;
        // console.log('Article: scrollToPage: targetScroll: ', targetScroll);
        // console.log('Article: scrollToPage: this.scrollElem.scrollTop: ', this.scrollElem.scrollTop);

        // this.scrollElem.scrollTop = targetScroll;

        this.articleTween = TweenLite.to(this.scrollElem, 0.25, { scrollTop: targetScroll, ease: Ease.easeOut });
    }

    render() {
        // const { show } = this.props;
        // const startState = { autoAlpha: 0, y: -50 };

        const { currentPage } = this.state;
        const { subpages } = this.articleContent;

        return (
            <Hammer onSwipe={this.handleSwipe} direction="DIRECTION_VERTICAL">
                <article className="Article">
                    <Link to="/" className="NavButtonHome"><button type="button" className="Button NavButton">Home</button></Link>
                    <div className="Article__Container" ref={ref => { this.scrollElem = ref; }}>
                        { this.article }
                    </div>
                    <MenuPips
                        onJump={this.onJump}
                        contents={subpages}
                        currentFocused={currentPage}
                    />
                    <NavButtons onPrev={this.prevPage} onNext={this.nextPage} orientation={Orientations.VERTICAL} />
                </article>
            </Hammer>

        );
    }
}

Article.propTypes = {
    // articleID: PropTypes.string.isRequired,
};

export default Article;

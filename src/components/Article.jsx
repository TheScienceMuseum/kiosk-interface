import React from 'react';
// import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';
import { Link } from 'react-router-dom';
import { TweenMax } from 'gsap/all';


import { ArticleTypes, PageTypes } from './DataTypes';
import Title from './pages/Title';
import Video from './pages/Video';
import TextImage from './pages/TextImage';
import Image from './pages/Image';

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

    constructor(props) {
        super(props);
        this.state = { };
    }

    getArticleContents(articleID) {
        const { contents } = this.props;
        const thisContent = contents.filter(item => (item.articleID === articleID));
        console.log('Article: getArticleContents: thisContent: ', thisContent);
        return thisContent[0];
    }

    makeArticle() {
        const { match } = this.props;
        const { articleID } = match.params;
        const articleContent = this.getArticleContents(articleID);
        // let pagesOutput;

        switch (articleContent.type) {
        case ArticleTypes.MIXED:
            return this.makeMixedArticle(articleContent);
        case ArticleTypes.VIDEO:
            return <Video {...articleContent} />;
        default:
            break;
        }
    }


    render() {
        const { show } = this.props;
        const startState = { autoAlpha: 0, y: -50 };

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
                <article>
                    <Link to="/" className="NavButtonHome"><button type="button" className="NavButton">Home</button></Link>
                    { this.makeArticle() }
                </article>

            </Transition>
        );
    }
}

Article.propTypes = {
    // articleID: PropTypes.string.isRequired,
};

export default Article;

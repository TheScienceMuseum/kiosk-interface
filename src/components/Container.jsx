import React from 'react';
// import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Route, Switch, withRouter } from 'react-router-dom';

import Menu from './Menu';
import Article from './Article';

/*
 * Container:
 *
 *
 * @author Gavin Cockrem <gavin@joipolloi.com.
 * @package sciencemuseum-kiosk-interface
 */


function Container(props) {
    const {
        data, location, onArticleLoad, activeArticle,
    } = props;
    // console.log('Container: render: data: ', data);
    // console.log('Container: render: location: ', location);
    // console.log('Container: render: props: ', props);

    return (
        <TransitionGroup className="transition-group">
            <CSSTransition
                key={location.key}
                timeout={{ enter: 300, exit: 300 }}
                classNames="fade"
            >
                <Switch location={location}>
                    <Route
                        path="/index.html"
                        render={() => (
                            <Menu
                                titles={data.titles}
                                contents={data.contents}
                                location={location}
                                activeArticle={activeArticle}
                                onArticleLoad={onArticleLoad}
                            />)
                        }
                    />
                    <Route
                        path="/article/:articleID"
                        render={match => (
                            <Article
                                contents={data.contents}
                                {...match}
                                location={location}
                            />)
                        }
                    />

                    <Route render={() => <div>Not Found</div>} />
                </Switch>
            </CSSTransition>
        </TransitionGroup>
    );
}

export default withRouter(Container);

import React from 'react';
import PropTypes from 'prop-types';

/*
 * MenuItemMixed.jsx:
 *
 *
 * @author Gavin Cockrem <gavin@joipolloi.com.
 * @package sciencemuseum-kiosk-interface
 */


class MenuItemMixed extends React.Component {
    render() {
        const {
            title, titleImage, articleID, onClick,
        } = this.props;

        return (
            <li className="MenuItem MenuItem__Mixed">
                {/* <Link to={`/article/${articleID}`}> */}
                <button type="button" onClick={() => onClick(articleID)}>
                    <img src={titleImage} alt="" />
                    <h2>{title}</h2>
                </button>
                {/* </Link> */}
            </li>
        );
    }
}

MenuItemMixed.propTypes = {
    title: PropTypes.string.isRequired,
    titleImage: PropTypes.string.isRequired,
    articleID: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default MenuItemMixed;

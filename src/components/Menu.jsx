import React from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';
import MenuItemTitle from './menuitems/MenuItemTitle';
import MenuItemMixed from './menuitems/MenuItemMixed';
import MenuItemVideo from './menuitems/MenuItemVideo';

import { MenuItemTypes } from './DataTypes';

/*
 * Menu:
 *
 * @author Gavin Cockrem <gavin@joipolloi.com.
 * @package sciencemuseum-kiosk-interface
 */

class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { contents, titles } = this.props;

        const menuItems = contents.map(item => {

            console.log('Menu: contents.map: item: ', item.type);

            switch (item.type) {
            case MenuItemTypes.VIDEO:
                return <MenuItemVideo key={shortid.generate()} {...item} />;
            case MenuItemTypes.MIXED:
                return <MenuItemMixed key={shortid.generate()} {...item} />;
            default:
                break;
            }
        });

        console.log('Menu: render: menuItems: ', menuItems);

        return (
            <div className="Menu">
                <MenuItemTitle title={titles.title} subtitle={titles.galleryName} />
                {menuItems}
            </div>
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

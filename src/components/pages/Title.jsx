import React from 'react';
import PropTypes from 'prop-types';

import '../../styles/components/pages/Title.scss';
import propTypes from '../../propTypes';

/*
 * Title:
 *
 *
 * @author Gavin Cockrem <gavin@joipolloi.com.
 * @package sciencemuseum-kiosk-interface
 */


function Title(props) {
    const { title, subtitle, asset } = props;

    const imageStyle = {
        background: `url(${asset.assetSource})`,
    };

    return (
        <div className="Page PageTitle">
            {asset
            && <div className="Image Image--withGrad" style={imageStyle} />
            }
            <div className="PageTitle__Content">
                <h1>{ title }</h1>
                <h2>{ subtitle }</h2>
            </div>
        </div>
    );
}

Title.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    asset: propTypes.asset,
};

Title.defaultProps = {
    subtitle: '',
    asset: null,
};

export default Title;

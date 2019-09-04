/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';

import '../../styles/components/pages/Title.scss';
import propTypes from '../../propTypes';

import createBodyTag from '../../utils/createBodyTag';
import getThumb from '../generic/getThumb';
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
        background: `url(${getThumb(asset.assetSource)})`,
    };

    return (
        <div className="Page PageTitle">
            {asset
            && <div className="Image Image--withGrad" style={imageStyle} />
            }
            <div className="PageTitle__Content">
                <h1>{ title }</h1>
                {subtitle && (
                    <h3
                        dangerouslySetInnerHTML={{ __html: createBodyTag(subtitle) }}
                    />
                )}
            </div>
        </div>
    );
}

Title.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string)])
        .isRequired,
    asset: propTypes.asset,
};

Title.defaultProps = {
    asset: null,
};

export default Title;

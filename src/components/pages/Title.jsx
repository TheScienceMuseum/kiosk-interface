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
    const { title, subtitle, image } = props;

    const imageStyle = {
        background: `url(${image})`,
    };

    return (
        <div className="Page PageTitle">
            {image
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
    image: PropTypes.string,
};

Title.defaultProps = {
    subtitle: '',
    image: null,
};

export default Title;

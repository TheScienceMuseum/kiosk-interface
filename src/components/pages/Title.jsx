import React from 'react';
import PropTypes from 'prop-types';

/*
 * Title:
 *
 *
 * @author Gavin Cockrem <gavin@joipolloi.com.
 * @package sciencemuseum-kiosk-interface
 */


function Title(props) {
    const { title, subtitle } = props;

    return (
        <div className="Page_Title">
            <h1>{ title }</h1>
            <h2>{ subtitle }</h2>
        </div>
    );
}

Title.propTypes = {
    title: PropTypes.string().isRequired,
    subtitle: PropTypes.string(),
};

Title.defaultProps = {
    subtitle: '',
};

export default Title;

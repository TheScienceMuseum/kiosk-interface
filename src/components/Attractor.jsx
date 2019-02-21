import React from 'react';
import PropTypes from 'prop-types';

import propTypes from '../propTypes';

import '../styles/components/Attractor.scss';

/*
 * Attractor:
 *
 * @author Gavin Cockrem <gavin@joipolloi.com.
 * @package sciencemuseum-kiosk-interface
 */

class Attractor extends React.Component {
    render() {
        const {
            attractor, galleryName, title, start,
        } = this.props;

        return (
            <div className="Attractor">
                <div className="Image--withGrad">
                    <img src={attractor.assetSource} alt="" />
                </div>
                <div className="Attractor__details">
                    <p>{ galleryName }</p>
                    <h1>{ title }</h1>
                    <button type="button" onClick={start} className="Button">Touch to start</button>
                </div>

            </div>
        );
    }
}

Attractor.propTypes = {
    attractor: propTypes.asset.isRequired,
    title: PropTypes.string.isRequired,
    galleryName: PropTypes.string.isRequired,
    start: PropTypes.func.isRequired,
};

export default Attractor;

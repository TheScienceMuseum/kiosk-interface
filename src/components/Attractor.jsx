import React from 'react';
import PropTypes from 'prop-types';

import propTypes from '../propTypes';

import '../styles/components/Attractor.scss';
import { AssetTypes } from '../utils/Constants';

/*
 * Attractor:
 *
 * @author Gavin Cockrem <gavin@joipolloi.com.
 * @package sciencemuseum-kiosk-interface
 */

class Attractor extends React.Component {
    makeAttractor() {
        const { attractor } = this.props;

        if (attractor.assetType === AssetTypes.IMAGE) {
            return (
                <div className="Attractor__image Image--withGrad">
                    <img src={attractor.assetSource} alt="" />
                </div>
            );
        }
        return (
            <div className="Attractor__video Image--withGrad">
                <video autoPlay loop controls={false} muted>
                    <source src={attractor.assetSource} type="video/mp4" />
                    <track kind="captions" />
                </video>
            </div>
        );
    }

    render() {
        const {
            galleryName, title, start,
        } = this.props;

        return (
            <div className="Attractor">
                {this.makeAttractor()}
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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Environments } from '../Constants';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        // In the BROWSER env this will just log to the console,
        // when we are running in the kiosk-client this
        // will be intercepted by our custom logger
        console.error(JSON.stringify([error.toString(), info]));
    }

    render() {
        const { hasError } = this.state;
        const { children } = this.props;

        if (hasError) {
            return (
                <div className="App">
                    <h1>We are sorry</h1>
                    <small>
                        Something went wrong, we are aware and will resolve the issue shortly.
                    </small>
                </div>
            );
        }

        return children;
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]).isRequired,
};

export default ErrorBoundary;

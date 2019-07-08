import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, errorMessage: '' };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, errorMessage: JSON.stringify([error.message, error.stack]) };
    }

    componentDidCatch(error, info) {
        // In the BROWSER env this will just log to the console,
        // when we are running in the kiosk-client this
        // will be intercepted by our custom logger
        console.error(JSON.stringify([error.toString(), info]));
    }

    render() {
        const { hasError, errorMessage } = this.state;
        const { children } = this.props;

        if (hasError) {
            return (
                <div className="App">
                    <h1>We are sorry</h1>
                    <small>
                        Something went wrong, we are aware and will resolve the issue shortly.
                    </small>
                    <input type="hidden" value={errorMessage} />
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

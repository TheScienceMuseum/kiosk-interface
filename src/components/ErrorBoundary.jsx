import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../styles/components/ErrorBoundary.scss';

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
        console.log("we have an error!");
    }

    render() {
        const { hasError, errorMessage } = this.state;
        const { children } = this.props;

        if (hasError) {
            return (
                <div className="App AppError">
                    <div>
                        <h4>Oops!</h4>
                        <h1>Something has gone wrong!</h1>
                        <input type="hidden" value={errorMessage} />
                    </div>
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

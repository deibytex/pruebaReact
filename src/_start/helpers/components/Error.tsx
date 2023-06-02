import React from "react";

interface ErrorBoundaryState {
    error?: Error;
    errorInfo?: React.ErrorInfo;
}
export default class ErrorBoundaryComponent extends React.Component<{}, ErrorBoundaryState> {
    constructor(props: any) {
        super(props);
        this.state = { error: undefined, errorInfo: undefined };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo,
        });

        // el error se puede enviar a cualquier servicio externo

    }

    render() {
        if (this.state.error) {
            return <h2>{this.state.error?.message}</h2>
        }

        return this.props.children;
    }
}
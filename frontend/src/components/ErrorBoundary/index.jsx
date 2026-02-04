import React from 'react';
import ErrorPage from '../../pages/ErrorPage';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <ErrorPage
                    title="RẤT TIẾC! ĐÃ CÓ LỖI XẢY RA"
                    message="Hệ thống gặp sự cố không mong muốn khi hiển thị trang này. Vui lòng thử lại hoặc tải lại trang."
                    details={this.state.error?.toString()}
                    buttonText="TẢI LẠI TRANG"
                    onButtonClick={() => window.location.reload()}
                />
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;

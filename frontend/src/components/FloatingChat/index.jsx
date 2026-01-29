import React from 'react';
import './floating-chat.css';

const FloatingChat = () => {
    return (
        <div className="floating-chat">
            {/* Zalo Chat */}
            <a
                href="https://zalo.me/kfcvietnam"
                className="chat-bubble zalo"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat qua Zalo"
            >
                <i className="bi bi-chat-dots-fill"></i>
            </a>

            {/* Messenger Chat */}
            <a
                href="https://m.me/KFCVietnam"
                className="chat-bubble messenger"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat qua Messenger"
            >
                <i className="bi bi-messenger"></i>
            </a>
        </div>
    );
};

export default FloatingChat;

import React from 'react';
import './floating-chat.css';
import { BsChatDotsFill, BsMessenger } from 'react-icons/bs';

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
                <BsChatDotsFill />
            </a>

            {/* Messenger Chat */}
            <a
                href="https://m.me/KFCVietnam"
                className="chat-bubble messenger"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat qua Messenger"
            >
                <BsMessenger />
            </a>
        </div>
    );
};

export default FloatingChat;

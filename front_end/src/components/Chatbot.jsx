import React, { useState } from 'react';
import './Chatbot.css';

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="chatbot-wrapper">
            {isOpen && (
                <aside className="chatbot-container">
                    <div className="chatbot-header">
                        <h5>AI Assistant</h5>
                        <button className="chatbot-close" onClick={toggleChat} aria-label="Close Chat">
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>
                    <div className="chatbot-messages">
                        <div className="message ai">
                            <p>Hello! I am your AI assistant. How can I help you with navigation or product choices today?</p>
                        </div>
                    </div>
                    <div className="chatbot-input">
                        <input type="text" placeholder="Type your message..." />
                        <button type="button" aria-label="Send Message"><i className="bi bi-send"></i></button>
                    </div>
                </aside>
            )}
            {!isOpen && (
                <button className="chatbot-toggle" onClick={toggleChat} aria-label="Open Chat">
                    <i className="bi bi-chat-dots"></i>
                </button>
            )}
        </div>
    );
}

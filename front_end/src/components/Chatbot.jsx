import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

const INITIAL_MESSAGE = {
    role: 'ai',
    text: 'Ciao! Sono il tuo assistente AI. Come posso aiutarti con la navigazione o la scelta dei prodotti?',
};

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([INITIAL_MESSAGE]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async () => {
        const trimmed = input.trim();
        if (!trimmed || isLoading) return;

        const newMessages = [...messages, { role: 'user', text: trimmed }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const res = await fetch('http://localhost:3000/chatbot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMessages }),
            });
            const data = await res.json();
            setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
        } catch (err) {
            console.error("Errore chatbot:", err);
            setMessages(prev => [...prev, { role: 'ai', text: 'Errore di connessione, riprova.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') sendMessage();
    };

    return (
        <div className="chatbot-wrapper">
            {isOpen && (
                <aside className="chatbot-container">
                    <div className="chatbot-header">
                        <h5>GIANFRANCO</h5>
                        <button className="chatbot-close" onClick={() => setIsOpen(false)} aria-label="Close Chat">
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>
                    <div className="chatbot-messages">
                        {messages.map((msg, i) => (
                            <div key={i} className={`message ${msg.role}`}>
                                <p>{msg.text}</p>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="message ai">
                                <p className="chatbot-typing">...</p>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="chatbot-input">
                        <input
                            type="text"
                            placeholder="Scrivi un messaggio..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isLoading}
                        />
                        <button type="button" onClick={sendMessage} disabled={isLoading} aria-label="Send Message">
                            <i className="bi bi-send"></i>
                        </button>
                    </div>
                </aside>
            )}
            {!isOpen && (
                <button className="chatbot-toggle" onClick={() => setIsOpen(true)} aria-label="Open Chat">
                    <i className="bi bi-chat-dots"></i>
                </button>
            )}
        </div>
    );
}
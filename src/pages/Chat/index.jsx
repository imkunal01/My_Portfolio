import React, { useState } from 'react';
import SocialIcons from '../../components/SocialIcons';
import DecorativeElements from '../../components/DecorativeElements';
import ChatInput from '../../components/ChatInput';

const Chat = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real application, you would send this data to a server
        console.log('Form submitted:', formData);
        setIsSubmitted(true);
        // Reset form after submission
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <main className="main-content chat-page">
            <div className="text-content-container">
                <h1>Chat <span className="highlight-text">With Me</span></h1>
                <p className="description-text">
                    Have a question or want to work together? Feel free to reach out using the form below.
                </p>
                
                {isSubmitted ? (
                    <div className="success-message">
                        <h2>Thank you for your message!</h2>
                        <p>I'll get back to you as soon as possible.</p>
                        <button 
                            className="send-another-button"
                            onClick={() => setIsSubmitted(false)}
                        >
                            Send Another Message
                        </button>
                    </div>
                ) : (
                    <div className="chat-form-container">
                        <ChatInput />
                    </div>
                )}
            </div>
            
            {/* Decorative Elements */}
            <DecorativeElements />
            
           
        </main>
    );
};

export default Chat;
// ChatBot.jsx
import React, { useState } from "react";
import { db } from "../../../ChintuAi/firebaseOrigins";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import axios from "axios";
import "./ChatBot.css"; // You can style it later

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hey! 👋 I'm Kunal's assistant. Looking to build a website?" }
  ]);
  const [input, setInput] = useState("");

  const addMessage = (sender, text) => {
    setMessages((prev) => [...prev, { sender, text }]);
  };

  const handleSend = async () => {
    if (!input) return;
    const userMessage = input;
    addMessage("user", userMessage);
    setInput("");

    // Send message to Gemini API
    try {
      const res = await axios.post(
        "https://api.generativeai.google/v1beta2/models/text-bison-001:generateMessage",
        {
          prompt: { text: userMessage },
          temperature: 0.7,
          maxOutputTokens: 200
        },
        {
          headers: {
            "Authorization": `Bearer ${import.meta.env.VITE_GEMINI_API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );

      const botReply = res.data.candidates[0].content;
      addMessage("bot", botReply);

      // Optional: save lead if user provides contact info
      if (userMessage.toLowerCase().includes("email")) {
        await addDoc(collection(db, "leads"), {
          message: userMessage,
          response: botReply,
          timestamp: Timestamp.now()
        });
      }

    } catch (err) {
      console.error(err);
      addMessage("bot", "Oops! Something went wrong. Try again.");
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.sender === "bot" ? "bot-msg" : "user-msg"}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatBot;

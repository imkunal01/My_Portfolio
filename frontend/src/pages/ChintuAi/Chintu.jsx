import React, { useState } from "react";
import axios from "axios";

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hey! 👋 I'm Kunal's assistant. Looking to build a website?" }
  ]);
  const [input, setInput] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [projectType, setProjectType] = useState("");

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  const addMessage = (sender, text) => {
    setMessages(prev => [...prev, { sender, text }]);
  };

  const handleSend = async () => {
    if (!input || !name || !email || !projectType) {
      alert("Please fill all fields before sending a message.");
      return;
    }

    const userMessage = input;
    addMessage("user", userMessage);
    setInput("");

    try {
      const res = await axios.post(`${BACKEND_URL}/chat`, {
        name,
        email,
        projectType,
        message: userMessage
      });

      addMessage("bot", res.data.reply + `\nEstimated Quote: ${res.data.quote}`);

    } catch (err) {
      console.error(err);
      addMessage("bot", "Oops! Something went wrong.");
    }
  };

  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, width: 350, background: "#fff", borderRadius: 10, boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>
      <div style={{ padding: 10 }}>
        <input value={name} placeholder="Your Name" onChange={(e) => setName(e.target.value)} style={{ width: "100%", marginBottom: 5, padding: 5 }} />
        <input value={email} placeholder="Your Email" onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", marginBottom: 5, padding: 5 }} />
        <input value={projectType} placeholder="Project Type" onChange={(e) => setProjectType(e.target.value)} style={{ width: "100%", marginBottom: 5, padding: 5 }} />
      </div>
      <div style={{ maxHeight: 300, overflowY: "auto", padding: 10 }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            background: msg.sender === "bot" ? "#f1f0f0" : "#4a90e2",
            color: msg.sender === "bot" ? "#000" : "#fff",
            padding: "8px 12px",
            borderRadius: 15,
            marginBottom: 10,
            alignSelf: msg.sender === "bot" ? "flex-start" : "flex-end",
            maxWidth: "80%",
          }}>
            {msg.text}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", borderTop: "1px solid #ddd" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{ flex: 1, padding: 10, border: "none", outline: "none" }}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} style={{ background: "#4a90e2", color: "#fff", border: "none", padding: "0 20px" }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;

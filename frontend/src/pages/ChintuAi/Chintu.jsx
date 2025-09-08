import React, { useState } from "react";
import axios from "axios";
import "./Chintu.css";

const Chintu = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: "",
  });

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ use your Render deployment URL
  const API_BASE =import.meta.env.VITE_BACKEND_URL;
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleInfoSubmit = (e) => {
    e.preventDefault();
    setStep(2);

    setMessages([
      {
        sender: "bot",
        text: `👋 Hi ${formData.name}! Thanks for sharing your info. Let's talk about your project (${formData.projectType}).`,
      },
    ]);
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/chat`, {
        ...formData,
        message: input,
      });

      const botMessage = {
        sender: "bot",
        text: res.data.reply || "⚠️ No reply from server.",
      };
      setMessages((prev) => [...prev, botMessage]);

      if (res.data.quote) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: `💰 Estimated Quote: ${res.data.quote}` },
        ]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Server error, check backend." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chintu-chat">
      <h2 className="chintu-header">Talk to Me</h2>

      {step === 1 ? (
        <form onSubmit={handleInfoSubmit} className="chintu-form">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="projectType"
            placeholder="Project Type (e.g. Website, App)"
            value={formData.projectType}
            onChange={handleChange}
            required
          />
          <button type="submit">Start Chat</button>
        </form>
      ) : (
        <>
          <div className="chintu-messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chintu-message ${
                  msg.sender === "user" ? "chintu-user" : "chintu-bot"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="chintu-message chintu-bot">⏳ Typing...</div>
            )}
          </div>

          <form onSubmit={handleChatSubmit} className="chintu-input-area">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              Send
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default Chintu;

import React, { useState, useEffect, useRef } from "react";
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
  const [darkMode, setDarkMode] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const chatEndRef = useRef(null);

  // ✅ your Render deployment URL
  const API_BASE = import.meta.env.VITE_BACKEND_URL;

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
          {
            sender: "bot",
            text: `💰 Estimated Quote: ${res.data.quote}\n📌 Includes design, development & basic support.`,
          },
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

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className={`chintu-chat ${darkMode ? "dark" : ""}`}>
      <div className="chintu-header">
        <h2>Talk to Me</h2>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="dark-toggle"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>

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
          <div className="quick-replies">
            {["Website", "App", "Ecommerce", "AI"].map((type) => (
              <button
                type="button"
                key={type}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, projectType: type }))
                }
                className={`quick-btn ${
                  formData.projectType === type ? "active" : ""
                }`}
              >
                {type}
              </button>
            ))}
          </div>
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
              <div className="chintu-message chintu-bot typing">
                ⏳ Typing...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {feedback === null ? (
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
          ) : (
            <div className="feedback-msg">
              Thanks for your feedback: {feedback} ⭐
            </div>
          )}

          {/* Feedback stars */}
          {messages.length > 4 && feedback === null && (
            <div className="feedback-stars">
              <p>Was this helpful?</p>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setFeedback(star)}
                  className="star"
                >
                  ⭐
                </span>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Chintu;

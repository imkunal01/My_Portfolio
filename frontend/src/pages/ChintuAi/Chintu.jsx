import React, { useState } from "react";
import axios from "axios";

const Chintu = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: "",
    message: ""
  });

  const [botReply, setBotReply] = useState("");
  const [quote, setQuote] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setBotReply("");
    setQuote("");

    try {
      const res = await axios.post("http://localhost:5000/chat", formData);
      setBotReply(res.data.reply);
      setQuote(res.data.quote);
    } catch (err) {
      console.error(err);
      setBotReply("⚠️ Server se reply nahi aaya, check backend console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto", padding: "20px" }}>
      <h2>💬 Talk to Chintu Bot</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: "10px", padding: "10px" }}
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: "10px", padding: "10px" }}
        />
        <input
          type="text"
          name="projectType"
          placeholder="Project Type (e.g. Website, App)"
          value={formData.projectType}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: "10px", padding: "10px" }}
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          required
          style={{ width: "100%", marginBottom: "10px", padding: "10px" }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            background: "#007bff",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
        >
          {loading ? "Sending..." : "Send to Chintu"}
        </button>
      </form>

      {botReply && (
        <div style={{ marginTop: "20px", padding: "15px", background: "#f4f4f4" }}>
          <h3>🤖 Bot Reply</h3>
          <p>{botReply}</p>
          <h4>💰 Estimated Quote: {quote}</h4>
        </div>
      )}
    </div>
  );
};

export default Chintu;

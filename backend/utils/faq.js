const faqResponses = {
  "timeline": "⏳ Most projects take between 2–6 weeks depending on complexity.",
  "stack": "⚙️ I usually work with MERN stack (MongoDB, Express, React, Node.js).",
  "cost": "💰 Pricing depends on project type. Websites start at ₹15k, Apps at ₹50k+.",
  "support": "📞 Yes! I provide post-launch support for bug fixes & minor updates."
};

function checkFAQ(message) {
  const lowerMsg = message.toLowerCase();
  for (let keyword in faqResponses) {
    if (lowerMsg.includes(keyword)) {
      return faqResponses[keyword];
    }
  }
  return null; // not an FAQ
}

module.exports = checkFAQ;

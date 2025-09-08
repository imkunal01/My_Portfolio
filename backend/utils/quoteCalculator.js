function calculateQuote(projectType = "", message = "") {
  const lowerType = projectType.toLowerCase();

  // Base categories
  const baseRates = {
    website: { min: 15000, max: 30000 },
    portfolio: { min: 10000, max: 20000 },
    ecommerce: { min: 40000, max: 80000 },
    app: { min: 50000, max: 100000 },
    ai: { min: 100000, max: 200000 },
    chatbot: { min: 30000, max: 60000 },
    default: { min: 10000, max: 20000 }
  };

  let selected = baseRates.default;

  // Match by keywords
  if (lowerType.includes("web") || lowerType.includes("site")) {
    selected = baseRates.website;
  } else if (lowerType.includes("portfolio")) {
    selected = baseRates.portfolio;
  } else if (lowerType.includes("ecom")) {
    selected = baseRates.ecommerce;
  } else if (lowerType.includes("app") || lowerType.includes("mobile")) {
    selected = baseRates.app;
  } else if (lowerType.includes("ai") || lowerType.includes("ml")) {
    selected = baseRates.ai;
  } else if (lowerType.includes("chatbot") || lowerType.includes("bot")) {
    selected = baseRates.chatbot;
  }

  // Complexity adjustment
  let multiplier = 1;
  const msg = message.toLowerCase();
  if (msg.includes("advanced") || msg.includes("complex") || msg.includes("custom")) {
    multiplier = 1.5;
  } else if (msg.includes("simple") || msg.includes("basic")) {
    multiplier = 0.8;
  }

  const min = Math.round(selected.min * multiplier);
  const max = Math.round(selected.max * multiplier);

  return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
}

module.exports = calculateQuote;

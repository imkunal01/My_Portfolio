const mongoose = require("mongoose");

const guestbookEntrySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  message: { type: String, required: true, trim: true, maxlength: 1000 },
  avatar: { type: String, default: "" },
  approved: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

// Auto-generate avatar from name if not provided
guestbookEntrySchema.pre("save", function (next) {
  if (!this.avatar) {
    this.avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(this.name)}`;
  }
  next();
});

module.exports = mongoose.model("GuestbookEntry", guestbookEntrySchema);

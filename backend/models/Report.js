const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  category: { type: String }, // AI fill karega
  priority: { type: String }, // AI fill karega
  description: { type: String, default: "No description provided" },
  location: {
  type: { type: String, default: 'Point' },
  coordinates: [Number]
},

userName: { type: String, required: true },
  phone: { type: String, required: true },

  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now },

user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: true
},

address: { type: String, required: true }
});

module.exports = mongoose.model('Report', reportSchema);
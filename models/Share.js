const mongoose = require('mongoose');

const shareSchema = new mongoose.Schema({
  fileId: { type: mongoose.Schema.Types.ObjectId, ref: 'File', required: true },
  granteeUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  grantedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  grantedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Share', shareSchema);

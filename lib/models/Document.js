import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: String
  },
  content: {
    type: String
  },
  isVectorized: {
    type: Boolean,
    default: false
  },
  vectorizedAt: {
    type: Date
  }
});

documentSchema.index({ content: 'text', originalName: 'text' });

const Document = mongoose.models.Document || mongoose.model('Document', documentSchema);

export default Document;

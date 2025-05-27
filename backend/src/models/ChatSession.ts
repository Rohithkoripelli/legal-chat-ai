import mongoose, { Schema } from 'mongoose';
import { IChatSession } from '../types';

const ChatSessionSchema = new Schema<IChatSession>({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  documentIds: [{
    type: Schema.Types.ObjectId,
    ref: 'Document'
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
ChatSessionSchema.index({ sessionId: 1 });
ChatSessionSchema.index({ isActive: 1 });
ChatSessionSchema.index({ updatedAt: -1 });

export default mongoose.model<IChatSession>('ChatSession', ChatSessionSchema);
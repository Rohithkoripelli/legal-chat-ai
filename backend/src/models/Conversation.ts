import mongoose from 'mongoose';

export interface IConversation {
  title: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount?: number;
}

const conversationSchema = new mongoose.Schema<IConversation>({
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  userId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  messageCount: {
    type: Number,
    default: 0
  }
});

conversationSchema.index({ userId: 1, updatedAt: -1 });

const Conversation = mongoose.model<IConversation>('Conversation', conversationSchema);

export default Conversation;
export { conversationSchema };
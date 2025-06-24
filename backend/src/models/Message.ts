import mongoose from 'mongoose';

export interface IMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
  documentIds?: string[];
  userId?: string;
  conversationId: string;
}

const messageSchema = new mongoose.Schema<IMessage>({
  text: {
    type: String,
    required: true
  },
  isUser: {
    type: Boolean,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  documentIds: [{
    type: String
  }],
  userId: {
    type: String
  },
  conversationId: {
    type: String,
    required: true
  }
});

const Message = mongoose.model<IMessage>('Message', messageSchema);

export default Message;
export { messageSchema };
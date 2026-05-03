import mongoose from 'mongoose';

const searchResponseSchema = new mongoose.Schema({
  result: {
    answer: { type: String, required: true },
    followUpQuestions: [{ type: String }]
  },
  urls: [{ type: String }]
}, { _id: false });

const chatTurnSchema = new mongoose.Schema({
  id: { type: String, required: true },
  query: { type: String, required: true },
  loading: { type: Boolean, default: false },
  response: searchResponseSchema
}, { _id: false });

const conversationSchema = new mongoose.Schema({
  id: { type: String, required: true },
  userId: { type: String, required: true, index: true },
  sessionId: { type: String },
  orgId: { type: String },
  title: { type: String, required: true },
  createdAt: { type: Number, required: true },
  turns: [chatTurnSchema]
});

conversationSchema.index({ id: 1, userId: 1 }, { unique: true });

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
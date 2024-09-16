import { Schema } from 'mongoose';
import mongoose_connection from '../../connection/index.js';

const feedback_schema = new Schema(
  {
    email: { type: String },
    blogId: { type: String },
    feedback_text: { type: String },
  },
  {
    timestamps: {
      createdAt: 'created_at',
    },
  },
);
export const feedbackSchema = mongoose_connection.model('feedbacks', feedback_schema);
import { Schema } from 'mongoose';
import mongoose_connection from '../../connection/index.js';

const blogs_content_schema = new Schema({
  email: { type: String },
  blogContent: { type: String },
  requestId: { type: String },
  isDeleted: { type: Boolean, default: false }
}, {
  timestamps: {
    createdAt: 'created_at'
  }
});
export const blogsContent = mongoose_connection.model('blogs-content', blogs_content_schema);
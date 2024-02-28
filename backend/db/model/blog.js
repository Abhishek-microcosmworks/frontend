import { Schema } from 'mongoose';
import mongoose_connection from '../connection/index.js';

const blog_schema = new Schema(
  {
    email: { type: String },
    title: { type: String },
    finalContent: { type: String },
    isDeleted: { type: Boolean, default: false },
    isLatest: { type: Boolean, default: false },
    requestId: { type: String },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);
const blog = mongoose_connection.model('blog', blog_schema);
export default blog;

import { Schema } from 'mongoose';
import mongoose_connection from '../connection/index.js';

const blog_schema = new Schema(
  {
    email: { type: String },
    title: { type: String },
    finalContent: { type: String },
    isDeleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
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

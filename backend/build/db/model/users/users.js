import { Schema } from 'mongoose';
import mongoose_connection from '../../connection/index.js';

const UserSchema = new Schema({
  name: { type: String },
  email: { type: String },
  otp: { type: String },
  image_id: { type: Array },
  isDeleted: { type: Boolean, default: false }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

export const userSchema = mongoose_connection.model('users', UserSchema);
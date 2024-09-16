import { Schema } from 'mongoose';
import mongoose_connection from '../../connection/index.js';

const OtpSchema = new Schema({
  email: { type: String },
  otp: { type: String },
  otpExp: { type: String },
  isDeleted: { type: Boolean, default: false }
}, {
  timestamps: {
    createdAt: 'created_at',
    expiredAt: 'expired_at'
  }
});

export const otpSchema = mongoose_connection.model('otps', OtpSchema);
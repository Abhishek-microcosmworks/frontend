import { Schema } from 'mongoose';

import mongoose_connection from '../connection/index.js';

const authenticationTokenSchema = new Schema({
  email: { type: String },
  userId: { type: String },
  token: { type: String },
  tokenExp: { type: String },
  isDeleted: { type: Boolean, default: false }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const authenticationToken = mongoose_connection.model('authenticationToken', authenticationTokenSchema);
// module.exports = authenticationToken;

export default authenticationToken;
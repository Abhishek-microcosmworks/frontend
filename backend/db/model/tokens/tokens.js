import { Schema } from 'mongoose';
import mongoose_connection from '../../connection/index.js';

const TokenSchema = new Schema(
  {
    email: { type: String },
    userId: { type: String },
    token: { type: String },
    tokenExp: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

export const tokenSchema = mongoose_connection.model("tokens", TokenSchema);

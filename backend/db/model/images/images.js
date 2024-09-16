import { Schema } from 'mongoose';
import mongoose_connection from '../../connection/index.js';

const image_schema = new Schema(
  {
    image_url: { type: String },
    context: {type: String},
    is_deleted: { type: Boolean, default:false},
    deleted_at: { type: Date, default: null }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

export const imageSchema = mongoose_connection.model('images', image_schema);
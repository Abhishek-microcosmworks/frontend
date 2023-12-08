import { Schema } from 'mongoose';

import mongoose_connection from '../connection/index.js';

const RegisterSchema = new Schema(
  {
    name: { type: String },
    email: { type: String },
    otp: { type: String },
    image_id: {type: Array},
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

const RegisterData = mongoose_connection.model('RegisterData', RegisterSchema);
export default RegisterData;

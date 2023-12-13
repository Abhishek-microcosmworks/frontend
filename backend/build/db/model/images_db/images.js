const { Schema } = require('mongoose');

const mongoose_connection = require('../connection');

const image_schema = new Schema({
  image_url: { type: String },
  context: { type: String },
  is_deleted: { type: Boolean, default: false },
  deleted_at: { type: Date, default: null }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const image_db = mongoose_connection.model('images_db', image_schema);
export default image_db;
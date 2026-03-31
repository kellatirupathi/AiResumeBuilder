import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const niatIdSchema = new Schema({
  niatId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true, // Ensure consistency
  }
}, { timestamps: true });

const NiatId = model('NiatId', niatIdSchema);

export default NiatId;

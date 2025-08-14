import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const niatIdSchema = new Schema({
  niatId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true, // Ensure consistency
    match: [/^N24H01[A-Z]\d{4}$/, 'Please fill a valid NIAT ID format.']
  }
}, { timestamps: true });

const NiatId = model('NiatId', niatIdSchema);

export default NiatId;

import mongoose from 'mongoose';

const shiftingRequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Worker',
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    customerPhone: {
      type: String,
      required: true,
    },
    shiftingDate: {
      type: Date,
      required: true,
    },
    shiftingAddress: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'completed'],
      default: 'pending',
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    payment: {
      status: {
        type: String,
        enum: ['pending', 'initiated', 'completed', 'failed'],
        default: 'pending',
      },
      method: {
        type: String,
        default: 'khalti',
      },
      pidx: String,
      transactionId: String,
      verifiedAt: Date,
    },
    completedAt: Date,
    notes: String,
  },
  { timestamps: true }
);

// Indexes for faster queries
shiftingRequestSchema.index({ userId: 1 });
shiftingRequestSchema.index({ workerId: 1 });
shiftingRequestSchema.index({ status: 1 });
shiftingRequestSchema.index({ 'payment.status': 1 });

const ShiftingRequest = mongoose.model('ShiftingRequest', shiftingRequestSchema);

export default ShiftingRequest;
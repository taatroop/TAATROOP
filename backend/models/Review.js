import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  productId: { type: String, default: 'global' }, // 'global' or product ID / numeric string
  name: { type: String, required: true },
  location: { type: String, default: 'ঢাকা' },
  rating: { type: Number, required: true, default: 5 },
  comment: { type: String, required: true },
  date: { type: String, default: 'এখনই' },
  verified: { type: Boolean, default: true },
  likes: { type: Number, default: 0 },
  product: { type: String, default: 'তাঁতরূপ হ্যান্ডলুম পণ্য' }
}, {
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
    }
  }
});

ReviewSchema.virtual('id').get(function() {
  return this._id.toString();
});

const Review = mongoose.model('Review', ReviewSchema);
export default Review;

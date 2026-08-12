import express from 'express';
import Review from '../models/Review.js';

const router = express.Router();

// Seed initial default reviews if database is empty
export const DEFAULT_SEED_REVIEWS = [
  {
    productId: 'global',
    name: 'মোঃ রফিকুল ইসলাম',
    location: 'মিরপুর, ঢাকা',
    rating: 5,
    date: '১ দিন আগে',
    comment: 'তাঁতরূপের লুঙ্গির সুতার বুনন ও কোয়ালিটি সত্যিই অসাধারণ। একদম হালকা ও পরতে আরামদায়ক।',
    verified: true,
    likes: 12,
    product: 'তাঁতরূপ প্রিমিয়াম প্রিন্ট চেক লুঙ্গি'
  },
  {
    productId: 'global',
    name: 'তানভীর আহমেদ',
    location: 'ধানমন্ডি, ঢাকা',
    rating: 5,
    date: '৩ দিন আগে',
    comment: 'সিরাজগঞ্জের আসল হ্যান্ডলুম কাজের ফিনিশিং পেয়েছি। ১০০% কটন ফেব্রিক। রঙ ও স্থায়িত্ব চমৎকার।',
    verified: true,
    likes: 8,
    product: 'তাঁতরূপ ক্লাসিক কটন লুঙ্গি'
  },
  {
    productId: 'global',
    name: 'সাইফুল আলম',
    location: 'চট্টগ্রাম',
    rating: 4,
    date: '১ সপ্তাহ আগে',
    comment: 'ডেলিভারি দ্রুত ছিল এবং প্রোডাক্ট হুবহু ছবির মতো। সুতির বুনন বেশ নরম।',
    verified: true,
    likes: 5,
    product: 'তাঁতরূপ রয়েল লাক্সারি লুঙ্গি'
  },
  {
    productId: 'global',
    name: 'আব্দুল মান্নান',
    location: 'সিলেট',
    rating: 5,
    date: '২ সপ্তাহ আগে',
    comment: 'কাপড়ের কোয়ালিটি এক কথায় সেরা। ধোয়ার পরেও রঙ নষ্ট হয়নি। পরবর্তীতে আবারও অর্ডার করবো।',
    verified: true,
    likes: 15,
    product: 'তাঁতরূপ এক্সক্লুসিভ লুঙ্গি'
  }
];

// @desc    Get reviews (optional filter by productId)
// @route   GET /api/reviews
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { productId } = req.query;
    let query = {};

    if (productId && productId !== 'all') {
      // Return reviews for this specific product, or global default reviews
      query = { $or: [{ productId: String(productId) }, { productId: 'global' }] };
    }

    if (req.dbConnected) {
      const reviews = await Review.find(query).sort({ createdAt: -1 }).lean();
      const formatted = reviews.map(r => ({
        ...r,
        id: r._id ? r._id.toString() : String(r.id)
      }));
      return res.json(formatted);
    }

    // Fallback if DB is not connected
    return res.json(DEFAULT_SEED_REVIEWS.map((r, idx) => ({ id: `seed-${idx}`, ...r })));
  } catch (error) {
    console.error('[Review API] Get reviews error:', error);
    res.status(500).json({ message: 'Server Error fetching reviews' });
  }
});

// @desc    Post a new review
// @route   POST /api/reviews
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { productId, name, location, rating, comment, date, product } = req.body;

    if (!comment || !comment.trim()) {
      return res.status(400).json({ message: 'রিভিউ এর মতামত প্রদান করা আবশ্যক' });
    }

    const reviewData = {
      productId: productId ? String(productId) : 'global',
      name: name?.trim() || 'সম্মানিত ক্রেতা',
      location: location?.trim() || 'ঢাকা',
      rating: Number(rating) || 5,
      comment: comment.trim(),
      date: date || 'এখনই',
      verified: true,
      likes: 0,
      product: product || 'তাঁতরূপ হ্যান্ডলুম পণ্য'
    };

    if (req.dbConnected) {
      const newReview = await Review.create(reviewData);
      const result = newReview.toJSON();
      return res.status(201).json(result);
    }

    // Memory / fallback if DB offline
    return res.status(201).json({ id: `mem-${Date.now()}`, ...reviewData });
  } catch (error) {
    console.error('[Review API] Create review error:', error);
    res.status(500).json({ message: 'Server Error creating review' });
  }
});

export default router;

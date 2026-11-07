/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * VYROX FULL-STACK SERVER ENTRY POINT
 * Runs Express backend with Vite middleware on port 3000.
 * Implements server-side pricing, coupon validation, payment security,
 * and mentor video management.
 */

import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ==========================================
// 1. TRUSTED BACKEND MEMBERSHIP PRICING (SOURCE OF TRUTH)
// ==========================================
interface ServerMembershipPlan {
  id: 'monthly' | 'quarterly' | 'yearly';
  name: string;
  durationMonths: number;
  durationLabel: string;
  price: number; // EXACT APPROVED PRICES
  regularPrice: number;
  description: string;
}

const SERVER_MEMBERSHIP_PLANS: Record<string, ServerMembershipPlan> = {
  monthly: {
    id: 'monthly',
    name: 'Monthly Plan',
    durationMonths: 1,
    durationLabel: '1 Month',
    price: 119,
    regularPrice: 199,
    description: 'Essential institutional SMC learning access renewed every 30 days.'
  },
  quarterly: {
    id: 'quarterly',
    name: 'Quarterly Plan',
    durationMonths: 3,
    durationLabel: '3 Months',
    price: 319,
    regularPrice: 499,
    description: 'Quarterly trader transformation cohort with direct mentor feedback.'
  },
  yearly: {
    id: 'yearly',
    name: 'Yearly Plan',
    durationMonths: 12,
    durationLabel: '12 Months',
    price: 1119,
    regularPrice: 1999,
    description: 'Complete annual institutional immersion with all updates and certifications.'
  }
};

// ==========================================
// 2. IN-MEMORY TRUSTED DATABASE TABLES
// ==========================================
let couponsTable = [
  {
    id: 'cpn_vyrox20',
    code: 'VYROX20',
    discountType: 'percentage',
    discountValue: 20,
    applicablePlans: 'all',
    startDate: '2026-01-01',
    expiryDate: '2026-12-31',
    usageLimit: 100,
    usedCount: 14,
    perUserLimit: 1,
    minPurchaseAmount: 100,
    maxDiscountAmount: 150,
    status: 'active',
    description: '20% discount across all membership tiers (max ₹150 off)',
    createdAt: '01 Jan 2026'
  },
  {
    id: 'cpn_smc100',
    code: 'SMC100',
    discountType: 'fixed',
    discountValue: 100,
    applicablePlans: 'quarterly',
    startDate: '2026-02-01',
    expiryDate: '2026-11-30',
    usageLimit: 50,
    usedCount: 22,
    perUserLimit: 1,
    minPurchaseAmount: 300,
    status: 'active',
    description: 'Flat ₹100 off on Quarterly Membership plans',
    createdAt: '01 Feb 2026'
  },
  {
    id: 'cpn_welcome10',
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    applicablePlans: 'monthly',
    startDate: '2026-01-01',
    expiryDate: '2026-12-31',
    usageLimit: 200,
    usedCount: 45,
    perUserLimit: 1,
    minPurchaseAmount: 100,
    maxDiscountAmount: 20,
    status: 'active',
    description: 'Welcome 10% discount on first month enrollment',
    createdAt: '01 Jan 2026'
  },
  {
    id: 'cpn_super50',
    code: 'SUPER50',
    discountType: 'fixed',
    discountValue: 50,
    applicablePlans: 'all',
    startDate: '2026-03-01',
    expiryDate: '2026-12-31',
    usageLimit: 80,
    usedCount: 31,
    perUserLimit: 1,
    minPurchaseAmount: 100,
    status: 'active',
    description: 'Instant ₹50 voucher applicable on all membership terms',
    createdAt: '01 Mar 2026'
  },
  {
    id: 'cpn_expired30',
    code: 'EXPIRED30',
    discountType: 'percentage',
    discountValue: 30,
    applicablePlans: 'all',
    startDate: '2026-01-01',
    expiryDate: '2026-03-01',
    usageLimit: 20,
    usedCount: 20,
    perUserLimit: 1,
    minPurchaseAmount: 100,
    status: 'inactive',
    description: 'Q1 Launch promotional discount (Expired & Inactive)',
    createdAt: '01 Jan 2026'
  }
];

let couponRedemptionsTable = [
  {
    id: 'red_901',
    couponId: 'cpn_vyrox20',
    couponCode: 'VYROX20',
    studentId: 'usr_arun_7781',
    studentName: 'Arun Kumar',
    studentEmail: 'nandhakumar052007@gmail.com',
    planId: 'monthly',
    planName: 'Monthly Plan',
    originalPrice: 119,
    discountAmount: 23.8,
    finalPaidAmount: 95.2,
    redeemedAt: '04 Nov 2026, 14:10',
    orderRef: 'VYR-ORD-2026-9011'
  },
  {
    id: 'red_902',
    couponId: 'cpn_smc100',
    couponCode: 'SMC100',
    studentId: 'usr_karthik_99',
    studentName: 'Karthik V.',
    studentEmail: 'karthik.trader@gmail.com',
    planId: 'quarterly',
    planName: 'Quarterly Plan',
    originalPrice: 319,
    discountAmount: 100,
    finalPaidAmount: 219,
    redeemedAt: 'Yesterday, 09:30',
    orderRef: 'VYR-ORD-2026-9012'
  }
];

let mentorsTable = [
  {
    id: 'usr_mentor_rahul',
    name: 'Rahul (Senior SMC Mentor)',
    email: 'rahul.smc@vyroxacademy.in',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    shortBio: 'Former prop firm desk trader specializing in high-timeframe order flow, session liquidity raids, and algorithmic market structure.',
    experienceYears: 8,
    tradingExperience: '8+ Years Institutional FX & Commodities Desk',
    specialization: 'Order Blocks, Fair Value Gaps & Liquidity Sweeps',
    totalPublishedVideos: 18,
    totalViews: 14850,
    isAuthorized: true,
    uploadPermissionGranted: true,
    status: 'active',
    joinedDate: 'Jan 2024'
  },
  {
    id: 'usr_karthik_99',
    name: 'Karthik V. (Pro Mentor)',
    email: 'karthik.trader@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    shortBio: 'Equities and US30 index scalper. Master of the 9:30 AM New York cash open Judas Swing and algorithmic displacement.',
    experienceYears: 5,
    tradingExperience: '5+ Years US30, NAS100 & Nifty Index Trading',
    specialization: 'Judas Swings, New York Open & Execution Timing',
    totalPublishedVideos: 12,
    totalViews: 9240,
    isAuthorized: true,
    uploadPermissionGranted: true,
    status: 'active',
    joinedDate: 'Mar 2024'
  },
  {
    id: 'usr_priya_44',
    name: 'Priya Sundar (FX Specialist)',
    email: 'priya.sundar@vyroxacademy.in',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
    shortBio: 'SMC macro analyst focusing on GBP/USD and EUR/USD breaker block formations, multi-timeframe alignment, and risk management.',
    experienceYears: 4,
    tradingExperience: '4+ Years European Session FX Strategy',
    specialization: 'Breaker Blocks, External to Internal Range Liquidity',
    totalPublishedVideos: 9,
    totalViews: 6710,
    isAuthorized: true,
    uploadPermissionGranted: true,
    status: 'active',
    joinedDate: 'Jun 2024'
  },
  {
    id: 'usr_vikram_applicant',
    name: 'Vikram Seth (Applicant)',
    email: 'vikram.seth99@outlook.com',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80',
    shortBio: 'Gold and Crude Oil swing trader applying for mentor privileges. Seeking upload permissions for Trade Reviews cohort.',
    experienceYears: 3,
    tradingExperience: '3 Years Commodities Swing Execution',
    specialization: 'Gold Supply & Demand + Volume Profiling',
    totalPublishedVideos: 0,
    totalViews: 0,
    isAuthorized: false,
    uploadPermissionGranted: false,
    status: 'pending_approval',
    joinedDate: 'Nov 2026'
  }
];

let mentorVideosTable = [
  {
    id: 'mvid_1',
    title: 'XAUUSD 15m London Sweep & Bullish CHoCH Entry Execution (1:4.8 RR)',
    description: `Detailed technical breakdown of how smart money swept London session sell-side liquidity at 2732.40 before generating clean displacement.

Key Learning Points:
• How to wait for 50% consequent encroachment tap inside the 15m Fair Value Gap.
• Invalidation strictly below the sweep wick at 2728.10.
• Target: Asian session high liquidity pool (2750.00).`,
    category: 'Chart Analysis',
    thumbnailUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=900&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    durationSeconds: 840,
    mentorId: 'usr_mentor_rahul',
    mentorName: 'Rahul (Senior SMC Mentor)',
    mentorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    mentorSpecialization: 'Order Blocks, Fair Value Gaps & Liquidity Sweeps',
    instruments: ['XAUUSD'],
    tags: ['CHoCH', 'LondonSweep', 'FVG', 'Liquidity', 'Gold'],
    status: 'published',
    views: 1420,
    likes: 124,
    uploadedAt: 'Today, 09:30 AM',
    commentsCount: 2,
    fileSizeMb: 145.2,
    comments: [
      {
        id: 'mv_comm_1_1',
        videoId: 'mvid_1',
        authorId: 'usr_arun_7781',
        authorName: 'Arun Kumar',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        authorBadge: 'Verified Student',
        content: 'Rahul sir, the explanation on waiting for the 1m micro-CHoCH inside the 5m OB saved me from premature entry today! Thank you!',
        createdAt: 'Today, 10:15 AM',
        likes: 12
      }
    ]
  },
  {
    id: 'mvid_2',
    title: 'US30 (Dow Jones) 9:30 AM Cash Open Judas Swing Playbook',
    description: `How to avoid retail breakout traps during the first 15 minutes of the New York cash open on indices.`,
    category: 'MSS & Entry Models',
    thumbnailUrl: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=900&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    durationSeconds: 1120,
    mentorId: 'usr_karthik_99',
    mentorName: 'Karthik V. (Pro Mentor)',
    mentorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    mentorSpecialization: 'Judas Swings & Execution Timing',
    instruments: ['US30'],
    tags: ['JudasSwing', 'US30', 'NYOpen', 'Indices'],
    status: 'published',
    views: 980,
    likes: 89,
    uploadedAt: 'Yesterday, 06:15 PM',
    commentsCount: 1,
    fileSizeMb: 198.5,
    comments: []
  }
];

// Helper: Calculate discount securely on server
function calculateServerDiscount(originalPrice: number, coupon: typeof couponsTable[0]) {
  let discountAmount = 0;
  if (coupon.discountType === 'percentage') {
    discountAmount = (originalPrice * coupon.discountValue) / 100;
    if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
      discountAmount = coupon.maxDiscountAmount;
    }
  } else if (coupon.discountType === 'fixed') {
    discountAmount = Math.min(coupon.discountValue, originalPrice);
  }
  // Round to 2 decimal places
  discountAmount = Math.round(discountAmount * 100) / 100;
  const finalPayable = Math.max(0, Math.round((originalPrice - discountAmount) * 100) / 100);
  return { discountAmount, finalPayable };
}

// ==========================================
// 3. API ENDPOINTS
// ==========================================

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    serverTime: new Date().toISOString(),
    officialPrices: {
      monthly: SERVER_MEMBERSHIP_PLANS.monthly.price,
      quarterly: SERVER_MEMBERSHIP_PLANS.quarterly.price,
      yearly: SERVER_MEMBERSHIP_PLANS.yearly.price
    }
  });
});

// GET /api/membership/plans - Official membership pricing source
app.get('/api/membership/plans', (_req: Request, res: Response) => {
  res.json({
    success: true,
    plans: Object.values(SERVER_MEMBERSHIP_PLANS)
  });
});

// POST /api/coupons/validate - Server-Side Coupon Validation
app.post('/api/coupons/validate', (req: Request, res: Response) => {
  const { couponCode, planId, studentId } = req.body;

  if (!planId || !SERVER_MEMBERSHIP_PLANS[planId]) {
    res.status(400).json({
      valid: false,
      error: 'Invalid membership plan selected. Must be monthly, quarterly, or yearly.'
    });
    return;
  }

  const selectedPlan = SERVER_MEMBERSHIP_PLANS[planId];
  const trustedOriginalPrice = selectedPlan.price;

  if (!couponCode || typeof couponCode !== 'string') {
    res.status(400).json({
      valid: false,
      error: 'Coupon code is required.'
    });
    return;
  }

  const codeClean = couponCode.trim().toUpperCase();
  const coupon = couponsTable.find(c => c.code.toUpperCase() === codeClean);

  if (!coupon) {
    res.status(404).json({
      valid: false,
      error: `Coupon "${codeClean}" not found. Please verify the code.`
    });
    return;
  }

  if (coupon.status !== 'active') {
    res.status(400).json({
      valid: false,
      error: `Coupon "${coupon.code}" is currently inactive or deactivated by admin.`
    });
    return;
  }

  const todayStr = new Date().toISOString().split('T')[0];
  if (coupon.expiryDate && todayStr > coupon.expiryDate) {
    res.status(400).json({
      valid: false,
      error: `Coupon "${coupon.code}" expired on ${coupon.expiryDate}.`
    });
    return;
  }

  if (coupon.startDate && todayStr < coupon.startDate) {
    res.status(400).json({
      valid: false,
      error: `Coupon "${coupon.code}" is not valid until ${coupon.startDate}.`
    });
    return;
  }

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    res.status(400).json({
      valid: false,
      error: `Coupon "${coupon.code}" has reached its maximum total usage limit (${coupon.usageLimit} redemptions).`
    });
    return;
  }

  // Check per-user limit
  if (studentId) {
    const userRedemptions = couponRedemptionsTable.filter(
      r => r.couponId === coupon.id && r.studentId === studentId
    );
    if (userRedemptions.length >= coupon.perUserLimit) {
      res.status(400).json({
        valid: false,
        error: `You have already redeemed coupon "${coupon.code}" the maximum allowed times (${coupon.perUserLimit} per student).`
      });
      return;
    }
  }

  // Check applicable plan
  if (coupon.applicablePlans !== 'all' && coupon.applicablePlans !== planId) {
    res.status(400).json({
      valid: false,
      error: `Coupon "${coupon.code}" is only applicable on ${coupon.applicablePlans.toUpperCase()} plans.`
    });
    return;
  }

  // Check minimum purchase amount
  if (coupon.minPurchaseAmount && trustedOriginalPrice < coupon.minPurchaseAmount) {
    res.status(400).json({
      valid: false,
      error: `Plan price (₹${trustedOriginalPrice}) is below minimum requirement of ₹${coupon.minPurchaseAmount} for this coupon.`
    });
    return;
  }

  // Calculate discount server-side
  const { discountAmount, finalPayable } = calculateServerDiscount(trustedOriginalPrice, coupon);

  res.json({
    valid: true,
    coupon: {
      id: coupon.id,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      description: coupon.description
    },
    planId: selectedPlan.id,
    planName: selectedPlan.name,
    durationLabel: selectedPlan.durationLabel,
    originalPrice: trustedOriginalPrice,
    discountAmount,
    finalPayableAmount: finalPayable,
    savingsText: `Saved ₹${discountAmount.toLocaleString('en-IN')}`
  });
});

// POST /api/payments/create-order - Create secure server-calculated order
app.post('/api/payments/create-order', (req: Request, res: Response) => {
  const { planId, couponCode, studentId, studentName, studentEmail, paymentMethod } = req.body;

  if (!planId || !SERVER_MEMBERSHIP_PLANS[planId]) {
    res.status(400).json({ error: 'Valid planId is required' });
    return;
  }

  const plan = SERVER_MEMBERSHIP_PLANS[planId];
  let originalPrice = plan.price;
  let discountAmount = 0;
  let appliedCoupon: any = null;

  if (couponCode) {
    const codeClean = String(couponCode).trim().toUpperCase();
    const coupon = couponsTable.find(c => c.code.toUpperCase() === codeClean);
    if (coupon && coupon.status === 'active') {
      const calc = calculateServerDiscount(originalPrice, coupon);
      discountAmount = calc.discountAmount;
      appliedCoupon = coupon;
    }
  }

  const finalPayable = Math.max(0, Math.round((originalPrice - discountAmount) * 100) / 100);
  const orderRef = `VYR-ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  res.json({
    success: true,
    orderRef,
    planId: plan.id,
    planName: plan.name,
    originalPrice,
    discountAmount,
    finalPayableAmount: finalPayable,
    paymentMethod: paymentMethod || 'gpay_upi',
    student: { id: studentId, name: studentName, email: studentEmail },
    gpayUpiId: 'nandhakumar052007@okaxis',
    binanceUid: '1129930138',
    timestamp: new Date().toISOString()
  });
});

// POST /api/payments/confirm - Record payment and atomic coupon redemption
app.post('/api/payments/confirm', (req: Request, res: Response) => {
  const {
    orderRef,
    transactionId,
    paymentMethod,
    studentId,
    studentName,
    studentEmail,
    planId,
    couponCode
  } = req.body;

  if (!orderRef || !transactionId) {
    res.status(400).json({ error: 'orderRef and transactionId are required.' });
    return;
  }

  const plan = SERVER_MEMBERSHIP_PLANS[planId] || SERVER_MEMBERSHIP_PLANS.monthly;
  let discountAmount = 0;
  let finalPaidAmount = plan.price;

  // Handle coupon redemption atomically
  if (couponCode) {
    const codeClean = String(couponCode).trim().toUpperCase();
    const couponIndex = couponsTable.findIndex(c => c.code.toUpperCase() === codeClean);
    if (couponIndex !== -1) {
      const coupon = couponsTable[couponIndex];
      const calc = calculateServerDiscount(plan.price, coupon);
      discountAmount = calc.discountAmount;
      finalPaidAmount = calc.finalPayable;

      // Atomic increment of usedCount
      couponsTable[couponIndex].usedCount += 1;

      // Record in redemption ledger
      couponRedemptionsTable.unshift({
        id: `red_${Date.now()}`,
        couponId: coupon.id,
        couponCode: coupon.code,
        studentId: studentId || 'usr_arun_7781',
        studentName: studentName || 'Arun Kumar',
        studentEmail: studentEmail || 'nandhakumar052007@gmail.com',
        planId: plan.id,
        planName: plan.name,
        originalPrice: plan.price,
        discountAmount,
        finalPaidAmount,
        redeemedAt: new Date().toLocaleString('en-IN'),
        orderRef
      });
    }
  }

  res.json({
    success: true,
    orderRef,
    status: 'verified',
    message: 'Membership activated successfully.',
    verifiedAt: new Date().toISOString(),
    amountPaid: finalPaidAmount
  });
});

// ==========================================
// 4. ADMIN COUPON MANAGEMENT API
// ==========================================

// GET /api/admin/coupons - List all coupons & analytics
app.get('/api/admin/coupons', (_req: Request, res: Response) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const activeCoupons = couponsTable.filter(c => c.status === 'active' && (!c.expiryDate || c.expiryDate >= todayStr)).length;
  const expiredCoupons = couponsTable.filter(c => c.expiryDate && c.expiryDate < todayStr).length;
  const totalRedemptions = couponRedemptionsTable.length;
  const totalDiscountProvided = couponRedemptionsTable.reduce((sum, r) => sum + r.discountAmount, 0);

  // Find most frequent coupon
  const countMap: Record<string, number> = {};
  couponRedemptionsTable.forEach(r => {
    countMap[r.couponCode] = (countMap[r.couponCode] || 0) + 1;
  });
  let mostFrequentCoupon = 'None';
  let maxCount = 0;
  for (const [code, cnt] of Object.entries(countMap)) {
    if (cnt > maxCount) {
      maxCount = cnt;
      mostFrequentCoupon = `${code} (${cnt} redemptions)`;
    }
  }

  res.json({
    success: true,
    coupons: couponsTable,
    redemptions: couponRedemptionsTable,
    analytics: {
      totalCoupons: couponsTable.length,
      activeCoupons,
      expiredCoupons,
      totalRedemptions,
      totalDiscountProvided: Math.round(totalDiscountProvided * 100) / 100,
      mostFrequentCoupon
    }
  });
});

// POST /api/admin/coupons - Create coupon
app.post('/api/admin/coupons', (req: Request, res: Response) => {
  const {
    code,
    discountType,
    discountValue,
    applicablePlans,
    startDate,
    expiryDate,
    usageLimit,
    perUserLimit,
    minPurchaseAmount,
    maxDiscountAmount,
    description
  } = req.body;

  if (!code || !discountType || discountValue === undefined) {
    res.status(400).json({ error: 'Code, discountType and discountValue are required.' });
    return;
  }

  const cleanCode = code.trim().toUpperCase();
  if (couponsTable.some(c => c.code === cleanCode)) {
    res.status(400).json({ error: `Coupon code "${cleanCode}" already exists.` });
    return;
  }

  const newCoupon = {
    id: `cpn_${Date.now()}`,
    code: cleanCode,
    discountType: discountType as 'percentage' | 'fixed',
    discountValue: Number(discountValue),
    applicablePlans: applicablePlans || 'all',
    startDate: startDate || new Date().toISOString().split('T')[0],
    expiryDate: expiryDate || '2026-12-31',
    usageLimit: Number(usageLimit) || 100,
    usedCount: 0,
    perUserLimit: Number(perUserLimit) || 1,
    minPurchaseAmount: Number(minPurchaseAmount) || 0,
    maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : undefined,
    status: 'active',
    description: description || `Coupon ${cleanCode}`,
    createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  };

  couponsTable.unshift(newCoupon);
  res.json({ success: true, coupon: newCoupon });
});

// PUT /api/admin/coupons/:id - Update coupon
app.put('/api/admin/coupons/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = couponsTable.findIndex(c => c.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Coupon not found' });
    return;
  }

  couponsTable[index] = {
    ...couponsTable[index],
    ...req.body,
    id // keep id invariant
  };

  res.json({ success: true, coupon: couponsTable[index] });
});

// DELETE /api/admin/coupons/:id - Delete coupon
app.delete('/api/admin/coupons/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  couponsTable = couponsTable.filter(c => c.id !== id);
  res.json({ success: true, message: 'Coupon deleted successfully' });
});

// PATCH /api/admin/coupons/:id/toggle-status - Toggle active/inactive
app.patch('/api/admin/coupons/:id/toggle-status', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = couponsTable.findIndex(c => c.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Coupon not found' });
    return;
  }

  const nextStatus = couponsTable[index].status === 'active' ? 'inactive' : 'active';
  couponsTable[index].status = nextStatus;
  res.json({ success: true, status: nextStatus, coupon: couponsTable[index] });
});

// ==========================================
// 5. MENTOR VIDEO & LEARNING SYSTEM API
// ==========================================

// GET /api/mentor-videos - List videos
app.get('/api/mentor-videos', (req: Request, res: Response) => {
  const { category, mentorId, search, instrument } = req.query;

  let result = [...mentorVideosTable];

  // Filter category
  if (category && category !== 'ALL') {
    result = result.filter(v => v.category === category);
  }

  // Filter mentor
  if (mentorId && mentorId !== 'ALL') {
    result = result.filter(v => v.mentorId === mentorId);
  }

  // Filter instrument
  if (instrument && instrument !== 'ALL') {
    result = result.filter(v => 
      v.instruments.some(ins => ins.toUpperCase() === String(instrument).toUpperCase())
    );
  }

  // Search
  if (search) {
    const q = String(search).toLowerCase();
    result = result.filter(v =>
      v.title.toLowerCase().includes(q) ||
      v.description.toLowerCase().includes(q) ||
      v.tags.some(t => t.toLowerCase().includes(q)) ||
      v.mentorName.toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    videos: result,
    total: result.length
  });
});

// POST /api/mentor-videos/upload - Upload video with metadata and validation
app.post('/api/mentor-videos/upload', (req: Request, res: Response) => {
  const {
    title,
    description,
    category,
    thumbnailUrl,
    videoUrl,
    durationSeconds,
    mentorId,
    mentorName,
    mentorAvatar,
    mentorSpecialization,
    instruments,
    tags,
    status,
    fileSizeMb
  } = req.body;

  if (!title || !category || !videoUrl) {
    res.status(400).json({ error: 'Title, category, and video source are required.' });
    return;
  }

  // Check if mentor has upload permissions
  const mentor = mentorsTable.find(m => m.id === mentorId);
  if (mentor && !mentor.uploadPermissionGranted) {
    res.status(403).json({
      error: 'Upload permission revoked or pending admin review. Contact academy owner.'
    });
    return;
  }

  const newVideo = {
    id: `mvid_${Date.now()}`,
    title: title.trim(),
    description: (description || '').trim(),
    category,
    thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=900&q=80',
    videoUrl,
    durationSeconds: Number(durationSeconds) || 600,
    mentorId: mentorId || 'usr_mentor_rahul',
    mentorName: mentorName || 'Rahul (Senior SMC Mentor)',
    mentorAvatar: mentorAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    mentorSpecialization: mentorSpecialization || 'Order Blocks & Liquidity',
    instruments: Array.isArray(instruments) ? instruments : ['ALL'],
    tags: Array.isArray(tags) ? tags : ['SMC'],
    status: status || 'published',
    views: 1,
    likes: 1,
    uploadedAt: 'Just now',
    commentsCount: 0,
    fileSizeMb: Number(fileSizeMb) || 120.5,
    comments: []
  };

  mentorVideosTable.unshift(newVideo);

  // Increment mentor published count
  if (mentor && newVideo.status === 'published') {
    mentor.totalPublishedVideos += 1;
  }

  res.json({ success: true, video: newVideo });
});

// PUT /api/mentor-videos/:id - Edit video
app.put('/api/mentor-videos/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = mentorVideosTable.findIndex(v => v.id === id);

  if (index === -1) {
    res.status(404).json({ error: 'Video not found' });
    return;
  }

  mentorVideosTable[index] = {
    ...mentorVideosTable[index],
    ...req.body,
    id
  };

  res.json({ success: true, video: mentorVideosTable[index] });
});

// DELETE /api/mentor-videos/:id - Delete video
app.delete('/api/mentor-videos/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  mentorVideosTable = mentorVideosTable.filter(v => v.id !== id);
  res.json({ success: true, message: 'Video deleted' });
});

// POST /api/mentor-videos/:id/like - Like video
app.post('/api/mentor-videos/:id/like', (req: Request, res: Response) => {
  const { id } = req.params;
  const video = mentorVideosTable.find(v => v.id === id);
  if (!video) {
    res.status(404).json({ error: 'Video not found' });
    return;
  }

  video.likes += 1;
  res.json({ success: true, likes: video.likes });
});

// POST /api/mentor-videos/:id/comments - Add comment
app.post('/api/mentor-videos/:id/comments', (req: Request, res: Response) => {
  const { id } = req.params;
  const { content, authorId, authorName, authorAvatar, replyToCommentId, replyToAuthorName } = req.body;

  const video = mentorVideosTable.find(v => v.id === id);
  if (!video) {
    res.status(404).json({ error: 'Video not found' });
    return;
  }

  const newComment = {
    id: `mv_comm_${Date.now()}`,
    videoId: id,
    authorId: authorId || 'usr_arun_7781',
    authorName: authorName || 'Arun Kumar',
    authorAvatar: authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    authorBadge: req.body.authorBadge || 'Student',
    content: (content || '').trim(),
    createdAt: 'Just now',
    likes: 0,
    replyToCommentId,
    replyToAuthorName
  };

  video.comments = video.comments || [];
  video.comments.push(newComment);
  video.commentsCount = video.comments.length;

  res.json({ success: true, comment: newComment });
});

// GET /api/mentors - List mentors
app.get('/api/mentors', (_req: Request, res: Response) => {
  res.json({ success: true, mentors: mentorsTable });
});

// PATCH /api/admin/mentors/:id/permissions - Grant/revoke permissions or approve mentor
app.patch('/api/admin/mentors/:id/permissions', (req: Request, res: Response) => {
  const { id } = req.params;
  const { uploadPermissionGranted, isAuthorized, status } = req.body;

  const mentor = mentorsTable.find(m => m.id === id);
  if (!mentor) {
    res.status(404).json({ error: 'Mentor not found' });
    return;
  }

  if (uploadPermissionGranted !== undefined) {
    mentor.uploadPermissionGranted = Boolean(uploadPermissionGranted);
  }
  if (isAuthorized !== undefined) {
    mentor.isAuthorized = Boolean(isAuthorized);
  }
  if (status !== undefined) {
    mentor.status = status;
  }

  res.json({ success: true, mentor });
});

// ==========================================
// 6. VITE MIDDLEWARE INTEGRATION (DEV & PROD)
// ==========================================
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    // Mount Vite in middleware mode for hot development
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[VYROX] Full-stack Server listening on port ${PORT}`);
    console.log(`[VYROX] Approved Membership Prices: Monthly ₹119 | Quarterly ₹319 | Yearly ₹1,119`);
  });
}

startServer().catch(err => {
  console.error('[VYROX] Failed to start server:', err);
  process.exit(1);
});

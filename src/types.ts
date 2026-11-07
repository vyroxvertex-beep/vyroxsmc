export type AppRole = 'student' | 'mentor' | 'owner_admin' | 'moderator' | 'payments_admin';

export type { MembershipPlan, MembershipPlanId } from './data/membershipPricing';

export type StudentTab = 
  | 'home' 
  | 'learning' 
  | 'catalog' 
  | 'mentor_videos'
  | 'membership'
  | 'mentorship' 
  | 'community' 
  | 'payment_details' 
  | 'device_security' 
  | 'profile';

export type AdminTab = 
  | 'dashboard' 
  | 'coupons'
  | 'mentor_management'
  | 'video_review'
  | 'students' 
  | 'device_approvals' 
  | 'course_manager' 
  | 'payments' 
  | 'moderation' 
  | 'audit_log' 
  | 'security_auth';

export interface DeviceInfo {
  id: string;
  deviceName: string;
  model: string;
  os: string;
  browser: string;
  ipAddress: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
  status: 'active' | 'pending_review' | 'revoked';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  role: 'student' | 'admin';
  isGoogleVerified: boolean;
  registeredDevice: DeviceInfo;
  paymentDetails: {
    gpayUpiId: string;
    binanceUid: string;
    lastUpdated: string;
  };
  enrolledCourseIds: string[];
  completedLessonIds: string[];
  activeCourseId: string;
  activeLessonId: string;
  currentPlaybackSeconds: number;
}

export interface SubtitleTrack {
  id: 'en' | 'ta' | 'tanglish' | 'off';
  label: string;
  lang: string;
  cues: Array<{
    start: number;
    end: number;
    text: string;
  }>;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  titleTamil?: string;
  durationMinutes: number;
  durationSeconds: number;
  videoDurationFormatted: string;
  isFreePreview: boolean;
  order: number;
  description: string;
  keyTakeaways: string[];
  subtitles: SubtitleTrack[];
}

export interface Course {
  id: string;
  title: string;
  tagline: string;
  badge: 'Free' | 'Core SMC' | 'Advanced' | 'Mastery';
  tier: 'free' | 'paid';
  price: number;
  originalPrice?: number;
  rating: number;
  studentCount: number;
  thumbnail: string;
  description: string;
  learningOutcomes: string[];
  lessons: Lesson[];
  level: 'Beginner' | 'Intermediate' | 'Professional';
}

export interface ChatAttachment {
  name: string;
  size: string;
  type: 'image' | 'pdf';
  url: string;
}

export interface ChatMessage {
  id: string;
  roomId: 'mentorship' | 'general' | 'batch_smc' | 'doubts';
  senderId: string;
  senderName: string;
  senderRole: 'student' | 'mentor' | 'admin';
  senderAvatar: string;
  text: string;
  timestamp: string;
  attachment?: ChatAttachment;
  isStatusPending?: boolean;
  isStatusFailed?: boolean;
  likes?: number;
}

export interface PaymentTransaction {
  id: string;
  orderRef: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseName: string;
  amount: number;
  method: 'gpay_upi' | 'binance_uid' | 'card';
  transactionId: string;
  date: string;
  status: 'verified' | 'pending' | 'failed' | 'refunded';
  screenshotUrl?: string;
  verifiedBy?: string;
}

export interface DeviceChangeRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  requestedAt: string;
  reason: string;
  oldDevice: DeviceInfo;
  newDevice: DeviceInfo;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewDate?: string;
  auditNotes?: string;
}

export interface ModerationReport {
  id: string;
  messageId: string;
  messageSnippet: string;
  reportedUserId: string;
  reportedUserName: string;
  reportedBy: string;
  reason: 'spam' | 'financial_tip' | 'inappropriate' | 'solicitation';
  timestamp: string;
  status: 'open' | 'resolved' | 'dismissed';
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  action: string;
  target: string;
  details: string;
  ipAddress: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export type DiscussionCategory =
  | 'General Trading Discussions'
  | 'Chart Analysis'
  | 'Entry Discussions'
  | 'SMC Discussions'
  | 'Trade Setups'
  | 'Trade Reviews'
  | 'Trading Psychology'
  | 'Risk Management'
  | 'Market Discussions'
  | 'Questions & Doubts'
  | 'Mistakes & Lessons'
  | 'Strategy Discussions';

export interface DiscussionComment {
  id: string;
  discussionId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorBadge?: string;
  content: string;
  createdAt: string;
  likes: number;
  likedByUser?: boolean;
  replyToCommentId?: string;
  replyToAuthorName?: string;
}

export interface DiscussionPost {
  id: string;
  title: string;
  content: string;
  category: DiscussionCategory;
  symbol?: string; // e.g. 'US30', 'XAUUSD', 'GBPUSD'
  tags: string[];
  chartImageUrl?: string;
  chartCaption?: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorBadge: 'Mentor' | 'Pro Trader' | 'Verified Student' | 'Admin';
  createdAt: string;
  updatedAt?: string;
  likes: number;
  dislikes: number;
  userVote?: 'like' | 'dislike' | null;
  isBookmarked?: boolean;
  views: number;
  commentsCount: number;
  comments: DiscussionComment[];
  isPinned?: boolean;
}

// ==========================================
// COUPON & DISCOUNT MANAGEMENT TYPES
// ==========================================
export type CouponDiscountType = 'percentage' | 'fixed';
export type CouponApplicablePlan = 'all' | 'monthly' | 'quarterly' | 'yearly';

export interface Coupon {
  id: string;
  code: string;
  discountType: CouponDiscountType;
  discountValue: number; // e.g., 20 (%) or 100 (₹)
  applicablePlans: CouponApplicablePlan;
  startDate: string;
  expiryDate: string;
  usageLimit: number;
  usedCount: number;
  perUserLimit: number;
  minPurchaseAmount: number;
  maxDiscountAmount?: number;
  status: 'active' | 'inactive';
  description?: string;
  createdAt?: string;
}

export interface CouponRedemption {
  id: string;
  couponId: string;
  couponCode: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  planId: 'monthly' | 'quarterly' | 'yearly';
  planName: string;
  originalPrice: number;
  discountAmount: number;
  finalPaidAmount: number;
  redeemedAt: string;
  orderRef: string;
}

export interface CouponAnalytics {
  totalCoupons: number;
  activeCoupons: number;
  expiredCoupons: number;
  totalRedemptions: number;
  totalDiscountProvided: number;
  mostFrequentCoupon: string;
}

// ==========================================
// MENTOR VIDEO & LEARNING SYSTEM TYPES
// ==========================================
export type MentorVideoCategory =
  | 'SMC Concepts'
  | 'Market Structure'
  | 'Liquidity Concepts'
  | 'BOS & CHOCH'
  | 'MSS & Entry Models'
  | 'FVG & Order Blocks'
  | 'Chart Analysis'
  | 'Live Market Analysis'
  | 'Trade Reviews'
  | 'Trading Psychology'
  | 'Risk Management'
  | 'Strategy Development';

export interface MentorVideoComment {
  id: string;
  videoId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorBadge?: string;
  content: string;
  createdAt: string;
  likes: number;
  likedByUser?: boolean;
  replyToCommentId?: string;
  replyToAuthorName?: string;
}

export interface MentorVideo {
  id: string;
  title: string;
  description: string;
  category: MentorVideoCategory;
  thumbnailUrl: string;
  videoUrl: string; // real video link or local object URL
  durationSeconds: number;
  mentorId: string;
  mentorName: string;
  mentorAvatar: string;
  mentorSpecialization: string;
  instruments: string[]; // e.g. ['US30', 'XAUUSD', 'GBPUSD']
  tags: string[];
  status: 'published' | 'draft' | 'pending_review' | 'rejected';
  views: number;
  likes: number;
  likedByUser?: boolean;
  isBookmarked?: boolean;
  uploadedAt: string;
  commentsCount: number;
  comments: MentorVideoComment[];
  fileSizeMb?: number;
  uploadProgress?: number;
}

export interface MentorProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  shortBio: string;
  experienceYears: number;
  tradingExperience: string;
  specialization: string;
  totalPublishedVideos: number;
  totalViews: number;
  isAuthorized: boolean;
  uploadPermissionGranted: boolean;
  status: 'active' | 'pending_approval' | 'suspended';
  joinedDate: string;
}


/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * CENTRALIZED MEMBERSHIP PRICING SOURCE OF TRUTH
 * Official Approved Prices:
 * - Monthly:  1 Month   -> ₹119
 * - Quarterly: 3 Months  -> ₹319
 * - Yearly:   12 Months -> ₹1,119
 */

export type MembershipPlanId = 'monthly' | 'quarterly' | 'yearly';

export interface MembershipPlan {
  id: MembershipPlanId;
  name: string;
  durationMonths: number;
  durationLabel: string;
  price: number; // EXACT APPROVED PRICE
  regularPrice?: number;
  perMonthLabel: string;
  popular?: boolean;
  savingsBadge?: string;
  description: string;
  features: string[];
}

export const MEMBERSHIP_PLANS: Record<MembershipPlanId, MembershipPlan> = {
  monthly: {
    id: 'monthly',
    name: 'Monthly Plan',
    durationMonths: 1,
    durationLabel: '1 Month',
    price: 119,
    regularPrice: 199,
    perMonthLabel: '₹119 / month',
    description: 'Essential institutional SMC learning access renewed every 30 days.',
    features: [
      'Complete SMC Foundations & Structure Curriculum',
      'Access to Mentor Video Learning Library (12 Focus Categories)',
      '12 Dedicated Institutional Trading Discussion Rooms',
      'Daily London & New York Session Markups',
      'Single Hardware Device Binding Security'
    ]
  },
  quarterly: {
    id: 'quarterly',
    name: 'Quarterly Plan',
    durationMonths: 3,
    durationLabel: '3 Months',
    price: 319,
    regularPrice: 499,
    perMonthLabel: '₹106 / month',
    popular: true,
    savingsBadge: 'Most Popular • Save ~11%',
    description: 'Quarterly trader transformation cohort with direct mentor feedback.',
    features: [
      'Everything included in Monthly Plan',
      'Direct 1-on-1 Chart Markup Validation with Mentor Rahul',
      'Priority Video QA & Weekly Strategy Breakdowns',
      'Advanced Order Block, FVG & Liquidity Models',
      'Downloadable PDF Strategy Cheat Sheets'
    ]
  },
  yearly: {
    id: 'yearly',
    name: 'Yearly Plan',
    durationMonths: 12,
    durationLabel: '12 Months',
    price: 1119,
    regularPrice: 1999,
    perMonthLabel: '₹93 / month',
    savingsBadge: 'Best Value • Save ~22%',
    description: 'Complete annual institutional immersion with all updates and certifications.',
    features: [
      'Everything in Quarterly Plan for 12 Full Months',
      'Unrestricted Access to All New Mentor Video Uploads',
      'Priority Hardware Migration Support (Fast-Tracked)',
      'Quarterly 1-on-1 Strategy Performance Reviews',
      'Official Institutional SMC Academy Graduate Certificate'
    ]
  }
};

export const MEMBERSHIP_PLANS_LIST: MembershipPlan[] = [
  MEMBERSHIP_PLANS.monthly,
  MEMBERSHIP_PLANS.quarterly,
  MEMBERSHIP_PLANS.yearly
];

export function getMembershipPlan(planId: string): MembershipPlan | null {
  if (planId === 'monthly' || planId === 'quarterly' || planId === 'yearly') {
    return MEMBERSHIP_PLANS[planId];
  }
  return null;
}

export function formatInr(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

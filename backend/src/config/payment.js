/**
 * Payment configuration — per-item purchase model.
 * No subscriptions. Each item is purchased individually and is valid for VALID_YEARS.
 * All values come from environment variables.
 */

export const PAYMENT_MODE       = process.env.RAZORPAY_KEY_ID ? 'razorpay' : 'dummy'
export const RAZORPAY_KEY_ID    = process.env.RAZORPAY_KEY_ID    || ''
export const RAZORPAY_KEY_SECRET= process.env.RAZORPAY_KEY_SECRET|| ''
export const CURRENCY           = process.env.PAYMENT_CURRENCY        || 'INR'
export const CURRENCY_SYMBOL    = process.env.PAYMENT_CURRENCY_SYMBOL || '₹'

/** How long a purchase stays valid (in days). Default = 730 days = 2 years. */
export const VALID_DAYS = parseInt(process.env.PURCHASE_VALID_DAYS || '730')

/**
 * Per-item pricing (in paise, 100 paise = ₹1).
 * type: 'note' | 'course' | 'interview'
 */
export const ITEM_PRICES = {
  note: {
    type:     'note',
    amount:   parseInt(process.env.PRICE_NOTE      || '9900'),   // ₹99
    label:    'Note',
    validDays: VALID_DAYS,
  },
  course: {
    type:     'course',
    amount:   parseInt(process.env.PRICE_COURSE    || '99900'),  // ₹999
    label:    'Video Course',
    validDays: VALID_DAYS,
  },
  interview: {
    type:     'interview',
    amount:   parseInt(process.env.PRICE_INTERVIEW || '9900'),   // ₹99
    label:    'Interview Topic Pack',
    validDays: VALID_DAYS,
  },
}

/** Helper: compute expiry date from purchase date */
export function expiresAt(validDays = VALID_DAYS) {
  return new Date(Date.now() + validDays * 86_400_000)
}

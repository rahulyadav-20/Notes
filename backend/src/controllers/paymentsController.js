import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid'
import { query } from '../config/db.js'
import {
  PAYMENT_MODE, ITEM_PRICES, expiresAt,
  RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET,
  CURRENCY, CURRENCY_SYMBOL,
} from '../config/payment.js'

const isDummy = PAYMENT_MODE === 'dummy'

/* ─────────────────────────────────────────────────────
   GET /api/v1/payments/plans
   Public — returns pricing info for the purchase page.
───────────────────────────────────────────────────── */
export async function getPlans(req, res) {
  return res.json({
    pricing: {
      note:      { ...ITEM_PRICES.note,      price: `${CURRENCY_SYMBOL}${Math.round(ITEM_PRICES.note.amount / 100)}` },
      course:    { ...ITEM_PRICES.course,    price: `${CURRENCY_SYMBOL}${Math.round(ITEM_PRICES.course.amount / 100)}` },
      interview: { ...ITEM_PRICES.interview, price: `${CURRENCY_SYMBOL}${Math.round(ITEM_PRICES.interview.amount / 100)}` },
    },
    currency:      CURRENCY,
    symbol:        CURRENCY_SYMBOL,
    validDays:     ITEM_PRICES.note.validDays,
    mode:          isDummy ? 'dummy' : 'razorpay',
    razorpayKeyId: isDummy ? null : RAZORPAY_KEY_ID,
  })
}

/* ─────────────────────────────────────────────────────
   POST /api/v1/payments/create-order
   Body: { type: 'note'|'course'|'interview', itemSlug|courseId|topicSlug }
───────────────────────────────────────────────────── */
export async function createOrder(req, res, next) {
  try {
    const { type, itemSlug, topicSlug, courseId, courseSlug } = req.body

    if (!type || !ITEM_PRICES[type]) {
      return res.status(400).json({ error: `type must be: ${Object.keys(ITEM_PRICES).join(' | ')}` })
    }

    const pricing = ITEM_PRICES[type]
    let amount = pricing.amount
    let label  = pricing.label
    let slug   = itemSlug || topicSlug || null
    let cId    = courseId || null

    // For notes: look up title and per-note price override from DB
    if (type === 'note') {
      if (!slug) return res.status(400).json({ error: 'itemSlug required.' })
      const noteRow = await query(
        'SELECT title, price FROM notes_metadata WHERE slug = $1', [slug]
      )
      if (!noteRow.rows[0]) return res.status(404).json({ error: 'Note not found.' })
      label = noteRow.rows[0].title
      if (noteRow.rows[0].price != null) amount = noteRow.rows[0].price
    }

    // For interview topics: look up title and per-topic price override from DB
    if (type === 'interview') {
      if (!slug) return res.status(400).json({ error: 'topicSlug required.' })
      const topicRow = await query(
        'SELECT title, price FROM interview_topics WHERE slug = $1', [slug]
      )
      if (topicRow.rows[0]) {
        label = topicRow.rows[0].title
        if (topicRow.rows[0].price != null) amount = topicRow.rows[0].price
      }
    }

    // For courses, resolve slug → id if needed and use DB price
    if (type === 'course') {
      const whereClause = cId
        ? 'WHERE id = $1 AND is_published = TRUE'
        : 'WHERE slug = $1 AND is_published = TRUE'
      const lookupId = cId || courseSlug
      if (!lookupId) return res.status(400).json({ error: 'courseId or courseSlug required.' })
      const course = await query(
        `SELECT id, title, price FROM courses ${whereClause}`, [lookupId]
      )
      if (!course.rows[0]) return res.status(404).json({ error: 'Course not found.' })
      cId    = course.rows[0].id
      amount = course.rows[0].price || amount
      label  = course.rows[0].title
    }

    // Check if user already owns this and it hasn't expired
    if (type === 'note' && slug) {
      const owns = await query(
        `SELECT id FROM note_purchases WHERE user_id=$1 AND note_slug=$2
         AND (expires_at IS NULL OR expires_at > NOW())`,
        [req.user.id, slug]
      )
      if (owns.rows[0]) return res.status(409).json({ error: 'You already own this note.' })
    }
    if (type === 'interview' && slug) {
      const owns = await query(
        `SELECT id FROM interview_purchases WHERE user_id=$1 AND topic_slug=$2
         AND (expires_at IS NULL OR expires_at > NOW())`,
        [req.user.id, slug]
      )
      if (owns.rows[0]) return res.status(409).json({ error: 'You already own this topic pack.' })
    }

    const orderId = isDummy
      ? `dummy_${type}_${uuidv4().slice(0, 12)}`
      : null  // will be set after Razorpay call

    if (isDummy) {
      await query(
        `INSERT INTO payments (user_id, course_id, razorpay_order_id, amount, currency, status)
         VALUES ($1,$2,$3,$4,$5,'created')`,
        [req.user.id, cId, orderId, amount, CURRENCY]
      )
      return res.json({
        orderId, amount, currency: CURRENCY, label, type, slug,
        mode: 'dummy',
        _note: 'Dummy — POST /payments/verify to complete.',
      })
    }

    // Razorpay
    const Razorpay = (await import('razorpay')).default
    const rzp = new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET })
    const order = await rzp.orders.create({
      amount, currency: CURRENCY,
      receipt: `rcpt_${uuidv4().slice(0, 10)}`,
    })
    await query(
      `INSERT INTO payments (user_id, course_id, razorpay_order_id, amount, currency, status)
       VALUES ($1,$2,$3,$4,$5,'created')`,
      [req.user.id, cId, order.id, amount, CURRENCY]
    )
    return res.json({ orderId: order.id, amount, currency: CURRENCY, label, type, slug, mode: 'razorpay' })
  } catch (err) {
    next(err)
  }
}

/* ─────────────────────────────────────────────────────
   POST /api/v1/payments/verify
   Body: { orderId, paymentId?, signature?, type, itemSlug|topicSlug|courseId }
───────────────────────────────────────────────────── */
export async function verifyPayment(req, res, next) {
  try {
    const {
      orderId,
      paymentId = `dummy_pay_${uuidv4().slice(0, 8)}`,
      signature = '',
      type,
      itemSlug, topicSlug, courseId, courseSlug,
    } = req.body

    if (!orderId) return res.status(400).json({ error: 'orderId required.' })

    // Signature check in Razorpay mode
    if (!isDummy) {
      const expected = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(`${orderId}|${paymentId}`)
        .digest('hex')
      if (expected !== signature) return res.status(400).json({ error: 'Payment signature invalid.' })
    }

    const payResult = await query(
      'SELECT * FROM payments WHERE razorpay_order_id=$1 AND user_id=$2',
      [orderId, req.user.id]
    )
    const payment = payResult.rows[0]
    if (!payment) return res.status(404).json({ error: 'Order not found.' })
    if (payment.status === 'paid') return res.json({ message: 'Already processed.', alreadyPaid: true })

    // Mark paid
    await query(
      `UPDATE payments SET status='paid', razorpay_payment_id=$1, updated_at=NOW() WHERE id=$2`,
      [paymentId, payment.id]
    )

    const exp = expiresAt()   // 2 years from now

    // ── Note purchase ──
    if (type === 'note' && itemSlug) {
      await query(
        `INSERT INTO note_purchases (user_id, note_slug, payment_id, amount, expires_at)
         VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT (user_id, note_slug) DO UPDATE SET
           payment_id=$3, amount=$4, expires_at=$5, purchased_at=NOW()`,
        [req.user.id, itemSlug, payment.id, payment.amount, exp]
      )
      return res.json({ message: 'Note unlocked.', type: 'note', slug: itemSlug, expiresAt: exp })
    }

    // ── Interview topic purchase ──
    if (type === 'interview' && topicSlug) {
      await query(
        `INSERT INTO interview_purchases (user_id, topic_slug, payment_id, amount, expires_at)
         VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT (user_id, topic_slug) DO UPDATE SET
           payment_id=$3, amount=$4, expires_at=$5, purchased_at=NOW()`,
        [req.user.id, topicSlug, payment.id, payment.amount, exp]
      )
      return res.json({ message: 'Interview topic unlocked.', type: 'interview', slug: topicSlug, expiresAt: exp })
    }

    // ── Course enrollment ──
    if (type === 'course') {
      // Resolve courseId from payment row or slug
      let cId = payment.course_id
      if (!cId && courseSlug) {
        const cr = await query('SELECT id FROM courses WHERE slug=$1', [courseSlug])
        cId = cr.rows[0]?.id
      }
      if (cId) {
        await query(
          `INSERT INTO enrollments (user_id, course_id, payment_id, expires_at)
           VALUES ($1,$2,$3,$4) ON CONFLICT (user_id, course_id) DO UPDATE SET expires_at=$4`,
          [req.user.id, cId, payment.id, exp]
        )
      }
      return res.json({ message: 'Course enrolled.', type: 'course', expiresAt: exp })
    }

    return res.json({ message: 'Payment recorded.' })
  } catch (err) {
    next(err)
  }
}

/* ─────────────────────────────────────────────────────
   GET /api/v1/payments/history
───────────────────────────────────────────────────── */
export async function getHistory(req, res, next) {
  try {
    const [payments, notes, interviews] = await Promise.all([
      query(
        `SELECT p.id, p.amount, p.currency, p.status, p.created_at, p.razorpay_order_id,
                c.title AS course_title, c.slug AS course_slug
         FROM payments p LEFT JOIN courses c ON c.id=p.course_id
         WHERE p.user_id=$1 AND p.status='paid' ORDER BY p.created_at DESC`,
        [req.user.id]
      ),
      query(
        `SELECT note_slug, amount, purchased_at, expires_at FROM note_purchases WHERE user_id=$1`,
        [req.user.id]
      ),
      query(
        `SELECT topic_slug, amount, purchased_at, expires_at FROM interview_purchases WHERE user_id=$1`,
        [req.user.id]
      ),
    ])
    return res.json({
      payments:   payments.rows,
      notes:      notes.rows,
      interviews: interviews.rows,
      symbol:     CURRENCY_SYMBOL,
    })
  } catch (err) {
    next(err)
  }
}

/* ─────────────────────────────────────────────────────
   GET /api/v1/payments/my-purchases
   Returns slugs the current user has active access to.
───────────────────────────────────────────────────── */
export async function myPurchases(req, res, next) {
  try {
    const [notes, interviews, courses] = await Promise.all([
      query(
        `SELECT note_slug, expires_at FROM note_purchases
         WHERE user_id=$1 AND (expires_at IS NULL OR expires_at > NOW())`,
        [req.user.id]
      ),
      query(
        `SELECT topic_slug, expires_at FROM interview_purchases
         WHERE user_id=$1 AND (expires_at IS NULL OR expires_at > NOW())`,
        [req.user.id]
      ),
      query(
        `SELECT c.slug, e.expires_at FROM enrollments e
         JOIN courses c ON c.id=e.course_id
         WHERE e.user_id=$1 AND (e.expires_at IS NULL OR e.expires_at > NOW())`,
        [req.user.id]
      ),
    ])
    return res.json({
      notes:      notes.rows.map(r => ({ slug: r.note_slug,   expiresAt: r.expires_at })),
      interviews: interviews.rows.map(r => ({ slug: r.topic_slug,  expiresAt: r.expires_at })),
      courses:    courses.rows.map(r => ({ slug: r.slug,           expiresAt: r.expires_at })),
    })
  } catch (err) {
    next(err)
  }
}

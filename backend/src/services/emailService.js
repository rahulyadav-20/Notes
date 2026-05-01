import { Resend } from 'resend'

const FROM   = process.env.EMAIL_FROM || 'EngiNotes <noreply@enginotes.dev>'
const IS_DEV = process.env.NODE_ENV !== 'production'

// Only instantiate when a key is present — avoids crash on startup in dev
function getResend() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY not set in .env')
  }
  return new Resend(process.env.RESEND_API_KEY)
}

function devLog(label, to, otp) {
  console.log(`\n📧  [DEV EMAIL — NOT SENT]\n    Type: ${label}\n    To: ${to}\n    OTP: ${otp}\n`)
}

function otpBox(otp) {
  return `
    <div style="background:#f8f8fc;border:2px solid #e5e7eb;border-radius:12px;
      padding:20px;text-align:center;">
      <span style="font-size:2.4rem;font-weight:900;letter-spacing:10px;
        color:#12123a;font-family:'Courier New',monospace;">${otp}</span>
    </div>`
}

function emailWrapper(body) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#f4f4f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:480px;background:#ffffff;border-radius:16px;
        border:1px solid #e5e7eb;padding:40px 36px;">
        <tr><td style="padding-bottom:28px;">
          <span style="font-size:1.3rem;font-weight:900;color:#12123a;letter-spacing:-0.5px;">
            Engi<span style="color:#f5820a;">Notes</span>
          </span>
        </td></tr>
        ${body}
        <tr><td>
          <p style="margin:0;font-size:0.72rem;color:#d1d5db;border-top:1px solid #f3f4f6;padding-top:20px;">
            © ${new Date().getFullYear()} EngiNotes · All rights reserved
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}

/* ── Send OTP verification email ── */
export async function sendOtpEmail({ to, name, otp }) {
  if (IS_DEV && !process.env.RESEND_API_KEY) {
    devLog('EMAIL VERIFICATION', to, otp)
    return
  }

  await getResend().emails.send({
    from: FROM, to,
    subject: `${otp} is your EngiNotes verification code`,
    html: emailWrapper(`
      <tr><td style="padding-bottom:8px;">
        <h1 style="margin:0;font-size:1.4rem;font-weight:900;color:#12123a;">Verify your email</h1>
      </td></tr>
      <tr><td style="padding-bottom:24px;">
        <p style="margin:0;font-size:0.9rem;color:#6b7280;line-height:1.6;">
          Hi ${name}, use the code below to verify your EngiNotes account.
          It expires in <strong style="color:#12123a;">10 minutes</strong>.
        </p>
      </td></tr>
      <tr><td style="padding-bottom:28px;">${otpBox(otp)}</td></tr>
      <tr><td style="padding-bottom:24px;">
        <p style="margin:0;font-size:0.78rem;color:#9ca3af;line-height:1.5;">
          If you didn't create an EngiNotes account, you can safely ignore this email.
          Never share this code with anyone.
        </p>
      </td></tr>`),
  })
}

/* ── Send password reset email ── */
export async function sendPasswordResetEmail({ to, name, otp }) {
  if (IS_DEV && !process.env.RESEND_API_KEY) {
    devLog('PASSWORD RESET', to, otp)
    return
  }

  await getResend().emails.send({
    from: FROM, to,
    subject: `${otp} — Reset your EngiNotes password`,
    html: emailWrapper(`
      <tr><td style="padding-bottom:8px;">
        <h1 style="margin:0;font-size:1.4rem;font-weight:900;color:#12123a;">Reset your password</h1>
      </td></tr>
      <tr><td style="padding-bottom:24px;">
        <p style="margin:0;font-size:0.9rem;color:#6b7280;line-height:1.6;">
          Hi ${name}, use the code below to reset your EngiNotes password.
          It expires in <strong style="color:#12123a;">10 minutes</strong>.
        </p>
      </td></tr>
      <tr><td style="padding-bottom:28px;">${otpBox(otp)}</td></tr>
      <tr><td style="padding-bottom:24px;">
        <p style="margin:0;font-size:0.78rem;color:#9ca3af;line-height:1.5;">
          If you didn't request a password reset, you can safely ignore this email.
          Never share this code with anyone.
        </p>
      </td></tr>`),
  })
}

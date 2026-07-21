/**
 * Email templates for SubDub subscription renewal reminders.
 *
 * Exports an `emailTemplates` array consumed by send-email.js.
 * Each template has:
 *   - label          → matches the `type` passed to sendReminderEmail (7, 5, or 1)
 *   - generateSubject(mailInfo) → returns the email subject string
 *   - generateBody(mailInfo)    → returns the full HTML email body
 *
 * mailInfo shape (built by send-email.js):
 *   { userName, subscriptionName, renewalDate, planName, price, paymentMethod }
 */

// ── Color Palettes ──────────────────────────────────────────────────────────────
const palettes = {
  7: {
    bg: '#f0f9ff',
    cardBg: '#ffffff',
    accent: '#0ea5e9',
    accentDark: '#0284c7',
    accentLight: '#e0f2fe',
    badge: '#0ea5e9',
    badgeBg: '#e0f2fe',
    badgeText: '#0c4a6e',
    heading: '#0c4a6e',
    text: '#334155',
    muted: '#64748b',
    border: '#bae6fd',
    btnText: '#ffffff',
    icon: '🔔',
    tagline: 'Friendly Reminder',
  },
  5: {
    bg: '#fffbeb',
    cardBg: '#ffffff',
    accent: '#f59e0b',
    accentDark: '#d97706',
    accentLight: '#fef3c7',
    badge: '#f59e0b',
    badgeBg: '#fef3c7',
    badgeText: '#78350f',
    heading: '#78350f',
    text: '#334155',
    muted: '#64748b',
    border: '#fde68a',
    btnText: '#ffffff',
    icon: '⏰',
    tagline: 'Renewal Coming Soon',
  },
  1: {
    bg: '#fef2f2',
    cardBg: '#ffffff',
    accent: '#ef4444',
    accentDark: '#dc2626',
    accentLight: '#fee2e2',
    badge: '#ef4444',
    badgeBg: '#fee2e2',
    badgeText: '#7f1d1d',
    heading: '#7f1d1d',
    text: '#334155',
    muted: '#64748b',
    border: '#fecaca',
    btnText: '#ffffff',
    icon: '🚨',
    tagline: 'Action Required — Renewing Tomorrow',
  },
};

// ── Helpers ──────────────────────────────────────────────────────────────────────

/** Format payment method enum into human-readable text */
const formatPaymentMethod = (method) => {
  const map = {
    credit_card: 'Credit Card',
    paypal: 'PayPal',
    bank_transfer: 'Bank Transfer',
    other: 'Other',
  };
  return map[method] || method;
};

/** Return a contextual subject line based on days left */
const getSubjectLine = (subscriptionName, daysLeft) => {
  switch (daysLeft) {
    case 7:
      return `🔔 ${subscriptionName} renews in 7 days`;
    case 5:
      return `⏰ ${subscriptionName} renews in 5 days — review your plan`;
    case 1:
      return `🚨 ${subscriptionName} renews TOMORROW — take action now`;
    default:
      return `${subscriptionName} renewal reminder`;
  }
};

/** Build the urgency-dependent headline copy */
const getHeadlineCopy = (daysLeft, subscriptionName) => {
  switch (daysLeft) {
    case 7:
      return `Your <strong>${subscriptionName}</strong> subscription renews in <strong>7 days</strong>.`;
    case 5:
      return `Heads up — <strong>${subscriptionName}</strong> renews in just <strong>5 days</strong>.`;
    case 1:
      return `<strong>${subscriptionName}</strong> renews <strong>tomorrow</strong>. Review your details now.`;
    default:
      return `Your <strong>${subscriptionName}</strong> subscription is renewing soon.`;
  }
};

/** Build a contextual paragraph below the headline */
const getBodyCopy = (daysLeft) => {
  switch (daysLeft) {
    case 7:
      return 'This is a friendly heads-up so you have plenty of time to review your subscription details, update your payment method, or make changes to your plan before the renewal date.';
    case 5:
      return 'Your renewal date is approaching quickly. If you need to cancel, switch plans, or update your payment information, now is a great time to do so.';
    case 1:
      return 'Your subscription will automatically renew tomorrow. If you do not wish to continue, please cancel or adjust your plan immediately to avoid being charged.';
    default:
      return 'Please review your subscription details below.';
  }
};

// ── HTML Body Generator (internal) ──────────────────────────────────────────────

const generateEmailBody = (daysLeft, { userName, subscriptionName, renewalDate, planName, price, paymentMethod }) => {
  const p = palettes[daysLeft] || palettes[7];
  const subject = getSubjectLine(subscriptionName, daysLeft);
  const headline = getHeadlineCopy(daysLeft, subscriptionName);
  const body = getBodyCopy(daysLeft);
  const formattedPayment = formatPaymentMethod(paymentMethod);
  const currentYear = new Date().getFullYear();

  return `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${subject}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    /* ── Reset ─────────────────────────────── */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; background-color: ${p.bg}; }

    /* ── Responsive ────────────────────────── */
    @media only screen and (max-width: 620px) {
      .email-container { width: 100% !important; padding: 16px !important; }
      .stack-column { display: block !important; width: 100% !important; }
      .detail-value { font-size: 15px !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:${p.bg}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">

  <!-- Preheader (hidden preview text) -->
  <div style="display:none; font-size:1px; color:${p.bg}; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden;">
    ${subscriptionName} renews in ${daysLeft} day${daysLeft > 1 ? 's' : ''} — review your subscription details.
  </div>

  <!-- Outer wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${p.bg};">
    <tr>
      <td align="center" style="padding: 40px 16px;">

        <!-- Email Container (max 600px) -->
        <table role="presentation" class="email-container" width="600" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">

          <!-- ═══ HEADER BAR ═══ -->
          <tr>
            <td style="background: linear-gradient(135deg, ${p.accent}, ${p.accentDark}); border-radius: 16px 16px 0 0; padding: 32px 40px; text-align: center;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <!-- Logo / Brand -->
                    <div style="font-size: 28px; margin-bottom: 8px;">${p.icon}</div>
                    <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">
                      SubDub
                    </h1>
                    <p style="margin: 6px 0 0; font-size: 13px; color: rgba(255,255,255,0.85); text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">
                      ${p.tagline}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ═══ MAIN CARD ═══ -->
          <tr>
            <td style="background-color: ${p.cardBg}; padding: 0;">

              <!-- Days-left badge strip -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding: 28px 40px 0;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="background-color: ${p.badgeBg}; border: 1px solid ${p.border}; border-radius: 100px; padding: 8px 20px;">
                          <span style="font-size: 13px; font-weight: 700; color: ${p.badgeText}; letter-spacing: 0.5px;">
                            ${daysLeft === 1 ? '⚡ RENEWS TOMORROW' : `${daysLeft} DAYS UNTIL RENEWAL`}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Greeting & headline -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding: 24px 40px 0;">
                    <p style="margin: 0 0 12px; font-size: 16px; color: ${p.text};">
                      Hi <strong>${userName}</strong>,
                    </p>
                    <p style="margin: 0 0 16px; font-size: 18px; line-height: 1.5; color: ${p.heading}; font-weight: 600;">
                      ${headline}
                    </p>
                    <p style="margin: 0; font-size: 15px; line-height: 1.65; color: ${p.muted};">
                      ${body}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- ── Subscription Details Card ── -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding: 28px 40px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                      style="background-color: ${p.accentLight}; border: 1px solid ${p.border}; border-radius: 12px; overflow: hidden;">

                      <!-- Card title -->
                      <tr>
                        <td colspan="2" style="padding: 18px 24px 12px; border-bottom: 1px solid ${p.border};">
                          <p style="margin: 0; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: ${p.badge};">
                            Subscription Details
                          </p>
                        </td>
                      </tr>

                      <!-- Subscription Name -->
                      <tr>
                        <td style="padding: 14px 24px 0; width: 40%; vertical-align: top;">
                          <p style="margin: 0; font-size: 12px; font-weight: 600; color: ${p.muted}; text-transform: uppercase; letter-spacing: 0.5px;">
                            Service
                          </p>
                        </td>
                        <td class="detail-value" style="padding: 14px 24px 0; vertical-align: top;">
                          <p style="margin: 0; font-size: 16px; font-weight: 700; color: ${p.heading};">
                            ${subscriptionName}
                          </p>
                        </td>
                      </tr>

                      <!-- Plan -->
                      <tr>
                        <td style="padding: 12px 24px 0; vertical-align: top;">
                          <p style="margin: 0; font-size: 12px; font-weight: 600; color: ${p.muted}; text-transform: uppercase; letter-spacing: 0.5px;">
                            Plan
                          </p>
                        </td>
                        <td class="detail-value" style="padding: 12px 24px 0; vertical-align: top;">
                          <p style="margin: 0; font-size: 15px; color: ${p.text};">
                            ${planName}
                          </p>
                        </td>
                      </tr>

                      <!-- Price -->
                      <tr>
                        <td style="padding: 12px 24px 0; vertical-align: top;">
                          <p style="margin: 0; font-size: 12px; font-weight: 600; color: ${p.muted}; text-transform: uppercase; letter-spacing: 0.5px;">
                            Amount
                          </p>
                        </td>
                        <td class="detail-value" style="padding: 12px 24px 0; vertical-align: top;">
                          <p style="margin: 0; font-size: 20px; font-weight: 800; color: ${p.accent};">
                            ${price}
                          </p>
                        </td>
                      </tr>

                      <!-- Renewal Date -->
                      <tr>
                        <td style="padding: 12px 24px 0; vertical-align: top;">
                          <p style="margin: 0; font-size: 12px; font-weight: 600; color: ${p.muted}; text-transform: uppercase; letter-spacing: 0.5px;">
                            Renewal Date
                          </p>
                        </td>
                        <td class="detail-value" style="padding: 12px 24px 0; vertical-align: top;">
                          <p style="margin: 0; font-size: 15px; font-weight: 600; color: ${p.text};">
                            📅 ${renewalDate}
                          </p>
                        </td>
                      </tr>

                      <!-- Payment Method -->
                      <tr>
                        <td style="padding: 12px 24px 18px; vertical-align: top;">
                          <p style="margin: 0; font-size: 12px; font-weight: 600; color: ${p.muted}; text-transform: uppercase; letter-spacing: 0.5px;">
                            Payment
                          </p>
                        </td>
                        <td class="detail-value" style="padding: 12px 24px 18px; vertical-align: top;">
                          <p style="margin: 0; font-size: 15px; color: ${p.text};">
                            💳 ${formattedPayment}
                          </p>
                        </td>
                      </tr>

                    </table>
                  </td>
                </tr>
              </table>

              <!-- ── CTA Button ── -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding: 0 40px 32px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                      <tr>
                        <td align="center"
                          style="background: linear-gradient(135deg, ${p.accent}, ${p.accentDark}); border-radius: 10px; padding: 0;">
                          <a href="#"
                            style="display: inline-block; padding: 14px 36px; font-size: 15px; font-weight: 700; color: ${p.btnText}; text-decoration: none; letter-spacing: 0.3px;">
                            ${daysLeft === 1 ? 'Review & Manage Now' : 'Manage Subscription'}
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              ${daysLeft === 1 ? `
              <!-- ── Urgent Warning Banner (1-day only) ── -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding: 0 40px 28px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                      style="background-color: #fef2f2; border: 1px solid #fecaca; border-left: 4px solid #ef4444; border-radius: 8px;">
                      <tr>
                        <td style="padding: 16px 20px;">
                          <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #991b1b;">
                            <strong>⚠️ Important:</strong> If you do not take action before the renewal date, your payment method on file will be charged <strong>${price}</strong> automatically.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              ` : ''}

              <!-- ── Divider ── -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding: 0 40px;">
                    <div style="border-top: 1px solid #e2e8f0; margin: 0;"></div>
                  </td>
                </tr>
              </table>

              <!-- ── Help / Support section ── -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding: 24px 40px 32px; text-align: center;">
                    <p style="margin: 0; font-size: 14px; color: ${p.muted};">
                      Questions about your subscription? Reply to this email or contact our support team.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- ═══ FOOTER ═══ -->
          <tr>
            <td style="background-color: #1e293b; border-radius: 0 0 16px 16px; padding: 28px 40px; text-align: center;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 8px; font-size: 16px; font-weight: 700; color: #ffffff; letter-spacing: -0.3px;">
                      SubDub
                    </p>
                    <p style="margin: 0 0 16px; font-size: 12px; color: #94a3b8; line-height: 1.6;">
                      Smart subscription tracking &amp; renewal reminders.
                    </p>
                    <p style="margin: 0; font-size: 11px; color: #475569; line-height: 1.5;">
                      © ${currentYear} SubDub. All rights reserved.<br />
                      You received this email because you have an active subscription tracked on SubDub.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
        <!-- /Email Container -->

      </td>
    </tr>
  </table>

</body>
</html>
  `.trim();
};

// ── Exported Templates Array ────────────────────────────────────────────────────
// Each entry matches the contract expected by send-email.js:
//   emailTemplates.find((t) => t.label === type)
//   template.generateSubject(mailInfo)  → string
//   template.generateBody(mailInfo)     → HTML string

export const emailTemplates = [
  {
    label: 7,
    generateSubject: ({ subscriptionName }) =>
      getSubjectLine(subscriptionName, 7),
    generateBody: (mailInfo) =>
      generateEmailBody(7, mailInfo),
  },
  {
    label: 5,
    generateSubject: ({ subscriptionName }) =>
      getSubjectLine(subscriptionName, 5),
    generateBody: (mailInfo) =>
      generateEmailBody(5, mailInfo),
  },
  {
    label: 1,
    generateSubject: ({ subscriptionName }) =>
      getSubjectLine(subscriptionName, 1),
    generateBody: (mailInfo) =>
      generateEmailBody(1, mailInfo),
  },
];

export default emailTemplates;

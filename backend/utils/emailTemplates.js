/**
 * Styled HTML email templates matching the portfolio dark theme.
 *
 * Palette
 * ───────
 *  bg:      #0a0a0a
 *  card:    #111111
 *  surface: #161616
 *  border:  #1e1e1e
 *  accent:  #6c63ff  /  #8b83ff
 *  muted:   #888888
 *  text:    #ffffff
 */

const SITE_URL = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/+$/, "") : "https://kunaldhangar.me";
const OWNER_NAME = "Kunal Dhangar";

/* ─── shared wrapper ─── */
const wrap = (body) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kunal Dhangar</title>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0a0a0a;padding:40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background-color:#111111;border-radius:16px;border:1px solid #1e1e1e;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#6c63ff 0%,#8b83ff 100%);padding:32px 40px;text-align:center;">
              <a href="${SITE_URL}" style="text-decoration:none;">
                <span style="font-size:28px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">${OWNER_NAME}</span>
              </a>
              <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.75);letter-spacing:0.5px;">Full-Stack Web &amp; Android Developer</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:36px 40px 28px;">
              ${body}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px 28px;border-top:1px solid #1e1e1e;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="text-align:center;">
                    <!-- Social links -->
                    <p style="margin:0 0 12px;">
                      <a href="https://github.com/imkunal01" style="display:inline-block;margin:0 8px;color:#888888;text-decoration:none;font-size:13px;">GitHub</a>
                      <span style="color:#333;">•</span>
                      <a href="https://www.linkedin.com/in/kunaldhangar/" style="display:inline-block;margin:0 8px;color:#888888;text-decoration:none;font-size:13px;">LinkedIn</a>
                      <span style="color:#333;">•</span>
                      <a href="${SITE_URL}" style="display:inline-block;margin:0 8px;color:#888888;text-decoration:none;font-size:13px;">Portfolio</a>
                    </p>
                    <p style="margin:0;font-size:12px;color:#555555;line-height:1.6;">
                      © ${new Date().getFullYear()} ${OWNER_NAME}. All rights reserved.<br/>
                      India — Remote &nbsp;·&nbsp; Available for work
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

/* ─────────────────────────────────────────────
   1. Visitor notification  → sent to OWNER
   ───────────────────────────────────────────── */
function visitorNotification({ ip, page, referrer, userAgent, visitedAt }) {
  const time = new Date(visitedAt || Date.now()).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  });

  const body = `
    <h2 style="margin:0 0 8px;color:#ffffff;font-size:22px;font-weight:600;">
      🚀 New Visitor on Your Portfolio
    </h2>
    <p style="margin:0 0 24px;color:#888888;font-size:14px;">Someone just landed on your site.</p>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#161616;border:1px solid #1e1e1e;border-radius:12px;overflow:hidden;">
      <tr>
        <td style="padding:16px 20px;border-bottom:1px solid #1e1e1e;">
          <span style="color:#888888;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Page</span><br/>
          <span style="color:#ffffff;font-size:15px;font-weight:500;">${page || "/"}</span>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 20px;border-bottom:1px solid #1e1e1e;">
          <span style="color:#888888;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Time (IST)</span><br/>
          <span style="color:#ffffff;font-size:15px;font-weight:500;">${time}</span>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 20px;border-bottom:1px solid #1e1e1e;">
          <span style="color:#888888;font-size:12px;text-transform:uppercase;letter-spacing:1px;">IP Address</span><br/>
          <span style="color:#ffffff;font-size:15px;font-weight:500;">${ip || "Unknown"}</span>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 20px;border-bottom:1px solid #1e1e1e;">
          <span style="color:#888888;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Referrer</span><br/>
          <span style="color:#ffffff;font-size:15px;font-weight:500;">${referrer || "Direct visit"}</span>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 20px;">
          <span style="color:#888888;font-size:12px;text-transform:uppercase;letter-spacing:1px;">User Agent</span><br/>
          <span style="color:#888888;font-size:13px;">${userAgent || "N/A"}</span>
        </td>
      </tr>
    </table>

    <p style="margin:24px 0 0;text-align:center;">
      <a href="${SITE_URL}" style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#6c63ff,#8b83ff);color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;">View Portfolio</a>
    </p>`;

  return {
    subject: `👁️ New visitor on your portfolio — ${page || "/"}`,
    html: wrap(body),
  };
}

/* ─────────────────────────────────────────────
   2. Contact form — notification to OWNER
   ───────────────────────────────────────────── */
function contactOwnerNotification({ name, email, message }) {
  const body = `
    <h2 style="margin:0 0 8px;color:#ffffff;font-size:22px;font-weight:600;">
      📬 New Contact Form Submission
    </h2>
    <p style="margin:0 0 24px;color:#888888;font-size:14px;">You have a new message from your portfolio.</p>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#161616;border:1px solid #1e1e1e;border-radius:12px;overflow:hidden;">
      <tr>
        <td style="padding:16px 20px;border-bottom:1px solid #1e1e1e;">
          <span style="color:#888888;font-size:12px;text-transform:uppercase;letter-spacing:1px;">From</span><br/>
          <span style="color:#ffffff;font-size:15px;font-weight:500;">${name}</span>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 20px;border-bottom:1px solid #1e1e1e;">
          <span style="color:#888888;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Email</span><br/>
          <a href="mailto:${email}" style="color:#8b83ff;font-size:15px;text-decoration:none;">${email}</a>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 20px;">
          <span style="color:#888888;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Message</span><br/>
          <p style="color:#ffffff;font-size:15px;line-height:1.6;margin:8px 0 0;white-space:pre-wrap;">${message}</p>
        </td>
      </tr>
    </table>

    <p style="margin:24px 0 0;text-align:center;">
      <a href="mailto:${email}" style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#6c63ff,#8b83ff);color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;">Reply to ${name}</a>
    </p>`;

  return {
    subject: `📬 Portfolio contact from ${name}`,
    html: wrap(body),
  };
}

/* ─────────────────────────────────────────────
   3. Contact auto-reply — sent to VISITOR
   ───────────────────────────────────────────── */
function contactAutoReply({ name }) {
  const firstName = name.split(" ")[0];

  const body = `
    <h2 style="margin:0 0 8px;color:#ffffff;font-size:22px;font-weight:600;">
      Hey ${firstName}! 👋
    </h2>
    <p style="margin:0 0 20px;color:#cccccc;font-size:15px;line-height:1.7;">
      Thank you so much for reaching out through my portfolio. I really appreciate you taking the time to write to me!
    </p>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#161616;border:1px solid #1e1e1e;border-radius:12px;overflow:hidden;">
      <tr>
        <td style="padding:24px;">
          <p style="margin:0;color:#cccccc;font-size:14px;line-height:1.7;">
            I've received your message and I'll get back to you as soon as possible — typically within <strong style="color:#ffffff;">24 hours</strong>.
          </p>
          <p style="margin:16px 0 0;color:#cccccc;font-size:14px;line-height:1.7;">
            In the meantime, feel free to check out my latest work or connect with me on social media.
          </p>
        </td>
      </tr>
    </table>

    <p style="margin:28px 0 16px;text-align:center;">
      <a href="${SITE_URL}" style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#6c63ff,#8b83ff);color:#ffffff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:600;">Visit My Portfolio</a>
    </p>
    <p style="margin:0;text-align:center;">
      <a href="https://www.linkedin.com/in/kunaldhangar/" style="display:inline-block;padding:10px 24px;border:1px solid #1e1e1e;color:#8b83ff;text-decoration:none;border-radius:8px;font-size:13px;font-weight:500;">Connect on LinkedIn →</a>
    </p>

    <p style="margin:28px 0 0;color:#888888;font-size:13px;line-height:1.6;">
      Looking forward to connecting!<br/>
      <strong style="color:#ffffff;">— ${OWNER_NAME}</strong>
    </p>`;

  return {
    subject: `Thanks for reaching out, ${firstName}! 🙌`,
    html: wrap(body),
  };
}

module.exports = {
  visitorNotification,
  contactOwnerNotification,
  contactAutoReply,
};

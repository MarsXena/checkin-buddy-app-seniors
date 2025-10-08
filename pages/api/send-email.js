import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const { to, subject, html, text } = req.body || {};
    if (!to || !subject) return res.status(400).json({ error: "Missing 'to' or 'subject'" });

    await sgMail.send({
      to,
      from: process.env.EMAIL_FROM, // must be a verified sender/domain in SendGrid
      subject,
      text: text ?? "",
      html: html ?? `<p>${(text || "").replace(/\n/g, "<br/>")}</p>`,
    });

    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e?.message || "Unknown error" });
  }
}

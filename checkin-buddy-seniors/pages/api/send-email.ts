import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { to, subject, html, text } = req.body || {};
    if (!to || !subject) return res.status(400).json({ error: "Missing 'to' or 'subject'" });

    const from = process.env.EMAIL_FROM || "Check-in Buddy <noreply@example.com>";

    const result = await resend.emails.send({
      from,
      to,
      subject,
      html: html ?? `<p>${(text || "").replace(/\n/g, "<br/>")}</p>`,
      text,
    });

    if (result.error) return res.status(500).json({ error: result.error.message });
    return res.status(200).json({ ok: true, id: result.data?.id });
  } catch (e) {
    return res.status(500).json({ error: e?.message || "Unknown error" });
  }
}

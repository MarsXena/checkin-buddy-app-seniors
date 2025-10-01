const sgMail = require('@sendgrid/mail')

const hasSendgrid = process.env.SENDGRID_API_KEY && process.env.CONTACT_TO_EMAIL && process.env.SENDGRID_FROM_EMAIL
if (hasSendgrid) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ ok:false, error:'Method not allowed' })
  }
  try {
    const { name = '', email = '', message = '' } = req.body || {}
    if (!hasSendgrid) {
      return res.status(200).json({ ok:true, note:'SendGrid not configured; message not sent.' })
    }
    const msg = {
      to: process.env.CONTACT_TO_EMAIL,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: 'New Contact Form Submission — Check-In Buddy',
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`
    }
    await sgMail.send(msg)
    return res.status(200).json({ ok:true })
  } catch (e) {
    console.error('api/contact error', e)
    return res.status(500).json({ ok:false, error: e.message })
  }
}

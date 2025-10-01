const twilio = require('twilio')
const sgMail = require('@sendgrid/mail')

const hasTwilio = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM_NUMBER
const hasSendgrid = process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM_EMAIL

let twilioClient = null
if (hasTwilio) {
  twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
}
if (hasSendgrid) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ ok:false, error:'Method not allowed' })
  }
  try {
    const {
      seniorName = 'Senior',
      caregiverName = 'Caregiver',
      phone = '',
      email = '',
      notifyVia = 'sms',
      message = ''
    } = req.body || {}

    const text = message || `${seniorName} checked in at ${new Date().toLocaleString()}`
    const results = { sms: null, email: null }

    if ((notifyVia === 'sms' || notifyVia === 'both') && hasTwilio && phone) {
      results.sms = await twilioClient.messages.create({
        body: `Check-In Buddy: ${text}`,
        from: process.env.TWILIO_FROM_NUMBER,
        to: phone
      })
    }

    if ((notifyVia === 'email' || notifyVia === 'both') && hasSendgrid && email) {
      const msg = {
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: 'Check-In Buddy Update',
        text: `Hello ${caregiverName},\n\n${text}\n\n— Check-In Buddy`
      }
      results.email = await sgMail.send(msg)
    }

    return res.status(200).json({ ok:true, results, note: (!hasTwilio && notifyVia!=='email') || (!hasSendgrid && notifyVia!=='sms') ? 'Some providers not configured' : undefined })
  } catch (e) {
    console.error('api/checkin error', e)
    return res.status(500).json({ ok:false, error: e.message })
  }
}

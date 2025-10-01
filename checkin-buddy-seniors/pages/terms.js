export default function Terms() {
  return (
    <main style={{maxWidth:800, margin:'40px auto', padding:'0 16px', lineHeight:1.6}}>
      <h1>Terms of Use</h1>
      <p><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>
      <p><em>Plain-English summary:</em> This MVP is provided “as is.” It’s intended to help seniors send simple check-ins to caregivers. Use at your own discretion, and always call emergency services when needed.</p>
      <h2>1. Service</h2>
      <p>Check-In Buddy allows a user to send a simple notification via SMS and/or email to a designated caregiver.</p>
      <h2>2. No Medical Advice</h2>
      <p>This app is not a medical device and does not provide medical advice or monitoring.</p>
      <h2>3. Data</h2>
      <p>We only handle the information you enter (e.g., names, phone numbers, emails) for the purpose of sending notifications. We do not track location. See our Privacy Policy for details.</p>
      <h2>4. Limitation of Liability</h2>
      <p>To the fullest extent permitted by law, the app owners are not liable for any damages arising from use of this app.</p>
      <h2>5. Changes</h2>
      <p>We may update these Terms. Continued use constitutes acceptance.</p>
    </main>
  )
}

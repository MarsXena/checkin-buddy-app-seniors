export default function Privacy() {
  return (
    <main style={{maxWidth:800, margin:'40px auto', padding:'0 16px', lineHeight:1.6}}>
      <h1>Privacy Policy</h1>
      <p><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>
      <p><em>Plain-English summary:</em> We aim to collect the bare minimum needed for your check-ins to reach caregivers. No location tracking.</p>
      <h2>1. What We Collect</h2>
      <ul>
        <li>Names you enter (e.g., senior, caregiver)</li>
        <li>Caregiver contact details (phone, email)</li>
        <li>Message content (check-in text)</li>
      </ul>
      <h2>2. How We Use It</h2>
      <p>We use this data solely to deliver notifications via SMS and/or email. Settings are stored locally in your browser for convenience.</p>
      <h2>3. What We Do Not Collect</h2>
      <p>We do not collect precise location. We do not sell your data.</p>
      <h2>4. Third Parties</h2>
      <p>SMS and email are sent through third-party providers (e.g., Twilio, SendGrid). Their systems may process necessary metadata to deliver messages.</p>
      <h2>5. Security</h2>
      <p>As an MVP, we keep data surface small. Avoid sharing sensitive medical details in messages.</p>
      <h2>6. Contact</h2>
      <p>If you have questions, please use the contact form on the home page.</p>
    </main>
  )
}

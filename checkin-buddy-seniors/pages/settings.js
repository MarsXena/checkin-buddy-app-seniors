import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Settings() {
  const [seniorName, setSeniorName] = useState('')
  const [caregiverName, setCaregiverName] = useState('')
  const [caregiverPhone, setCaregiverPhone] = useState('')
  const [caregiverEmail, setCaregiverEmail] = useState('')
  const [notifyVia, setNotifyVia] = useState('sms')
  const [reminderTime, setReminderTime] = useState('')
  const [pin, setPin] = useState('')
  const [saved, setSaved] = useState(false)
  const [brandName, setBrandName] = useState('')
  const [logoUrl, setLogoUrl] = useState('')

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem('cib_settings')) || {}
      setSeniorName(s.seniorName || '')
      setCaregiverName(s.caregiverName || '')
      setCaregiverPhone(s.caregiverPhone || '')
      setCaregiverEmail(s.caregiverEmail || '')
      setNotifyVia(s.notifyVia || 'sms')
      setReminderTime(s.reminderTime || '')
      setPin(s.pin || '')
      setBrandName((s.brandName)||'')
      setLogoUrl((s.logoUrl)||'')
    } catch {}
  }, [])

  function save() {
    const s = { seniorName, caregiverName, caregiverPhone, caregiverEmail, notifyVia, reminderTime, pin }
    localStorage.setItem('cib_settings', JSON.stringify(s))
    localStorage.setItem('cib_brand', JSON.stringify({ brandName, logoUrl }))
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  return (
    <main style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh'}}>
      <div className="container" style={{textAlign:'left', maxWidth: 640}}>
        <div className="topbar" style={{left:12, right:'auto'}}>
          <Link className="iconBtn" href="/" aria-label="Back">←</Link>
        </div>
        <h1 className="h1" style={{textAlign:'center'}}>Settings</h1>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
          <label style={{gridColumn:'1 / -1'}}>Senior Name
            <input value={seniorName} onChange={e=>setSeniorName(e.target.value)} placeholder="e.g., Mom" style={inputStyle}/>
          </label>
          <label>Caregiver Name
            <input value={caregiverName} onChange={e=>setCaregiverName(e.target.value)} placeholder="e.g., Jerushah" style={inputStyle}/>
          </label>
          <label>Caregiver Phone (SMS)
            <input value={caregiverPhone} onChange={e=>setCaregiverPhone(e.target.value)} placeholder="+12025550123" style={inputStyle}/>
          </label>
          <label>Caregiver Email
            <input value={caregiverEmail} onChange={e=>setCaregiverEmail(e.target.value)} placeholder="name@example.com" style={inputStyle}/>
          </label>
          <label>Notify Via
            <select value={notifyVia} onChange={e=>setNotifyVia(e.target.value)} style={inputStyle}>
              <option value="sms">SMS</option>
              <option value="email">Email</option>
              <option value="both">Both</option>
            </select>
          </label>
          <label>Reminder Time (local)
            <input type="time" value={reminderTime} onChange={e=>setReminderTime(e.target.value)} style={inputStyle}/>
          </label>
          <label style={{gridColumn:'1 / -1'}}>Set 4‑digit PIN (optional)
            <input inputMode="numeric" pattern="[0-9]*" maxLength={4} value={pin} onChange={e=>setPin(e.target.value.replace(/\D/g,''))} placeholder="••••" style={inputStyle}/>
          </label>
        </div>

        <div style={{display:'flex', justifyContent:'flex-end', gap:8, marginTop:12}}>
          <Link href="/" className="btn">Cancel</Link>
          <button className="btn" onClick={save}>Save</button>
        </div>
        {saved && <div style={{marginTop:10, color:'#2e7d32', fontWeight:600}}>Saved ✓</div>}

        <hr style={{margin:'24px 0'}}/>
        <h2 style={{marginTop:0}}>Test</h2>
        <p>You can send yourself a quick test message to verify your settings.</p>
        <button className="btn" onClick={async()=>{
          try {
            const when = new Date()
            const res = await fetch('/api/checkin', {
              method:'POST',
              headers:{'Content-Type':'application/json'},
              body: JSON.stringify({
                seniorName: seniorName || 'Senior',
                caregiverName: caregiverName || 'Caregiver',
                phone: caregiverPhone || '',
                email: caregiverEmail || '',
                notifyVia,
                message: `[TEST] ${seniorName || 'Senior'} test message at ${when.toLocaleString()}`
              })
            })
            if (!res.ok) throw new Error('Network error')
            alert('Test sent (if credentials configured).')
          } catch (e) {
            alert('Could not send test. Check credentials.')
          }
        }}>Send Test</button>
      </div>
    </main>
  )
}

const inputStyle = { width:'100%', padding:'10px', borderRadius:'10px', border:'1px solid #ccc', fontSize:'1rem' }

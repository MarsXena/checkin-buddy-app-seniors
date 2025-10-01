import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import * as htmlToImage from 'html-to-image'

export default function Home() {
  const [clock, setClock] = useState('')
  const [checkedIn, setCheckedIn] = useState(false)
  const [streak, setStreak] = useState(0)
  const [status, setStatus] = useState({ text: '⚠️ No check-in yet today', cls: 'status alert' })
  const [lastCheck, setLastCheck] = useState('Last check-in: None')
  const [largeText, setLargeText] = useState(false)
  const [btnClass, setBtnClass] = useState('checkBtn')
  const [btnLabel, setBtnLabel] = useState('Check In')

  // load persisted values (streak)
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem('cib_streak')) || { streak: 0, lastDate: null }
      if (s.streak) setStreak(s.streak)
    } catch {}
  }, [])

  // clock
  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleString())
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  // font size toggle
  useEffect(() => {
    document.documentElement.style.fontSize = largeText ? '1.5rem' : '1rem'
  }, [largeText])

  // schedule reset at midnight
  const scheduleReset = useCallback(() => {
    const now = new Date()
    const midnight = new Date()
    midnight.setHours(24, 0, 0, 0)
    const ms = midnight - now
    setTimeout(() => {
      resetDaily()
      scheduleReset()
    }, ms)
  }, [])

  useEffect(() => { scheduleReset() }, [scheduleReset])

  function saveStreak(next) {
    localStorage.setItem('cib_streak', JSON.stringify({ streak: next, lastDate: new Date().toISOString() }))
  }

  function settings() {
    try {
      return JSON.parse(localStorage.getItem('cib_settings')) || {}
    } catch { return {} }
  }

  async function sendNotification(when) {
    const s = settings()
    const payload = {
      seniorName: s.seniorName || 'Senior',
      caregiverName: s.caregiverName || 'Caregiver',
      phone: s.caregiverPhone || '',
      email: s.caregiverEmail || '',
      notifyVia: s.notifyVia || 'sms',
      message: `${s.seniorName || 'Senior'} checked in at ${when.toLocaleString()}`
    }
    const res = await fetch('/api/checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!res.ok) throw new Error('Network error')
    return res.json()
  }

  async function onCheckIn() {
    if (checkedIn) return
    const now = new Date()
    setBtnClass('checkBtn checkBtnPressed')
    setBtnLabel('★')
    setTimeout(() => {
      setBtnClass('checkBtn checkBtnChecked')
      setBtnLabel('Checked ✓')
    }, 600)

    setStatus({ text: `✅ Checked in at ${now.toLocaleTimeString()}`, cls: 'status ok' })
    setLastCheck(`Last check-in: ${now.toLocaleString()}`)
    const next = streak + 1
    setStreak(next); saveStreak(next)
    setCheckedIn(true)

    try {
      await sendNotification(now)
    } catch (e) {
      console.error(e)
      setStatus({ text: '⚠️ Tried to send, will retry when online', cls: 'status alert' })
    }
  }

  function resetDaily() {
    setStatus({ text: '⚠️ No check-in yet today', cls: 'status alert' })
    setLastCheck('Last check-in: None')
    setBtnClass('checkBtn')
    setBtnLabel('Check In')
    setCheckedIn(false)
  }

  function onReset() {
    // Allow multiple check-ins per day without altering streak.
    setStatus({ text: '⚠️ No check-in yet today', cls: 'status alert' })
    setBtnClass('checkBtn')
    setBtnLabel('Check In')
    setCheckedIn(false)
  }

  async function sendTest() {
    try {
      const s = settings()
      const when = new Date()
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seniorName: s.seniorName || 'Senior',
          caregiverName: s.caregiverName || 'Caregiver',
          phone: s.caregiverPhone || '',
          email: s.caregiverEmail || '',
          notifyVia: s.notifyVia || 'sms',
          message: `[TEST] ${(s.seniorName || 'Senior')} test at ${when.toLocaleString()}`
        })
      })
      if (!res.ok) throw new Error('Network error')
      alert('Test sent (if credentials configured).')
    } catch (e) {
      alert('Could not send test. Check credentials.')
    }
  }

  async function onContactSubmit(e) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const payload = {
      name: form.get('name'),
      email: form.get('email'),
      message: form.get('message')
    }
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error('Network error')
      alert('Thanks! We will get back to you.')
      e.currentTarget.reset()
    } catch { alert('Could not send. Please try again later.') }
  }

  async function makeScreenshot() {
    try {
      const node = document.querySelector('#app')
      const dataUrl = await htmlToImage.toPng(node, { pixelRatio: 2 })
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = 'checkin-buddy-screenshot.png'
      a.click()
    } catch (e) {
      alert('Screenshot failed. Try again on a desktop browser.')
    }
  }

  return (
    <>
      <header style={{position:'fixed',top:0,left:0,right:0,background:'#ffffffcc',backdropFilter:'saturate(180%) blur(6px)',borderBottom:'1px solid #eaeaea',zIndex:20}}>
        <div className="container" style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:16}}>
          <div>
            <h1 className="h1" style={{margin:'8px 0'}}>Check-In Buddy</h1>
            <p style={{margin:'0 0 8px 0',color:'#555'}}>One-tap daily check-in for seniors. Instant peace of mind for caregivers.</p>
            <ul style={{margin:'0 0 10px 18px', padding:0, color:'#333'}}>
              <li>Tap once to say “I’m okay.”</li>
              <li>Automatic SMS/email to your caregiver.</li>
              <li>No accounts needed for MVP. Privacy-first.</li>
            </ul>
          </div>
          <a className="btn" href="#app" style={{whiteSpace:'nowrap'}}>Try it now</a>
        </div>
      </header>

      <main id="app" style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh', paddingTop: '120px'}}>
        <div className="topbar">
          <Link className="iconBtn" href="/settings" aria-label="Settings">⚙️</Link>
        </div>

        <div className="container" aria-live="polite">
          <h1 className="h1">Check-In Buddy</h1>
          <div className="clock">{clock}</div>

          <button
            className={btnClass}
            onClick={onCheckIn}
            aria-pressed={checkedIn ? 'true' : 'false'}
            disabled={checkedIn}
            aria-label="Check In"
          >
            {btnLabel}
          </button>

          <div className={status.cls} style={{minHeight: '2.2rem'}}>{status.text}</div>
          <div className="subtle">{lastCheck}</div>
          <div className="streak">Streak: {streak} day{streak>1?'s':''}</div>

          <div className="controls">
            {checkedIn && <button className="btn" onClick={onReset} aria-label="Reset">Reset</button>}
            <button className="btn" onClick={() => setLargeText(v => !v)} aria-label="Toggle large text">Toggle Large Text</button>
            <button className="btn" onClick={sendTest} aria-label="Send test">Send Test</button>
          </div>

          <div style={{marginTop:16}}>
            <Link className="link" href="/settings">Open Settings</Link>
          </div>
        </div>
      </main>

      <footer style={{borderTop:'1px solid #eaeaea', background:'#fff', padding:'16px 0'}}>
        <div className="container" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
          <div>
            <p style={{margin:'0 0 6px 0'}}><strong>Privacy:</strong> No location tracking. Only your check-in time is shared.</p>
            <p style={{margin:'0 0 10px 0'}}><Link className="link" href="/terms">Terms</Link> · <Link className="link" href="/privacy">Privacy</Link></p>
            <p style={{margin:0}}>Made by <a className="link" href="https://integratedeight.com" target="_blank" rel="noreferrer">Integrated Eight</a></p>
          </div>
          <div>
            <form onSubmit={onContactSubmit}>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
                <input name="name" placeholder="Your name" style={{padding:'10px', borderRadius:10, border:'1px solid #ccc'}}/>
                <input name="email" type="email" placeholder="Your email" style={{padding:'10px', borderRadius:10, border:'1px solid #ccc'}}/>
              </div>
              <textarea name="message" placeholder="How can we help?" rows={3} style={{marginTop:8, width:'100%', padding:'10px', borderRadius:10, border:'1px solid #ccc'}}/>
              <div style={{display:'flex', gap:8, justifyContent:'flex-end', marginTop:8}}>
                <button className="btn" type="button" onClick={makeScreenshot}>Generate Screenshot</button>
                <button className="btn" type="submit">Send</button>
              </div>
            </form>
          </div>
        </div>
      </footer>
    </>
  )
}

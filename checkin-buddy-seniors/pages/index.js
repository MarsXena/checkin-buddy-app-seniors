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

  // load persisted values (optional: streak)
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
  
  async function onContactSubmit(e) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const payload = {
      name: form.get('name'),
      email: form.get('email'),
      message: form.get('message')
    }
    try {
      const res = await fetch('/api/contact', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
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

  function brand() {
    try { return JSON.parse(localStorage.getItem('cib_brand')) || {} } catch { return {} }
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
) => clearInterval(id)
  }, [])

  // font size toggle
  useEffect(() => {
    document.documentElement.style.fontSize = largeText ? '1.5rem' : '1rem'
  }, [largeText])

  // schedule reset at midnight
  const scheduleReset = useCallback(() => {
    const now = new Date()
    const midnight = new Date()
    midnight.setHours(24,0,0,0)
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
    const res = await fetch('/api/checkin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
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
    if (!checkedIn) return
    const next = Math.max(0, streak - 1)
    setStreak(next); saveStreak(next)
    resetDaily()
  }

  
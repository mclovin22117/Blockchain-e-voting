import React, { useState } from 'react'
import Web3 from 'web3'
import { useNavigate } from 'react-router-dom'
import config from '../config'

// Minimal, easy-to-follow 3-step registration UI.
// Attempts backend endpoints; if missing, falls back to a simple demo OTP.

function Register() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [vid, setVid] = useState('')
  const [otp, setOtp] = useState('')
  const [account, setAccount] = useState(null)
  const [note, setNote] = useState('')

  async function sendOtp() {
    setNote('Sending OTP...')
    try {
      const res = await fetch(`${config.backendUrl}/register/initOtp`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, mobile, vid })
      })
      if (!res.ok) throw new Error('initOtp not available; using demo OTP 123456')
      setNote('OTP sent to your mobile')
    } catch (e) {
      setNote(e.message + ' — for demo, use OTP 123456')
    }
    setStep(2)
  }

  async function verifyOtp() {
    setNote('Verifying OTP...')
    try {
      const res = await fetch(`${config.backendUrl}/register/verifyOtp`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vid, otp })
      })
      if (!res.ok) {
        if (otp !== '123456') throw new Error('Invalid OTP (demo expects 123456)')
      }
      setNote('Verified! Now link your wallet.')
      setStep(3)
    } catch (e) {
      setNote('OTP verification failed: ' + (e.message || e))
    }
  }

  async function connectWallet() {
    if (!window.ethereum) return setNote('MetaMask not detected')
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    setAccount(accounts[0])
  }

  async function linkWallet() {
    if (!account) return setNote('Connect your wallet first')
    setNote('Linking wallet to registration...')
    try {
      const res = await fetch(`${config.backendUrl}/register/linkWallet`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vid, address: account })
      })
      if (!res.ok) throw new Error('linkWallet endpoint not available; storing locally for demo')
      await res.json()
      setNote('Linked! You can now login with your wallet to vote.')
    } catch (e) {
      // Demo fallback: store a minimal mapping locally so the login page can find it
      try {
        const map = JSON.parse(localStorage.getItem('demo_vid_map') || '{}')
        map[account.toLowerCase()] = { vid, name, mobile }
        localStorage.setItem('demo_vid_map', JSON.stringify(map))
        setNote('Linked locally (demo). Ask admin to register your wallet on-chain.')
      } catch {}
    }
    setStep(4)
  }

  return (
    <div className="layout">
      <div>
        <div className="card" style={{maxWidth:520}}>
          <h3 style={{marginTop:0}}>Register</h3>
          {step === 1 && (
            <div>
              <div className="form-row"><label className="muted">Name</label><input value={name} onChange={e=>setName(e.target.value)} /></div>
              <div className="form-row"><label className="muted">Mobile No.</label><input value={mobile} onChange={e=>setMobile(e.target.value)} /></div>
              <div className="form-row"><label className="muted">Voter ID (VID)</label><input value={vid} onChange={e=>setVid(e.target.value)} /></div>
              <div style={{display:'flex',gap:8,marginTop:8}}>
                <button className="vote-btn" onClick={sendOtp}>Send OTP</button>
                <button className="vote-btn" style={{background:'#6b7280'}} onClick={()=>navigate('/')}>Cancel</button>
              </div>
            </div>
          )}
          {step === 2 && (
            <div>
              <div className="muted" style={{fontSize:13,marginBottom:8}}>OTP sent to your mobile. Enter it below.</div>
              <div className="form-row"><label className="muted">OTP</label><input value={otp} onChange={e=>setOtp(e.target.value)} /></div>
              <div style={{display:'flex',gap:8,marginTop:8}}>
                <button className="vote-btn" onClick={verifyOtp}>Verify OTP</button>
                <button className="vote-btn" style={{background:'#6b7280'}} onClick={()=>setStep(1)}>Back</button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div>
              <div className="muted" style={{fontSize:13,marginBottom:8}}>Registration verified. Link your MetaMask wallet; this wallet will be used to vote.</div>
              <div style={{display:'flex',gap:8,alignItems:'center'}}>
                <button className="vote-btn" onClick={connectWallet}>{account ? 'Connected' : 'Connect Wallet'}</button>
                <div className="mono text-clip" style={{flex:1}} title={account || ''}>{account || ''}</div>
              </div>
              <div style={{display:'flex',gap:8,marginTop:8}}>
                <button className="vote-btn" onClick={linkWallet} disabled={!account}>Link Wallet</button>
                <button className="vote-btn" style={{background:'#6b7280'}} onClick={()=>setStep(2)}>Back</button>
              </div>
            </div>
          )}
          {step === 4 && (
            <div>
              <div className="muted" style={{fontSize:13,marginBottom:8}}>Registration successful. You may now login with your wallet to vote.</div>
              <button className="vote-btn" onClick={()=>navigate('/')}>Go to Login</button>
            </div>
          )}
          {note && <div className="muted" style={{marginTop:10,fontSize:13}}>{note}</div>}
        </div>
      </div>
    </div>
  )
}

export default Register

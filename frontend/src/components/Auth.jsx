import React, { useState, useEffect } from 'react'

function Auth({ onLogin }) {
  const [account, setAccount] = useState(null)
  const [name, setName] = useState('')
  const [manualAddress, setManualAddress] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' }).then(accounts => {
        if (accounts && accounts.length) setAccount(accounts[0])
      })
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0] || null)
      })
    }
  }, [])

  async function connect() {
    if (!window.ethereum) return setStatus('MetaMask not detected — enter wallet address manually below')
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    setAccount(accounts[0])
  }

  async function register(e) {
    e.preventDefault()
    const addr = (account || manualAddress || '').trim()
    if (!addr) return setStatus('Provide a wallet address or connect MetaMask')
    setStatus('Registering...')
    try {
      const res = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: addr, name })
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('Registered: ' + data.cid)
        onLogin({ address: addr, cid: data.cid })
      } else {
        setStatus('Error: ' + (data.error || 'unknown'))
      }
    } catch (err) {
      console.error('register error', err)
      setStatus('Network error: ' + (err.message || String(err)))
    }
  }

  async function login(e) {
    e && e.preventDefault()
    const addr = (account || manualAddress || '').trim()
    if (!addr) return setStatus('Provide a wallet address or connect MetaMask')
    setStatus('Checking...')
    try {
      const res = await fetch(`http://localhost:3001/voter/${addr}`)
      if (res.ok) {
        const data = await res.json()
        setStatus('Found: ' + data.cid)
        onLogin({ address: addr, cid: data.cid })
      } else {
        setStatus('Not registered')
      }
    } catch (err) {
      console.error('login error', err)
      setStatus('Network error: ' + (err.message || String(err)))
    }
  }

  return (
    <div className="card auth-card">
      <h3 style={{margin:0}}>Voter Portal</h3>
      <div className="muted" style={{fontSize:13,marginTop:6}}>Connect your wallet and register to participate</div>

      <div style={{marginTop:12}}>
        <div className="muted">Wallet</div>
        <div style={{marginTop:6,display:'flex',gap:8,alignItems:'center'}}>
          <div style={{flex:1}}>{account ?? 'Not connected'}</div>
          {!account ? (
            <div style={{display:'flex',gap:8}}>
              <button className="vote-btn" onClick={connect}>Connect</button>
              <button className="vote-btn" style={{background:'#f3f4f6',color:'#0b1220'}} onClick={() => window.open('https://metamask.io/download/', '_blank')}>Install MetaMask</button>
            </div>
          ) : (
            <div style={{color:'var(--muted)',fontSize:13}}>{account}</div>
          )}
        </div>

        {!window.ethereum && (
          <div style={{marginTop:10}}>
            <div className="muted">Or enter wallet address manually</div>
            <input type="text" placeholder="0x..." value={manualAddress} onChange={e => setManualAddress(e.target.value)} style={{marginTop:6,width:'100%'}} />
          </div>
        )}
      </div>

      <form onSubmit={register} style={{marginTop:12}}>
        <div className="form-row">
          <label className="muted">Display name (optional)</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div style={{display:'flex',gap:8,marginTop:12}}>
          <button className="vote-btn" type="submit">Register</button>
          <button className="vote-btn" type="button" onClick={login} style={{background:'#06b6d4'}}>Login</button>
        </div>
      </form>

      <div style={{marginTop:12,fontSize:13}} className="muted">{status}</div>
    </div>
  )
}

export default Auth

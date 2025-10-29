import React, { useState, useEffect } from 'react'
import Web3 from 'web3'
import { useNavigate } from 'react-router-dom'

function Auth({ onLogin }) {
  const navigate = useNavigate()
  const [account, setAccount] = useState(null)
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
    navigate('/register')
  }

  async function login(e) {
    e && e.preventDefault()
    const addr = (account || manualAddress || '').trim()
    if (!addr) return setStatus('Provide a wallet address or connect MetaMask')
    setStatus('Checking...')
    let done = false
    // 1) Try backend first
    try {
      const res = await fetch(`http://localhost:3001/voter/${addr}`)
      if (res.ok) {
        const data = await res.json()
        setStatus('Found: ' + data.cid)
        onLogin({ address: addr, cid: data.cid })
        done = true
      }
    } catch (_) {}

    // 2) If backend misses, try on-chain allow-list
    if (!done) {
      try {
        const resC = await fetch('http://localhost:3001/contract')
        if (resC.ok && (window.ethereum || Web3.givenProvider)) {
          const info = await resC.json()
          const web3 = new Web3(window.ethereum || Web3.givenProvider)
          const election = new web3.eth.Contract(info.abi, info.address)
          // Owner shortcut: allow admin to login even if not registered
          try {
            const o = await election.methods.owner().call()
            if (o && o.toLowerCase() === addr.toLowerCase()) {
              setStatus('Admin (owner) account detected')
              onLogin({ address: addr, cid: null })
              done = true
            }
          } catch (_) {}
          if (!done) {
            const reg = await election.methods.registered(addr).call()
            if (reg) {
              setStatus('Registered on-chain')
              onLogin({ address: addr, cid: null })
              done = true
            }
          }
        }
      } catch (_) {}
    }

    // 3) Demo fallback: local mapping created by Register page
    if (!done) {
      try {
        const map = JSON.parse(localStorage.getItem('demo_vid_map') || '{}')
        if (map[addr.toLowerCase()]) {
          setStatus('Found (local demo)')
          onLogin({ address: addr, cid: 'local-demo' })
          done = true
        }
      } catch (_) {}
    }

    if (!done) setStatus('Not registered')
  }

  return (
    <div className="card auth-card">
      <h3 style={{margin:0}}>Voter Portal</h3>
      <div className="muted" style={{fontSize:13,marginTop:6}}>Login with your wallet to vote, or go to Register to verify your identity.</div>

      <div style={{marginTop:12}}>
        <div className="muted">Wallet</div>
        <div style={{marginTop:6,display:'flex',gap:8,alignItems:'center'}}>
          <div className="muted-small" style={{flex:1}}>
            {account ? 'Wallet connected' : 'Not connected'}
          </div>
          {!account && (
            <div style={{display:'flex',gap:8}}>
              <button className="vote-btn" onClick={connect}>Connect</button>
              <button className="vote-btn" style={{background:'#f3f4f6',color:'#0b1220'}} onClick={() => window.open('https://metamask.io/download/', '_blank')}>Install MetaMask</button>
            </div>
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
        <div style={{display:'flex',gap:8,marginTop:0}}>
          <button className="vote-btn" type="submit">Go to Register</button>
          <button className="vote-btn" type="button" onClick={login} style={{background:'#06b6d4'}}>Login to Vote</button>
        </div>
      </form>

  <div style={{marginTop:12,fontSize:13}} className="muted text-wrap mono">{status}</div>
    </div>
  )
}

export default Auth

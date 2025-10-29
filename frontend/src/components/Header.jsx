import React from 'react'
import { useNavigate } from 'react-router-dom'

function Header({ account, onConnect, user, onLogout }) {
  const navigate = useNavigate()
  return (
    <header className="card" style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}> 
      <div className="brand">
        <div className="logo">EV</div>
        <div>
          <div className="title">E‑Voting Prototype</div>
          <div className="subtitle">Ethereum · IPFS · zk‑ready</div>
        </div>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        {user ? (
          // Logged in: show masked account + logout
          <>
            <div className="user-info" style={{fontSize:13}}>
              <span className="muted">Account</span>
              <div style={{fontWeight:600}}>{account ? `${account.slice(0,6)}…${account.slice(-4)}` : '—'}</div>
            </div>
            <button
              className="vote-btn"
              style={{background:'#ef4444'}}
              onClick={() => { onLogout && onLogout(); navigate('/'); }}
            >Logout</button>
          </>
        ) : (
          // Not logged in: hide address; allow connect/login actions
          <>
            <button className="vote-btn" onClick={onConnect}>{account ? 'Switch/Connect Wallet' : 'Connect Wallet'}</button>
            <button className="vote-btn" onClick={() => navigate('/')}>Login</button>
          </>
        )}
      </div>
    </header>
  )
}

export default Header

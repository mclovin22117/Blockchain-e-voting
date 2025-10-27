import React from 'react'

function Header({ account, onConnect }) {
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
        {account ? (
          <div className="user-info" style={{fontSize:13}}>
            <span className="muted">Account</span>
            <div style={{fontWeight:600}}>{account.slice(0,6)}…{account.slice(-4)}</div>
          </div>
        ) : (
          <button className="vote-btn" onClick={onConnect}>Connect Wallet</button>
        )}
      </div>
    </header>
  )
}

export default Header

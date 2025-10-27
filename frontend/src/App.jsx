import React, { useEffect, useState } from 'react'
import Web3 from 'web3'
import Auth from './components/Auth'
import Header from './components/Header'
import CandidateCard from './components/CandidateCard'
import Toast from './components/Toast'

function App() {
  const [account, setAccount] = useState(null)
  const [candidates, setCandidates] = useState([])
  const [user, setUser] = useState(null)
  const [toast, setToast] = useState({ message: '', type: 'info' })

  useEffect(() => {
    async function init() {
      if (window.ethereum) {
        try {
          const web3 = new Web3(window.ethereum)
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
          setAccount(accounts[0])
        } catch (err) {
          console.error('user denied');
        }
      }
      // load candidates from backend
      try {
        const res = await fetch('http://localhost:3001/candidates')
        const data = await res.json()
        setCandidates(data)
      } catch (e) {
        console.warn('could not fetch candidates', e)
      }
    }
    init()
  }, [])

  const handleConnect = async () => {
    if (!window.ethereum) {
      setToast({ message: 'MetaMask not detected. Please install it to connect.', type: 'error' })
      return
    }
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      setAccount(accounts[0])
      setToast({ message: 'Wallet connected', type: 'success' })
    } catch (e) {
      setToast({ message: 'Connection rejected', type: 'error' })
    }
  }

  const handleVote = async (candidateId) => {
    // Placeholder: just notify. Full flow (IPFS + on-chain tx) can be added next.
    setToast({ message: `Vote clicked for candidate #${candidateId}. Wiring on-chain flow next.`, type: 'info' })
  }

  return (
    <div className="app-shell">
      <Header account={account} onConnect={handleConnect} />

      <div className="hero">
        <div>
          <h1>Secure, transparent e‑voting</h1>
          <p>Sign in with your wallet, register, and cast a verifiable vote. Prototype uses Ethereum + IPFS.</p>
        </div>
      </div>

      <div className="layout">
        <div>
          <Auth onLogin={(u) => setUser(u)} />
          <div className="card" style={{marginTop:16}}>
            <div className="muted" style={{fontSize:13,marginBottom:6}}>Session</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr',gap:6}}>
              <div><b>Account:</b> {account ?? 'not connected'}</div>
              <div><b>Status:</b> {user ? 'Registered' : 'Guest'}</div>
              {user && <div><b>CID:</b> {user.cid}</div>}
            </div>
          </div>
        </div>

        <div>
          <div className="card" style={{marginBottom:16}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <h2 style={{margin:0}}>Candidates</h2>
              <div className="muted" style={{fontSize:13}}>{candidates.length} total</div>
            </div>
          </div>
          <div className="candidate-grid">
            {candidates.map(c => (
              <CandidateCard key={c.id} candidate={c} onVote={handleVote} />
            ))}
          </div>
        </div>
      </div>

      <div className="footer">© {new Date().getFullYear()} E‑Voting Prototype — for research & demo use</div>

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />
    </div>
  )
}

export default App

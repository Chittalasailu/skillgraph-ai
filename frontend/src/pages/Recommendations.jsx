import { useEffect, useState } from 'react'
import api from '../services/api'
import Spinner from '../components/Spinner'

function Badge({ children, color }) {
  return (
    <span style={{ background: color, padding: '4px 8px', borderRadius: 999, color: '#071023', fontSize: 12, marginRight: 6, display: 'inline-block' }}>
      {children}
    </span>
  )
}

export default function Recommendations({ selectedPerson }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [recs, setRecs] = useState([])
  const personName = selectedPerson

  useEffect(() => {
    let active = true
    async function load() {
      if (!personName) {
        if (!active) setLoading(false)
        return
      }
      try {
        setLoading(true)
        const res = await api.get(`/api/recommendations/${encodeURIComponent(personName)}`)
        if (!active) return
        setRecs(res.data.recommendations || [])
        setError(null)
      } catch (err) {
        if (!active) return
        setError(err.response?.data?.error || err.message || 'Failed to load recommendations')
      } finally {
        if (!active) return
        setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [personName])

  if (!personName && !loading) return <div style={{padding:24}}><div style={{background:'rgba(255,255,255,0.05)',padding:24,borderRadius:14}}><h2 style={{marginTop:0,color:'#e6edf3'}}>Select a person first</h2><p style={{color:'#94a3b8'}}>Use the Person Selector to load personalized recommendations.</p></div></div>
  if (loading) return <div style={{padding:24}}><Spinner /></div>
  if (error) return <div style={{padding:24,color:'#fecaca'}}>Error: {error}</div>
  if (!recs.length) return <div style={{padding:24}}><div style={{background:'rgba(255,255,255,0.05)',padding:24,borderRadius:14}}><h2 style={{marginTop:0,color:'#e6edf3'}}>No recommendations yet</h2><p style={{color:'#94a3b8'}}>No career recommendations were found for {personName}. Try a different person or check back later.</p></div></div>

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ color: '#e6edf3', marginBottom: 12 }}>Career Recommendations for {personName}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {recs.map((r) => (
          <div key={r.role} style={{ background: 'linear-gradient(180deg, rgba(7,12,23,0.6), rgba(3,7,18,0.6))', padding: 16, borderRadius: 12, border: '1px solid rgba(148,163,184,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div>
                <div style={{ color: '#e6edf3', fontWeight: 700, fontSize: 16 }}>{r.role}</div>
                <div style={{ color: '#94a3b8', fontSize: 13 }}>{r.matchedSkills.length}/{r.matchedSkills.length + r.missingSkills.length} matched</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#e6edf3', fontWeight: 700 }}>{r.matchPercentage}%</div>
              </div>
            </div>

            <div style={{ height: 8, background: '#0b1220', borderRadius: 8, overflow: 'hidden', marginBottom: 12 }}>
              <div style={{ width: `${r.matchPercentage}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #34d399)', borderRadius: 8 }} />
            </div>

            <div style={{ marginBottom: 8 }}>
              <strong style={{ color: '#cbd5e1' }}>Matched:</strong>
              <div style={{ marginTop: 6 }}>
                {r.matchedSkills.length ? r.matchedSkills.map(s => <Badge key={s} color="#86efac">{s}</Badge>) : <div style={{ color:'#94a3b8' }}>None</div>}
              </div>
            </div>

            <div style={{ marginBottom: 8 }}>
              <strong style={{ color: '#cbd5e1' }}>Missing:</strong>
              <div style={{ marginTop: 6 }}>
                {r.missingSkills.length ? r.missingSkills.map(s => <Badge key={s} color="#fecaca">{s}</Badge>) : <div style={{ color:'#94a3b8' }}>None</div>}
              </div>
            </div>

            <div>
              <strong style={{ color: '#cbd5e1' }}>Recommended:</strong>
              <div style={{ marginTop: 6 }}>
                {r.recommendedSkills.length ? r.recommendedSkills.map(s => <Badge key={s} color="#93c5fd">{s}</Badge>) : <div style={{ color:'#94a3b8' }}>No recommendation</div>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

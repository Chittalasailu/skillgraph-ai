import { useEffect, useState } from 'react'
import api from '../services/api'
import Spinner from '../components/Spinner'

function Badge({ children, color }) {
  return (
    <span style={{ background: color, color: '#071023', padding: '4px 10px', borderRadius: 999, fontSize: 12, marginRight: 6, marginBottom: 6, display: 'inline-flex', alignItems: 'center' }}>
      {children}
    </span>
  )
}

export default function CareerAssistant({ selectedPerson }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [advice, setAdvice] = useState(null)
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
        const res = await api.get(`/api/career-advice/${encodeURIComponent(personName)}`)
        if (!active) return
        setAdvice(res.data)
        setError(null)
      } catch (err) {
        if (!active) return
        setError(err.response?.data?.error || err.message || 'Failed to load career advice')
      } finally {
        if (!active) return
        setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [personName])

  if (!personName && !loading) return <div className="main"><div className="card"><h3>Select a person first</h3><p>Use the Person Selector to load career advice.</p></div></div>

  const currentSkills = advice?.currentSkills || []
  const recommendedLearningPath = advice?.recommendedLearningPath || []
  const missingSkills = advice?.missingSkills || []
  const technologiesToLearn = advice?.technologiesToLearn || []
  const hiringCompanies = advice?.hiringCompanies || []
  const targetRoles = advice?.targetRoles || []

  if (loading) return <div className="main"><Spinner /></div>
  if (error) return <div className="main"><div className="card"><h3>Error</h3><p>{error}</p></div></div>

  return (
    <div className="main page">
      <div className="header"><h1>AI Career Assistant</h1></div>

      <div className="cards" style={{ marginBottom: 20 }}>
        <div className="card">
          <div className="label">Current Skills</div>
          <div className="value">{currentSkills.length}</div>
          <div style={{ marginTop: 8 }}>
            {currentSkills.length ? currentSkills.map((skill) => <Badge key={skill} color="#93c5fd">{skill}</Badge>) : <span style={{ color: '#94a3b8' }}>No skills available</span>}
          </div>
        </div>
        <div className="card">
          <div className="label">Best Career Match</div>
          <div className="value">{advice?.bestRole || 'None'}</div>
          <div style={{ marginTop: 8, color: '#94a3b8' }}>{advice?.matchPercentage ?? 0}% match</div>
        </div>
        <div className="card">
          <div className="label">Estimated Time</div>
          <div className="value">{advice?.estimatedLearningWeeks ?? 0} weeks</div>
          <div style={{ marginTop: 8, color: '#94a3b8' }}>Based on missing skills</div>
        </div>
      </div>

      <div className="section">
        <div className="title"><h3>Learning Path</h3></div>
        <div className="card" style={{ padding: 18 }}>
          {recommendedLearningPath.length ? recommendedLearningPath.map((skill) => <Badge key={skill} color="#6ee7b7">{skill}</Badge>) : <div style={{ color: '#94a3b8' }}>No recommended learning needed.</div>}
        </div>
      </div>

      <div className="section" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 18 }}>
        <div className="card" style={{ padding: 18 }}>
          <h3 style={{ marginTop: 0 }}>Missing Skills</h3>
          {missingSkills.length ? missingSkills.map((skill) => <Badge key={skill} color="#fecaca">{skill}</Badge>) : <div style={{ color: '#94a3b8' }}>Already fully matched.</div>}
        </div>
        <div className="card" style={{ padding: 18 }}>
          <h3 style={{ marginTop: 0 }}>Technologies to Learn</h3>
          {technologiesToLearn.length ? technologiesToLearn.map((tech) => <Badge key={tech} color="#7dd3fc">{tech}</Badge>) : <div style={{ color: '#94a3b8' }}>No technology suggestions yet.</div>}
        </div>
      </div>

      <div className="section" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 18 }}>
        <div className="card" style={{ padding: 18 }}>
          <h3 style={{ marginTop: 0 }}>Hiring Companies</h3>
          {hiringCompanies.length ? hiringCompanies.map((company) => <Badge key={company} color="#c7d2fe">{company}</Badge>) : <div style={{ color: '#94a3b8' }}>No hiring companies found.</div>}
        </div>
        <div className="card" style={{ padding: 18 }}>
          <h3 style={{ marginTop: 0 }}>Target Roles</h3>
          {targetRoles.length ? (
            <div style={{ display: 'grid', gap: 10 }}>
              {targetRoles.map((role) => (
                <div key={role.role} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderRadius: 10, background: 'rgba(255,255,255,0.02)' }}>
                  <span>{role.role}</span>
                  <span style={{ color: '#a5b4fc', fontWeight: 700 }}>{role.matchPercentage}%</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: '#94a3b8' }}>No target roles available.</div>
          )}
        </div>
      </div>
    </div>
  )
}

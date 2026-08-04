import { useEffect, useState } from 'react'
import api from '../services/api'
import Spinner from './Spinner'

export default function PersonSelector({ selectedPerson, onChange }) {
  const [people, setPeople] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    async function loadPeople() {
      try {
        setLoading(true)
        const response = await api.get('/api/persons')
        if (!active) return
        const fetched = (response.data || []).map((person) => person.name).filter(Boolean)
        const sorted = [...new Set(fetched)].sort((a, b) => a.localeCompare(b))
        setPeople(sorted)
        setError(null)

        if (sorted.length && !sorted.includes(selectedPerson)) {
          const defaultPerson = sorted.includes('Sailu') ? 'Sailu' : sorted[0]
          onChange(defaultPerson)
        }
      } catch (err) {
        if (!active) return
        setError('Unable to load people')
      } finally {
        if (!active) return
        setLoading(false)
      }
    }

    loadPeople()
    return () => { active = false }
  }, [onChange])

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginTop: 12 }}>
      <div style={{ color: 'var(--muted)', fontSize: 13, minWidth: 110 }}>Select Person</div>
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Spinner />
          <span style={{ color: 'var(--muted)', fontSize: 13 }}>Loading people...</span>
        </div>
      ) : error ? (
        <div style={{ color: '#fecaca', fontSize: 13 }}>{error}</div>
      ) : (
        <select
          value={selectedPerson || ''}
          onChange={(event) => onChange(event.target.value)}
          style={{
            minWidth: 180,
            padding: '10px 12px',
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(255,255,255,0.03)',
            color: 'var(--text)',
            outline: 'none',
            fontSize: 14,
          }}
        >
          {people.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      )}
    </div>
  )
}

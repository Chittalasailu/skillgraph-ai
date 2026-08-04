import { useEffect, useState } from 'react'
import api from '../services/api'
import StatCard from '../components/StatCard'
import SkillCard from '../components/SkillCard'
import CompanyCard from '../components/CompanyCard'
import Spinner from '../components/Spinner'
import GraphView from '../components/GraphView'

export default function Dashboard({ selectedPerson }){
  const [skills, setSkills] = useState([])
  const [companies, setCompanies] = useState([])
  const [roles, setRoles] = useState([])
  const [person, setPerson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(()=>{
    let cancelled = false
    async function load(){
      if (!selectedPerson) {
        if (!cancelled) {
          setLoading(false)
          setError(null)
          setSkills([])
          setCompanies([])
          setRoles([])
          setPerson(null)
        }
        return
      }
      try{
        setLoading(true)
        const [sRes,cRes,rRes,pRes] = await Promise.all([
          api.get('/api/skills'),
          api.get('/api/companies'),
          api.get('/api/roles'),
          api.get(`/api/person/${encodeURIComponent(selectedPerson)}`)
        ])
        if(cancelled) return
        setSkills(sRes.data.skills || [])
        setCompanies(cRes.data.companies || [])
        setRoles(rRes.data.roles || [])
        setPerson(pRes.data.person ? {...pRes.data.person, skills: pRes.data.skills} : null)
        setError(null)
      }catch(err){
        if(!cancelled) setError('Failed to load dashboard data')
      }finally{if(!cancelled) setLoading(false)}
    }
    load()
    return ()=>{cancelled=true}
  },[selectedPerson])

  if (!selectedPerson && !loading) {
    return (
      <div className="main"><div className="card"><h3>Choose a person</h3><p>Select a person from the dropdown to load dashboard insights.</p></div></div>
    )
  }

  if(loading) return <div className="main"><Spinner/></div>
  if(error) return <div className="main"><div className="card"><h3>Error</h3><p>{error}</p></div></div>

  return (
    <div className="main page">
      <div className="header">
        <h1>SkillGraph AI Dashboard</h1>
      </div>

      <div className="cards">
        <StatCard label="Total Skills" value={skills.length} />
        <StatCard label="Total Companies" value={companies.length} />
        <StatCard label="Total Roles" value={roles.length} />
        <StatCard label={`${selectedPerson || 'Person'} Skills`} value={(person && person.skills) ? person.skills.length : 0} />
      </div>

      <div style={{ width: '100%', height: '650px', borderRadius: 16, background: 'rgba(15,23,36,0.95)', overflow: 'hidden', marginTop: 32, border: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ padding: '22px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 18 }}>Interactive Skill Graph</h3>
            <p style={{ margin: '6px 0 0', color: 'var(--muted)', fontSize: 13 }}>Explore the relationship network between people, skills, roles, and companies.</p>
          </div>
        </div>
        <div style={{ width: '100%', height: 'calc(100% - 72px)' }}>
          <GraphView selectedPerson={selectedPerson} />
        </div>
      </div>

      <div className="section">
        <div className="title"><h3>Recent Skills</h3><div style={{color:'var(--muted)'}}>Latest additions</div></div>
        <div className="grid">
          {skills.slice(0,8).map(s=> <SkillCard key={s.name} skill={s} />)}
        </div>
      </div>

      <div className="section">
        <div className="title"><h3>Companies</h3><div style={{color:'var(--muted)'}}>Top companies</div></div>
        <div className="grid">
          {companies.slice(0,8).map(c=> <CompanyCard key={c.name} company={c} />)}
        </div>
      </div>

      <div className="footer">Data powered by local SkillGraph AI backend</div>
    </div>
  )
}

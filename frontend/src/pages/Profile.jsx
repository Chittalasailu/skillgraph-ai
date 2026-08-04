import { useEffect, useState } from 'react'
import api from '../services/api'
import Spinner from '../components/Spinner'

export default function Profile({ selectedPerson }){
  const [person,setPerson]=useState(null)
  const [skills,setSkills]=useState([])
  const [loading,setLoading]=useState(true)
  const [error,setError]=useState(null)

  useEffect(()=>{
    let cancelled=false
    async function load(){
      if (!selectedPerson) {
        if(!cancelled) setLoading(false)
        return
      }
      try{
        setLoading(true)
        const res = await api.get(`/api/person/${encodeURIComponent(selectedPerson)}`)
        if(cancelled) return
        setPerson(res.data.person || null)
        setSkills(res.data.skills || [])
        setError(null)
      }catch(err){
        if(!cancelled) setError('Failed to load profile')
      }finally{if(!cancelled) setLoading(false)}
    }
    load();return ()=>{cancelled=true}
  },[selectedPerson])

  if (!selectedPerson && !loading) return <div className="main"><div className="card"><h3>Select a person first</h3><p>Use the Person Selector to load profile details.</p></div></div>
  if(loading) return <div className="main"><Spinner/></div>
  if(error) return <div className="main"><div className="card"><h3>Error</h3><p>{error}</p></div></div>
  if(!person) return <div className="main"><div className="card"><h3>Person not found</h3></div></div>

  return (
    <div className="main page">
      <div className="header"><h1>Profile</h1></div>
      <div className="card" style={{maxWidth:720}}>
        <h2 style={{marginTop:0}}>{person.name}</h2>
        <div style={{marginTop:8,color:'var(--muted)'}}>Total skills: {skills.length}</div>
        <div style={{marginTop:12}} className="chips">
          {skills.map(s=> <div key={s.name} className="chip">{s.name}</div>)}
        </div>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import api from '../services/api'
import SkillCard from '../components/SkillCard'
import SearchBar from '../components/SearchBar'
import Spinner from '../components/Spinner'

export default function Skills(){
  const [skills,setSkills]=useState([])
  const [q,setQ]=useState('')
  const [loading,setLoading]=useState(true)
  const [error,setError]=useState(null)

  useEffect(()=>{
    let cancelled=false
    async function load(){
      try{
        setLoading(true)
        const res = await api.get('/api/skills')
        if(cancelled) return
        setSkills(res.data.skills || [])
        setError(null)
      }catch(err){
        if(!cancelled) setError('Failed to load skills')
      }finally{if(!cancelled) setLoading(false)}
    }
    load();return ()=>{cancelled=true}
  },[])

  const filtered = skills.filter(s=> s.name.toLowerCase().includes(q.toLowerCase()))

  return (
    <div className="main page">
      <div className="header"><h1>Skills</h1></div>
      <SearchBar value={q} onChange={setQ} placeholder="Search skills..." />
      {loading ? <Spinner/> : error ? (
        <div className="card"><h3>Error</h3><p>{error}</p></div>
      ) : (
        <div className="grid" style={{marginTop:12}}>
          {filtered.map(s=> <SkillCard key={s.name} skill={s} />)}
        </div>
      )}
    </div>
  )
}

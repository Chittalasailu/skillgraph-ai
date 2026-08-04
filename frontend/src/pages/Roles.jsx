import { useEffect, useState } from 'react'
import api from '../services/api'
import RoleCard from '../components/RoleCard'
import SearchBar from '../components/SearchBar'
import Spinner from '../components/Spinner'

export default function Roles(){
  const [roles,setRoles]=useState([])
  const [q,setQ]=useState('')
  const [loading,setLoading]=useState(true)
  const [error,setError]=useState(null)

  useEffect(()=>{
    let cancelled=false
    async function load(){
      try{
        setLoading(true)
        const res = await api.get('/api/roles')
        if(cancelled) return
        setRoles(res.data.roles || [])
        setError(null)
      }catch(err){
        if(!cancelled) setError('Failed to load roles')
      }finally{if(!cancelled) setLoading(false)}
    }
    load();return ()=>{cancelled=true}
  },[])

  const filtered = roles.filter(r=> r.name.toLowerCase().includes(q.toLowerCase()))

  return (
    <div className="main page">
      <div className="header"><h1>Roles</h1></div>
      <SearchBar value={q} onChange={setQ} placeholder="Search roles..." />
      {loading ? <Spinner/> : error ? (
        <div className="card"><h3>Error</h3><p>{error}</p></div>
      ) : (
        <div className="grid" style={{marginTop:12}}>
          {filtered.map(r=> <RoleCard key={r.name} role={r} />)}
        </div>
      )}
    </div>
  )
}

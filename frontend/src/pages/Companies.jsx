import { useEffect, useState } from 'react'
import api from '../services/api'
import CompanyCard from '../components/CompanyCard'
import SearchBar from '../components/SearchBar'
import Spinner from '../components/Spinner'

export default function Companies(){
  const [companies,setCompanies]=useState([])
  const [q,setQ]=useState('')
  const [loading,setLoading]=useState(true)
  const [error,setError]=useState(null)

  useEffect(()=>{
    let cancelled=false
    async function load(){
      try{
        setLoading(true)
        const res = await api.get('/api/companies')
        if(cancelled) return
        setCompanies(res.data.companies || [])
        setError(null)
      }catch(err){
        if(!cancelled) setError('Failed to load companies')
      }finally{if(!cancelled) setLoading(false)}
    }
    load();return ()=>{cancelled=true}
  },[])

  const filtered = companies.filter(c=> c.name.toLowerCase().includes(q.toLowerCase()))

  return (
    <div className="main page">
      <div className="header"><h1>Companies</h1></div>
      <SearchBar value={q} onChange={setQ} placeholder="Search companies..." />
      {loading ? <Spinner/> : error ? (
        <div className="card"><h3>Error</h3><p>{error}</p></div>
      ) : (
        <div className="grid" style={{marginTop:12}}>
          {filtered.map(c=> <CompanyCard key={c.name} company={c} />)}
        </div>
      )}
    </div>
  )
}

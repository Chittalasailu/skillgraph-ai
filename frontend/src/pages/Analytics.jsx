import { useEffect, useState } from 'react'
import api from '../services/api'
import Spinner from '../components/Spinner'

import { Bar, Pie, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

export default function Analytics(){
  const [loading,setLoading] = useState(true)
  const [error,setError] = useState(null)
  const [overview,setOverview] = useState(null)
  const [skills,setSkills] = useState([])
  const [companies,setCompanies] = useState([])
  const [roles,setRoles] = useState([])
  const [technologies,setTechnologies] = useState([])

  useEffect(()=>{
    async function load(){
      setLoading(true)
      try{
        const [ov, sk, co, ro, te] = await Promise.all([
          api.get('/api/analytics/overview'),
          api.get('/api/analytics/skills'),
          api.get('/api/analytics/companies'),
          api.get('/api/analytics/roles'),
          api.get('/api/analytics/technologies'),
        ])
        setOverview(ov.data)
        setSkills(sk.data.skills || [])
        setCompanies(co.data.companies || [])
        setRoles(ro.data.roles || [])
        setTechnologies(te.data.technologies || [])
        setError(null)
      }catch(err){
        setError('Failed to load analytics data')
      }finally{
        setLoading(false)
      }
    }
    load()
  },[])

  if(loading) return <div className="main"><Spinner/></div>
  if(error) return <div className="main"><div className="card"><h3>Error</h3><p>{error}</p></div></div>

  // Prepare cards
  const cards = [
    {label:'Persons', value: overview?.persons ?? 0, emoji:'👤'},
    {label:'Skills', value: overview?.skills ?? 0, emoji:'🧠'},
    {label:'Roles', value: overview?.roles ?? 0, emoji:'💼'},
    {label:'Companies', value: overview?.companies ?? 0, emoji:'🏢'},
    {label:'Technologies', value: overview?.technologies ?? 0, emoji:'⚙'},
    {label:'Vulnerabilities', value: overview?.vulnerabilities ?? 0, emoji:'🛡'},
    {label:'Relationships', value: overview?.relationships ?? 0, emoji:'🔗'},
  ]

  // Skills distribution chart
  const skillLabels = skills.map(s=>s.skill)
  const skillData = skills.map(s=>s.rolesCount)
  const skillsDataset = {
    labels: skillLabels,
    datasets: [{
      label: 'Roles requiring skill',
      data: skillData,
      backgroundColor: 'rgba(34,197,94,0.8)'
    }]
  }

  // Company Technology Usage (horizontal)
  const companyLabels = companies.map(c=>c.company)
  const companyData = companies.map(c=>c.techCount)
  const companiesDataset = {
    labels: companyLabels,
    datasets:[{label:'Technologies used', data:companyData, backgroundColor:'rgba(124,58,237,0.85)'}]
  }

  // Role Skill Requirements
  const roleLabels = roles.map(r=>r.role)
  const roleData = roles.map(r=>r.requiredSkillsCount)
  const rolesDataset = {labels:roleLabels,datasets:[{label:'Required skills',data:roleData,backgroundColor:'rgba(249,115,22,0.85)'}]}

  // Technology Usage (pie)
  const techLabels = technologies.map(t=>t.technology)
  const techData = technologies.map(t=>t.usedByCount)
  const techDataset = {labels:techLabels,datasets:[{data:techData,backgroundColor:techLabels.map((_,i)=>['#7c3aed','#06b6d4','#06b6d4','#f97316','#06b6d4','#ef4444'][i%6])}]}

  // Vulnerability distribution (doughnut)
  const vulnLabels = technologies.map(t=>t.technology)
  const vulnData = technologies.map(t=>t.vulnerabilitiesCount)
  const vulnDataset = {labels:vulnLabels,datasets:[{data:vulnData,backgroundColor:vulnLabels.map((_,i)=>['#ef4444','#f97316','#06b6d4','#7c3aed','#06b6d4'][i%5])}]}

  return (
    <div className="main page">
      <div className="header"><h1>Analytics</h1></div>

      <div className="cards" style={{marginBottom:20}}>
        {cards.map(c=> (
          <div key={c.label} className="card">
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <div className="label">{c.label}</div>
                <div className="value">{c.value}</div>
              </div>
              <div style={{fontSize:28,opacity:0.9}}>{c.emoji}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="section">
        <div className="title"><h3>Skills Distribution</h3></div>
        <div className="card" style={{padding:12}}>
          <Bar data={skillsDataset} options={{responsive:true,plugins:{legend:{display:false}}}} />
        </div>
      </div>

      <div className="section" style={{marginTop:18}}>
        <div className="title"><h3>Company Technology Usage</h3></div>
        <div className="card" style={{padding:12}}>
          <Bar data={companiesDataset} options={{indexAxis:'y',responsive:true,plugins:{legend:{display:false}}}} />
        </div>
      </div>

      <div className="section" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:18}}>
        <div className="card" style={{padding:12}}>
          <h4>Role Skill Requirements</h4>
          <Bar data={rolesDataset} options={{responsive:true,plugins:{legend:{display:false}}}} />
        </div>
        <div className="card" style={{padding:12}}>
          <h4>Technology Usage</h4>
          <Pie data={techDataset} options={{responsive:true}} />
        </div>
      </div>

      <div className="section" style={{marginTop:18}}>
        <div className="card" style={{padding:12}}>
          <h4>Vulnerability Distribution</h4>
          <Doughnut data={vulnDataset} options={{responsive:true}} />
        </div>
      </div>

    </div>
  )
}

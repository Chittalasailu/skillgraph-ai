import { NavLink } from 'react-router-dom'
import { FiHome, FiHash, FiBriefcase, FiUsers, FiUser, FiStar, FiBarChart, FiActivity } from 'react-icons/fi'

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div className="brand">⚡ SkillGraph AI</div>
        <button className="toggle-btn" onClick={onToggle} aria-label="toggle sidebar">☰</button>
      </div>

      <nav className="nav">
        <NavLink to="/" end className={({isActive})=> isActive ? 'active' : ''}> 
          <FiHome /> <span>Dashboard</span>
        </NavLink>
        <NavLink to="/skills" className={({isActive})=> isActive ? 'active' : ''}>
          <FiHash /> <span>Skills</span>
        </NavLink>
        <NavLink to="/companies" className={({isActive})=> isActive ? 'active' : ''}>
          <FiBriefcase /> <span>Companies</span>
        </NavLink>
        <NavLink to="/roles" className={({isActive})=> isActive ? 'active' : ''}>
          <FiUsers /> <span>Roles</span>
        </NavLink>
        <NavLink to="/recommendations" className={({isActive})=> isActive ? 'active' : ''}>
          <FiStar /> <span>Recommendations</span>
        </NavLink>
        <NavLink to="/analytics" className={({isActive})=> isActive ? 'active' : ''}>
          <FiBarChart /> <span>Analytics</span>
        </NavLink>
        <NavLink to="/career" className={({isActive})=> isActive ? 'active' : ''}>
          <FiActivity /> <span>Career Assistant</span>
        </NavLink>
        <NavLink to="/profile" className={({isActive})=> isActive ? 'active' : ''}>
          <FiUser /> <span>Profile</span>
        </NavLink>
      </nav>

      <div style={{marginTop:20,fontSize:12,color:'var(--muted)'}}>
        © {new Date().getFullYear()} SkillGraph AI
      </div>
    </aside>
  )
}

import { useState, Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Spinner from './components/Spinner'
import PersonSelector from './components/PersonSelector'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Skills = lazy(() => import('./pages/Skills'))
const Companies = lazy(() => import('./pages/Companies'))
const Roles = lazy(() => import('./pages/Roles'))
const Recommendations = lazy(() => import('./pages/Recommendations'))
const Analytics = lazy(() => import('./pages/Analytics'))
const CareerAssistant = lazy(() => import('./pages/CareerAssistant'))
const Profile = lazy(() => import('./pages/Profile'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App(){
  const [collapsed,setCollapsed] = useState(false)
  const [selectedPerson, setSelectedPerson] = useState(null)

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="app">
        <Sidebar collapsed={collapsed} onToggle={()=>setCollapsed(c=>!c)} />
        <div style={{flex:1}}>
          <div style={{padding:'16px 28px'}}>
            <Header title="SkillGraph AI" />
            <PersonSelector selectedPerson={selectedPerson} onChange={setSelectedPerson} />
          </div>
          <Suspense fallback={<div className="main"><Spinner /></div>}>
            <Routes>
              <Route path="/" element={<Dashboard selectedPerson={selectedPerson} />} />
              <Route path="/skills" element={<Skills/>} />
              <Route path="/companies" element={<Companies/>} />
              <Route path="/roles" element={<Roles/>} />
              <Route path="/recommendations" element={<Recommendations selectedPerson={selectedPerson} />} />
              <Route path="/analytics" element={<Analytics/>} />
              <Route path="/career" element={<CareerAssistant selectedPerson={selectedPerson} />} />
              <Route path="/profile" element={<Profile selectedPerson={selectedPerson} />} />
              <Route path="*" element={<NotFound/>} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </BrowserRouter>
  )
}

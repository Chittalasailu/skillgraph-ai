
export default function CompanyCard({ company }){
  return (
    <div className="company-card">
      <div style={{fontWeight:700}}>{company.name}</div>
    </div>
  )
}

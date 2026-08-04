
export default function StatCard({ label, value, sub }){
  return (
    <div className="card">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      {sub && <div style={{marginTop:8,color:'var(--muted)'}}>{sub}</div>}
    </div>
  )
}

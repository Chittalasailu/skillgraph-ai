
export default function RoleCard({ role }){
  return (
    <div className="role-card">
      <div style={{fontWeight:700}}>{role.name}</div>
    </div>
  )
}

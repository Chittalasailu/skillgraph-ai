
export default function Header({ title }) {
  return (
    <div className="header">
      <h1>{title}</h1>
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        <div style={{color:'var(--muted)'}}>Dark theme</div>
      </div>
    </div>
  )
}

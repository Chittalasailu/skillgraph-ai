
function colorFor(name){
  // simple deterministic color from hash
  let hash=0; for(let i=0;i<name.length;i++) hash=(hash<<5)-hash+name.charCodeAt(i)
  const colors=['#7c3aed','#06b6d4','#f97316','#ef4444','#f59e0b','#10b981','#6366f1']
  return colors[Math.abs(hash)%colors.length]
}

export default function SkillCard({ skill }){
  return (
    <div className="skill-card">
      <div className="skill-name" style={{color: colorFor(skill.name)}}>{skill.name}</div>
    </div>
  )
}

// --------------------------
// Person HAS_SKILL relationships
// --------------------------
MATCH (person:Person {name: 'Sailu'})
UNWIND [
  'Java','Python','React','Node.js','Express','SQL','Neo4j','AWS','Docker','Git'
] AS sName
MATCH (skill:Skill {name: sName})
MERGE (person)-[:HAS_SKILL]->(skill);

// --------------------------
// Person TARGETS relationships
// --------------------------
MATCH (person:Person {name: 'Sailu'})
UNWIND ['Full Stack Developer', 'Backend Engineer'] AS roleName
MATCH (r:Role {name: roleName})
MERGE (person)-[:TARGETS]->(r);

// --------------------------
// Role REQUIRES -> Skill relationships
// --------------------------
WITH [
  {role: 'Backend Engineer', skills: ['Java','Spring Boot','SQL','Docker']},
  {role: 'Frontend Engineer', skills: ['HTML','CSS','JavaScript','React']},
  {role: 'Full Stack Developer', skills: ['Node.js','React','SQL','Docker']},
  {role: 'Software Engineer', skills: ['Java','DSA','REST API','Git']},
  {role: 'Senior SDE', skills: ['Java','DSA','Spring Boot','Git']},
  {role: 'Cloud Engineer', skills: ['AWS','Docker','Kubernetes','Linux']},
  {role: 'ML Engineer', skills: ['Python','TensorFlow','DSA','SQL']},
  {role: 'DevOps Engineer', skills: ['Docker','Kubernetes','Linux','AWS']},
  {role: 'Data Engineer', skills: ['SQL','Python','Kafka','PostgreSQL']},
  {role: 'AI Engineer', skills: ['Python','TensorFlow','FastAPI','Neo4j']}
] AS roleReqs
UNWIND roleReqs AS rr
MATCH (role:Role {name: rr.role})
UNWIND rr.skills AS skillName
MATCH (skill:Skill {name: skillName})
MERGE (role)-[:REQUIRES]->(skill);

// --------------------------
// Company HIRING_FOR -> Role relationships
// --------------------------
WITH [
  {company: 'Google', roles: ['ML Engineer','AI Engineer','Data Engineer']},
  {company: 'Microsoft', roles: ['Cloud Engineer','Backend Engineer','DevOps Engineer']},
  {company: 'Amazon', roles: ['Cloud Engineer','Backend Engineer','Data Engineer']},
  {company: 'Netflix', roles: ['Backend Engineer','DevOps Engineer','Software Engineer']},
  {company: 'Uber', roles: ['Data Engineer','Backend Engineer','Full Stack Developer']},
  {company: 'OpenAI', roles: ['AI Engineer','ML Engineer','Software Engineer']},
  {company: 'Oracle', roles: ['Backend Engineer','Cloud Engineer','Full Stack Developer']},
  {company: 'IBM', roles: ['Data Engineer','AI Engineer','Software Engineer']},
  {company: 'Infosys', roles: ['Full Stack Developer','Software Engineer','DevOps Engineer']},
  {company: 'TCS', roles: ['Full Stack Developer','Software Engineer','Backend Engineer']}
] AS hiring
UNWIND hiring AS h
MATCH (company:Company {name: h.company})
UNWIND h.roles AS roleName
MATCH (role:Role {name: roleName})
MERGE (company)-[:HIRING_FOR]->(role);

// --------------------------
// Company USES -> Technology relationships
// --------------------------
WITH [
  {company:'Google', techs:['TensorFlow','Kubernetes','Neo4j','GraphQL']},
  {company:'Microsoft', techs:['React','Node.js','Docker','Kubernetes']},
  {company:'Amazon', techs:['AWS','Node.js','Kafka','Nginx']},
  {company:'Netflix', techs:['Kafka','Nginx','Node.js','React']},
  {company:'Uber', techs:['PostgreSQL','Kafka','Redis','Node.js']},
  {company:'OpenAI', techs:['TensorFlow','FastAPI','Neo4j','GraphQL']},
  {company:'Oracle', techs:['Spring Boot','PostgreSQL','Nginx','Neo4j']},
  {company:'IBM', techs:['Kafka','Neo4j','PostgreSQL','Docker']},
  {company:'Infosys', techs:['Spring Boot','Node.js','React','MongoDB']},
  {company:'TCS', techs:['Spring Boot','MongoDB','Redis','Docker']}
] AS usage
UNWIND usage AS u
MATCH (company:Company {name: u.company})
UNWIND u.techs AS techName
MATCH (tech:Technology {name: techName})
MERGE (company)-[:USES]->(tech);

// --------------------------
// Technology HAS_VULNERABILITY -> Vulnerability relationships
// --------------------------
WITH [
  {tech:'React', vulns:['Outdated Version']},
  {tech:'Node.js', vulns:['Dependency Risk']},
  {tech:'Docker', vulns:['Critical CVE']},
  {tech:'Kubernetes', vulns:['Security Misconfiguration']},
  {tech:'AWS', vulns:['Authentication Issue']},
  {tech:'Redis', vulns:['Outdated Version']},
  {tech:'Neo4j', vulns:['Critical CVE']},
  {tech:'MongoDB', vulns:['Authentication Issue']},
  {tech:'Spring Boot', vulns:['Dependency Risk']},
  {tech:'Kafka', vulns:['Security Misconfiguration']},
  {tech:'FastAPI', vulns:['Outdated Version']},
  {tech:'PostgreSQL', vulns:['Critical CVE']},
  {tech:'Nginx', vulns:['Security Misconfiguration']},
  {tech:'GraphQL', vulns:['Authentication Issue']},
  {tech:'TensorFlow', vulns:['Dependency Risk']}
] AS tv
UNWIND tv AS t
MATCH (tech:Technology {name: t.tech})
UNWIND t.vulns AS vName
MATCH (v:Vulnerability {name: vName})
MERGE (tech)-[:HAS_VULNERABILITY]->(v);
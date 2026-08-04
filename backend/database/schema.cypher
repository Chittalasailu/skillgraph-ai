// SkillGraph AI - Neo4j schema and seed data
// This file creates constraints, nodes, and relationships for the knowledge graph.
// Execute in Neo4j Browser or via cypher-shell.

// --------------------------
// 1) Constraints (uniqueness)
// --------------------------
CREATE CONSTRAINT IF NOT EXISTS FOR (p:Person) REQUIRE p.name IS UNIQUE;
CREATE CONSTRAINT IF NOT EXISTS FOR (s:Skill) REQUIRE s.name IS UNIQUE;
CREATE CONSTRAINT IF NOT EXISTS FOR (c:Company) REQUIRE c.name IS UNIQUE;
CREATE CONSTRAINT IF NOT EXISTS FOR (r:Role) REQUIRE r.name IS UNIQUE;
CREATE CONSTRAINT IF NOT EXISTS FOR (t:Technology) REQUIRE t.name IS UNIQUE;
CREATE CONSTRAINT IF NOT EXISTS FOR (v:Vulnerability) REQUIRE v.name IS UNIQUE;

// --------------------------
// 2) Create Person
// --------------------------
MERGE (p:Person {name: 'Sailu'})
SET p.createdAt = timestamp();

// --------------------------
// 3) Create Skills
// --------------------------
UNWIND [
  'Java',
  'Python',
  'React',
  'Node.js',
  'Express',
  'Spring Boot',
  'SQL',
  'MongoDB',
  'Neo4j',
  'AWS',
  'Docker',
  'Git',
  'HTML',
  'CSS',
  'JavaScript',
  'REST API',
  'DSA',
  'FastAPI',
  'Linux',
  'Kubernetes',
  'TensorFlow',
  'Kafka',
  'PostgreSQL',
  'Redis',
  'GraphQL',
  'Nginx'
] AS skillName
MERGE (:Skill {name: skillName});

// --------------------------
// 4) Create Roles
// --------------------------
UNWIND [
  'Backend Engineer','Frontend Engineer','Full Stack Developer','Software Engineer','Senior SDE',
  'Cloud Engineer','ML Engineer','DevOps Engineer','Data Engineer','AI Engineer'
] AS roleName
MERGE (:Role {name: roleName});

// --------------------------
// 5) Create Companies
// --------------------------
UNWIND [
  'Google','Microsoft','Amazon','Netflix','Uber','OpenAI','Oracle','IBM','Infosys','TCS'
] AS companyName
MERGE (:Company {name: companyName});

// --------------------------
// 6) Create Technologies
// --------------------------
UNWIND [
  'React','Node.js','Docker','Kubernetes','AWS','Redis','Neo4j','MongoDB','Spring Boot','Kafka',
  'FastAPI','PostgreSQL','Nginx','GraphQL','TensorFlow'
] AS techName
MERGE (:Technology {name: techName});

// --------------------------
// 7) Create Vulnerabilities
// --------------------------
UNWIND [
  'Outdated Version','Critical CVE','Dependency Risk','Authentication Issue','Security Misconfiguration'
] AS vulnName
MERGE (:Vulnerability {name: vulnName});

// --------------------------
// 8) Person HAS_SKILL relationships (Sailu)
// --------------------------
// Sailu has a realistic subset of skills
MATCH (person:Person {name: 'Sailu'})
UNWIND [
  'Java','Python','React','Node.js','Express','SQL','Neo4j','AWS','Docker','Git'
] AS sName
MATCH (skill:Skill {name: sName})
MERGE (person)-[:HAS_SKILL]->(skill);

// --------------------------
// 9) Person TARGETS -> Role
// --------------------------
MATCH (person:Person {name: 'Sailu'})
UNWIND ['Full Stack Developer', 'Backend Engineer'] AS targetRole
MATCH (r:Role {name: targetRole})
MERGE (person)-[:TARGETS]->(r);

// --------------------------
// 10) Role REQUIRES -> Skill
// --------------------------
// Each role is mapped to a set of required skills
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
// 11) Company HIRING_FOR -> Role
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
// 12) Company USES -> Technology
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
// 13) Technology HAS_VULNERABILITY -> Vulnerability
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

// --------------------------
// 14) Optional: sample counts for verification
// --------------------------
// You can run these queries in the Browser to verify created data:
// MATCH (n:Person) RETURN count(n) AS persons;
// MATCH (n:Skill) RETURN count(n) AS skills;
// MATCH (n:Role) RETURN count(n) AS roles;
// MATCH (n:Company) RETURN count(n) AS companies;
// MATCH (n:Technology) RETURN count(n) AS technologies;
// MATCH (n:Vulnerability) RETURN count(n) AS vulnerabilities;

// --------------------------
// End of schema.cypher
// --------------------------

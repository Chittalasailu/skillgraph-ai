// CognoDB-compatible SkillGraph relationships script
// Nodes and constraints are kept similar to schema.cypher; relationships are expanded into individual MERGE statements.

CREATE CONSTRAINT IF NOT EXISTS FOR (p:Person) REQUIRE p.name IS UNIQUE;
CREATE CONSTRAINT IF NOT EXISTS FOR (s:Skill) REQUIRE s.name IS UNIQUE;
CREATE CONSTRAINT IF NOT EXISTS FOR (c:Company) REQUIRE c.name IS UNIQUE;
CREATE CONSTRAINT IF NOT EXISTS FOR (r:Role) REQUIRE r.name IS UNIQUE;
CREATE CONSTRAINT IF NOT EXISTS FOR (t:Technology) REQUIRE t.name IS UNIQUE;
CREATE CONSTRAINT IF NOT EXISTS FOR (v:Vulnerability) REQUIRE v.name IS UNIQUE;

MERGE (p:Person {name: 'Sailu'})
SET p.createdAt = timestamp();

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

UNWIND [
  'Backend Engineer','Frontend Engineer','Full Stack Developer','Software Engineer','Senior SDE',
  'Cloud Engineer','ML Engineer','DevOps Engineer','Data Engineer','AI Engineer'
] AS roleName
MERGE (:Role {name: roleName});

UNWIND [
  'Google','Microsoft','Amazon','Netflix','Uber','OpenAI','Oracle','IBM','Infosys','TCS'
] AS companyName
MERGE (:Company {name: companyName});

UNWIND [
  'React','Node.js','Docker','Kubernetes','AWS','Redis','Neo4j','MongoDB','Spring Boot','Kafka',
  'FastAPI','PostgreSQL','Nginx','GraphQL','TensorFlow'
] AS techName
MERGE (:Technology {name: techName});

UNWIND [
  'Outdated Version','Critical CVE','Dependency Risk','Authentication Issue','Security Misconfiguration'
] AS vulnName
MERGE (:Vulnerability {name: vulnName});

// --------------------------
// Person HAS_SKILL (individual MERGE statements)
// --------------------------
MATCH (person:Person {name: 'Sailu'})
MATCH (skill:Skill {name: 'Java'})
MERGE (person)-[:HAS_SKILL]->(skill);

MATCH (person:Person {name: 'Sailu'})
MATCH (skill:Skill {name: 'Python'})
MERGE (person)-[:HAS_SKILL]->(skill);

MATCH (person:Person {name: 'Sailu'})
MATCH (skill:Skill {name: 'React'})
MERGE (person)-[:HAS_SKILL]->(skill);

MATCH (person:Person {name: 'Sailu'})
MATCH (skill:Skill {name: 'Node.js'})
MERGE (person)-[:HAS_SKILL]->(skill);

MATCH (person:Person {name: 'Sailu'})
MATCH (skill:Skill {name: 'Express'})
MERGE (person)-[:HAS_SKILL]->(skill);

MATCH (person:Person {name: 'Sailu'})
MATCH (skill:Skill {name: 'SQL'})
MERGE (person)-[:HAS_SKILL]->(skill);

MATCH (person:Person {name: 'Sailu'})
MATCH (skill:Skill {name: 'Neo4j'})
MERGE (person)-[:HAS_SKILL]->(skill);

MATCH (person:Person {name: 'Sailu'})
MATCH (skill:Skill {name: 'AWS'})
MERGE (person)-[:HAS_SKILL]->(skill);

MATCH (person:Person {name: 'Sailu'})
MATCH (skill:Skill {name: 'Docker'})
MERGE (person)-[:HAS_SKILL]->(skill);

MATCH (person:Person {name: 'Sailu'})
MATCH (skill:Skill {name: 'Git'})
MERGE (person)-[:HAS_SKILL]->(skill);

// --------------------------
// Person TARGETS (individual MERGE statements)
// --------------------------
MATCH (person:Person {name: 'Sailu'})
MATCH (r:Role {name: 'Full Stack Developer'})
MERGE (person)-[:TARGETS]->(r);

MATCH (person:Person {name: 'Sailu'})
MATCH (r:Role {name: 'Backend Engineer'})
MERGE (person)-[:TARGETS]->(r);

// --------------------------
// Role REQUIRES (individual MERGE statements)
// --------------------------
MATCH (role:Role {name:'Backend Engineer'})
MATCH (skill:Skill {name:'Java'})
MERGE (role)-[:REQUIRES]->(skill);

MATCH (role:Role {name:'Backend Engineer'})
MATCH (skill:Skill {name:'Spring Boot'})
MERGE (role)-[:REQUIRES]->(skill);

MATCH (role:Role {name:'Backend Engineer'})
MATCH (skill:Skill {name:'SQL'})
MERGE (role)-[:REQUIRES]->(skill);

MATCH (role:Role {name:'Backend Engineer'})
MATCH (skill:Skill {name:'Docker'})
MERGE (role)-[:REQUIRES]->(skill);

MATCH (role:Role {name:'Frontend Engineer'})
MATCH (skill:Skill {name:'HTML'})
MERGE (role)-[:REQUIRES]->(skill);

MATCH (role:Role {name:'Frontend Engineer'})
MATCH (skill:Skill {name:'CSS'})
MERGE (role)-[:REQUIRES]->(skill);

MATCH (role:Role {name:'Frontend Engineer'})
MATCH (skill:Skill {name:'JavaScript'})
MERGE (role)-[:REQUIRES]->(skill);

MATCH (role:Role {name:'Frontend Engineer'})
MATCH (skill:Skill {name:'React'})
MERGE (role)-[:REQUIRES]->(skill);

MATCH (role:Role {name:'Full Stack Developer'})
MATCH (skill:Skill {name:'Node.js'})
MERGE (role)-[:REQUIRES]->(skill);

MATCH (role:Role {name:'Full Stack Developer'})
MATCH (skill:Skill {name:'React'})
MERGE (role)-[:REQUIRES]->(skill);

MATCH (role:Role {name:'Full Stack Developer'})
MATCH (skill:Skill {name:'SQL'})
MERGE (role)-[:REQUIRES]->(skill);

MATCH (role:Role {name:'Full Stack Developer'})
MATCH (skill:Skill {name:'Docker'})
MERGE (role)-[:REQUIRES]->(skill);

MATCH (role:Role {name:'Software Engineer'})
MATCH (skill:Skill {name:'Java'})
MERGE (role)-[:REQUIRES]->(skill);

MATCH (role:Role {name:'Software Engineer'})
MATCH (skill:Skill {name:'DSA'})
MERGE (role)-[:REQUIRES]->(skill);

MATCH (role:Role {name:'Software Engineer'})
MATCH (skill:Skill {name:'REST API'})
MERGE (role)-[:REQUIRES]->(skill);

MATCH (role:Role {name:'Software Engineer'})
MATCH (skill:Skill {name:'Git'})
MERGE (role)-[:REQUIRES]->(skill);

MATCH (role:Role {name:'Senior SDE'})
MATCH (skill:Skill {name:'Java'})
MERGE (role)-[:REQUIRES]->(skill);

MATCH (role:Role {name:'Senior SDE'})
MATCH (skill:Skill {name:'DSA'})
MERGE (role)-[:REQUIRES]->(skill);

MATCH (role:Role {name:'Senior SDE'})
MATCH (skill:Skill {name:'Spring Boot'})
MERGE (role)-[:REQUIRES]->(skill);

MATCH (role:Role {name:'Senior SDE'})
MATCH (skill:Skill {name:'Git'})
MERGE (role)-[:REQUIRES]->(skill);

MATCH (role:Role {name:'Cloud Engineer'})
MATCH (skill:Skill {name:'AWS'})
MERGE (role)-[:REQUIRES]->(skill);

MATCH (role:Role {name:'Cloud Engineer'})
MATCH (skill:Skill {name:'Docker'})
MERGE (role)-[:REQUIRES]->(skill);

MATCH (role:Role {name:'Cloud Engineer'})
MATCH (skill:Skill {name:'Kubernetes'})
MERGE (role)-[:REQUIRES]->(skill);

MATCH (role:Role {name:'Cloud Engineer'})
MATCH (skill:Skill {name:'Linux'})
MERGE (role)-[:REQUIRES]->(skill);

MATCH (role:Role {name:'ML Engineer'})
MATCH (skill:Skill {name:'Python'})
MERGE (role)-[:REQUIRES]->(skill);

MATCH (role:Role {name:'ML Engineer'})
MATCH (skill:Skill {name:'TensorFlow'})
MERGE (role)-[:REQUIRES]->(skill);

MATCH (role:Role {name:'ML Engineer'})
MATCH (skill:Skill {name:'DSA'})
MERGE (role)-[:REQUIRES]->(skill);

MATCH (role:Role {name:'ML Engineer'})
MATCH (skill:Skill {name:'SQL'})
MERGE (role)-[:REQUIRES]->(skill);

MATCH (role:Role {name:'DevOps Engineer'})
MATCH (skill:Skill {name:'Docker'})
MERGE (role)-[:REQUIRES]->(skill);

MATCH (role:Role {name:'DevOps Engineer'})
MATCH (skill:Skill {name:'Kubernetes'})
MERGE (role)-[:REQUIRES]->(skill);

MATCH (role:Role {name:'Data Engineer'})
MATCH (skill:Skill {name:'SQL'})
MERGE (role)-[:REQUIRES]->(skill);

MATCH (role:Role {name:'Data Engineer'})
MATCH (skill:Skill {name:'Python'})
MERGE (role)-[:REQUIRES]->(skill);

MATCH (role:Role {name:'Data Engineer'})
MATCH (skill:Skill {name:'Kafka'})
MERGE (role)-[:REQUIRES]->(skill);

MATCH (role:Role {name:'Data Engineer'})
MATCH (skill:Skill {name:'PostgreSQL'})
MERGE (role)-[:REQUIRES]->(skill);

MATCH (role:Role {name:'AI Engineer'})
MATCH (skill:Skill {name:'Python'})
MERGE (role)-[:REQUIRES]->(skill);

MATCH (role:Role {name:'AI Engineer'})
MATCH (skill:Skill {name:'TensorFlow'})
MERGE (role)-[:REQUIRES]->(skill);

MATCH (role:Role {name:'AI Engineer'})
MATCH (skill:Skill {name:'FastAPI'})
MERGE (role)-[:REQUIRES]->(skill);

MATCH (role:Role {name:'AI Engineer'})
MATCH (skill:Skill {name:'Neo4j'})
MERGE (role)-[:REQUIRES]->(skill);

// Companies hiring for roles

MATCH (company:Company {name:'Google'})
MATCH (role:Role {name:'ML Engineer'})
MERGE (company)-[:HIRING_FOR]->(role);

MATCH (company:Company {name:'Google'})
MATCH (role:Role {name:'AI Engineer'})
MERGE (company)-[:HIRING_FOR]->(role);

MATCH (company:Company {name:'Google'})
MATCH (role:Role {name:'Data Engineer'})
MERGE (company)-[:HIRING_FOR]->(role);

MATCH (company:Company {name:'Microsoft'})
MATCH (role:Role {name:'Cloud Engineer'})
MERGE (company)-[:HIRING_FOR]->(role);

MATCH (company:Company {name:'Microsoft'})
MATCH (role:Role {name:'Backend Engineer'})
MERGE (company)-[:HIRING_FOR]->(role);

MATCH (company:Company {name:'Microsoft'})
MATCH (role:Role {name:'DevOps Engineer'})
MERGE (company)-[:HIRING_FOR]->(role);

MATCH (company:Company {name:'Amazon'})
MATCH (role:Role {name:'Cloud Engineer'})
MERGE (company)-[:HIRING_FOR]->(role);

MATCH (company:Company {name:'Amazon'})
MATCH (role:Role {name:'Backend Engineer'})
MERGE (company)-[:HIRING_FOR]->(role);

MATCH (company:Company {name:'Amazon'})
MATCH (role:Role {name:'Data Engineer'})
MERGE (company)-[:HIRING_FOR]->(role);

MATCH (company:Company {name:'Netflix'})
MATCH (role:Role {name:'Backend Engineer'})
MERGE (company)-[:HIRING_FOR]->(role);

MATCH (company:Company {name:'Netflix'})
MATCH (role:Role {name:'DevOps Engineer'})
MERGE (company)-[:HIRING_FOR]->(role);

MATCH (company:Company {name:'Netflix'})
MATCH (role:Role {name:'Software Engineer'})
MERGE (company)-[:HIRING_FOR]->(role);

MATCH (company:Company {name:'Uber'})
MATCH (role:Role {name:'Data Engineer'})
MERGE (company)-[:HIRING_FOR]->(role);

MATCH (company:Company {name:'Uber'})
MATCH (role:Role {name:'Backend Engineer'})
MERGE (company)-[:HIRING_FOR]->(role);

MATCH (company:Company {name:'Uber'})
MATCH (role:Role {name:'Full Stack Developer'})
MERGE (company)-[:HIRING_FOR]->(role);

MATCH (company:Company {name:'OpenAI'})
MATCH (role:Role {name:'AI Engineer'})
MERGE (company)-[:HIRING_FOR]->(role);

MATCH (company:Company {name:'OpenAI'})
MATCH (role:Role {name:'ML Engineer'})
MERGE (company)-[:HIRING_FOR]->(role);

MATCH (company:Company {name:'OpenAI'})
MATCH (role:Role {name:'Software Engineer'})
MERGE (company)-[:HIRING_FOR]->(role);

MATCH (company:Company {name:'Oracle'})
MATCH (role:Role {name:'Backend Engineer'})
MERGE (company)-[:HIRING_FOR]->(role);

MATCH (company:Company {name:'Oracle'})
MATCH (role:Role {name:'Cloud Engineer'})
MERGE (company)-[:HIRING_FOR]->(role);

MATCH (company:Company {name:'Oracle'})
MATCH (role:Role {name:'Full Stack Developer'})
MERGE (company)-[:HIRING_FOR]->(role);

MATCH (company:Company {name:'IBM'})
MATCH (role:Role {name:'Data Engineer'})
MERGE (company)-[:HIRING_FOR]->(role);

MATCH (company:Company {name:'IBM'})
MATCH (role:Role {name:'AI Engineer'})
MERGE (company)-[:HIRING_FOR]->(role);

MATCH (company:Company {name:'IBM'})
MATCH (role:Role {name:'Software Engineer'})
MERGE (company)-[:HIRING_FOR]->(role);

MATCH (company:Company {name:'Infosys'})
MATCH (role:Role {name:'Full Stack Developer'})
MERGE (company)-[:HIRING_FOR]->(role);

MATCH (company:Company {name:'Infosys'})
MATCH (role:Role {name:'Software Engineer'})
MERGE (company)-[:HIRING_FOR]->(role);

MATCH (company:Company {name:'Infosys'})
MATCH (role:Role {name:'DevOps Engineer'})
MERGE (company)-[:HIRING_FOR]->(role);

MATCH (company:Company {name:'TCS'})
MATCH (role:Role {name:'Full Stack Developer'})
MERGE (company)-[:HIRING_FOR]->(role);

MATCH (company:Company {name:'TCS'})
MATCH (role:Role {name:'Software Engineer'})
MERGE (company)-[:HIRING_FOR]->(role);

MATCH (company:Company {name:'TCS'})
MATCH (role:Role {name:'Backend Engineer'})
MERGE (company)-[:HIRING_FOR]->(role);

// Companies using technologies

MATCH (company:Company {name:'Google'})
MATCH (tech:Technology {name:'TensorFlow'})
MERGE (company)-[:USES]->(tech);

MATCH (company:Company {name:'Google'})
MATCH (tech:Technology {name:'Kubernetes'})
MERGE (company)-[:USES]->(tech);

MATCH (company:Company {name:'Google'})
MATCH (tech:Technology {name:'Neo4j'})
MERGE (company)-[:USES]->(tech);

MATCH (company:Company {name:'Google'})
MATCH (tech:Technology {name:'GraphQL'})
MERGE (company)-[:USES]->(tech);

MATCH (company:Company {name:'Microsoft'})
MATCH (tech:Technology {name:'React'})
MERGE (company)-[:USES]->(tech);

MATCH (company:Company {name:'Microsoft'})
MATCH (tech:Technology {name:'Node.js'})
MERGE (company)-[:USES]->(tech);

MATCH (company:Company {name:'Microsoft'})
MATCH (tech:Technology {name:'Docker'})
MERGE (company)-[:USES]->(tech);

MATCH (company:Company {name:'Microsoft'})
MATCH (tech:Technology {name:'Kubernetes'})
MERGE (company)-[:USES]->(tech);

MATCH (company:Company {name:'Amazon'})
MATCH (tech:Technology {name:'AWS'})
MERGE (company)-[:USES]->(tech);

MATCH (company:Company {name:'Amazon'})
MATCH (tech:Technology {name:'Node.js'})
MERGE (company)-[:USES]->(tech);

MATCH (company:Company {name:'Amazon'})
MATCH (tech:Technology {name:'Kafka'})
MERGE (company)-[:USES]->(tech);

MATCH (company:Company {name:'Amazon'})
MATCH (tech:Technology {name:'Nginx'})
MERGE (company)-[:USES]->(tech);

MATCH (company:Company {name:'Netflix'})
MATCH (tech:Technology {name:'Kafka'})
MERGE (company)-[:USES]->(tech);

MATCH (company:Company {name:'Netflix'})
MATCH (tech:Technology {name:'Nginx'})
MERGE (company)-[:USES]->(tech);

MATCH (company:Company {name:'Netflix'})
MATCH (tech:Technology {name:'Node.js'})
MERGE (company)-[:USES]->(tech);

MATCH (company:Company {name:'Netflix'})
MATCH (tech:Technology {name:'React'})
MERGE (company)-[:USES]->(tech);

MATCH (company:Company {name:'Uber'})
MATCH (tech:Technology {name:'PostgreSQL'})
MERGE (company)-[:USES]->(tech);

MATCH (company:Company {name:'Uber'})
MATCH (tech:Technology {name:'Kafka'})
MERGE (company)-[:USES]->(tech);

MATCH (company:Company {name:'Uber'})
MATCH (tech:Technology {name:'Redis'})
MERGE (company)-[:USES]->(tech);

MATCH (company:Company {name:'Uber'})
MATCH (tech:Technology {name:'Node.js'})
MERGE (company)-[:USES]->(tech);

MATCH (company:Company {name:'OpenAI'})
MATCH (tech:Technology {name:'TensorFlow'})
MERGE (company)-[:USES]->(tech);

MATCH (company:Company {name:'OpenAI'})
MATCH (tech:Technology {name:'FastAPI'})
MERGE (company)-[:USES]->(tech);

MATCH (company:Company {name:'OpenAI'})
MATCH (tech:Technology {name:'Neo4j'})
MERGE (company)-[:USES]->(tech);

MATCH (company:Company {name:'OpenAI'})
MATCH (tech:Technology {name:'GraphQL'})
MERGE (company)-[:USES]->(tech);

MATCH (company:Company {name:'Oracle'})
MATCH (tech:Technology {name:'Spring Boot'})
MERGE (company)-[:USES]->(tech);

MATCH (company:Company {name:'Oracle'})
MATCH (tech:Technology {name:'PostgreSQL'})
MERGE (company)-[:USES]->(tech);

MATCH (company:Company {name:'Oracle'})
MATCH (tech:Technology {name:'Nginx'})
MERGE (company)-[:USES]->(tech);

MATCH (company:Company {name:'Oracle'})
MATCH (tech:Technology {name:'Neo4j'})
MERGE (company)-[:USES]->(tech);

MATCH (company:Company {name:'IBM'})
MATCH (tech:Technology {name:'Kafka'})
MERGE (company)-[:USES]->(tech);

MATCH (company:Company {name:'IBM'})
MATCH (tech:Technology {name:'Neo4j'})
MERGE (company)-[:USES]->(tech);

MATCH (company:Company {name:'IBM'})
MATCH (tech:Technology {name:'PostgreSQL'})
MERGE (company)-[:USES]->(tech);

MATCH (company:Company {name:'IBM'})
MATCH (tech:Technology {name:'Docker'})
MERGE (company)-[:USES]->(tech);

MATCH (company:Company {name:'Infosys'})
MATCH (tech:Technology {name:'Spring Boot'})
MERGE (company)-[:USES]->(tech);

MATCH (company:Company {name:'Infosys'})
MATCH (tech:Technology {name:'Node.js'})
MERGE (company)-[:USES]->(tech);

MATCH (company:Company {name:'Infosys'})
MATCH (tech:Technology {name:'React'})
MERGE (company)-[:USES]->(tech);

MATCH (company:Company {name:'Infosys'})
MATCH (tech:Technology {name:'MongoDB'})
MERGE (company)-[:USES]->(tech);

MATCH (company:Company {name:'TCS'})
MATCH (tech:Technology {name:'Spring Boot'})
MERGE (company)-[:USES]->(tech);

MATCH (company:Company {name:'TCS'})
MATCH (tech:Technology {name:'MongoDB'})
MERGE (company)-[:USES]->(tech);

MATCH (company:Company {name:'TCS'})
MATCH (tech:Technology {name:'Redis'})
MERGE (company)-[:USES]->(tech);

MATCH (company:Company {name:'TCS'})
MATCH (tech:Technology {name:'Docker'})
MERGE (company)-[:USES]->(tech);

// Technology vulnerabilities

MATCH (tech:Technology {name:'React'})
MATCH (v:Vulnerability {name:'Outdated Version'})
MERGE (tech)-[:HAS_VULNERABILITY]->(v);

MATCH (tech:Technology {name:'Node.js'})
MATCH (v:Vulnerability {name:'Dependency Risk'})
MERGE (tech)-[:HAS_VULNERABILITY]->(v);

MATCH (tech:Technology {name:'Docker'})
MATCH (v:Vulnerability {name:'Critical CVE'})
MERGE (tech)-[:HAS_VULNERABILITY]->(v);

MATCH (tech:Technology {name:'Kubernetes'})
MATCH (v:Vulnerability {name:'Security Misconfiguration'})
MERGE (tech)-[:HAS_VULNERABILITY]->(v);

MATCH (tech:Technology {name:'AWS'})
MATCH (v:Vulnerability {name:'Authentication Issue'})
MERGE (tech)-[:HAS_VULNERABILITY]->(v);

MATCH (tech:Technology {name:'Redis'})
MATCH (v:Vulnerability {name:'Outdated Version'})
MERGE (tech)-[:HAS_VULNERABILITY]->(v);

MATCH (tech:Technology {name:'Neo4j'})
MATCH (v:Vulnerability {name:'Critical CVE'})
MERGE (tech)-[:HAS_VULNERABILITY]->(v);

MATCH (tech:Technology {name:'MongoDB'})
MATCH (v:Vulnerability {name:'Authentication Issue'})
MERGE (tech)-[:HAS_VULNERABILITY]->(v);

MATCH (tech:Technology {name:'Spring Boot'})
MATCH (v:Vulnerability {name:'Dependency Risk'})
MERGE (tech)-[:HAS_VULNERABILITY]->(v);

MATCH (tech:Technology {name:'Kafka'})
MATCH (v:Vulnerability {name:'Security Misconfiguration'})
MERGE (tech)-[:HAS_VULNERABILITY]->(v);

MATCH (tech:Technology {name:'FastAPI'})
MATCH (v:Vulnerability {name:'Outdated Version'})
MERGE (tech)-[:HAS_VULNERABILITY]->(v);

MATCH (tech:Technology {name:'PostgreSQL'})
MATCH (v:Vulnerability {name:'Critical CVE'})
MERGE (tech)-[:HAS_VULNERABILITY]->(v);

MATCH (tech:Technology {name:'Nginx'})
MATCH (v:Vulnerability {name:'Security Misconfiguration'})
MERGE (tech)-[:HAS_VULNERABILITY]->(v);

MATCH (tech:Technology {name:'GraphQL'})
MATCH (v:Vulnerability {name:'Authentication Issue'})
MERGE (tech)-[:HAS_VULNERABILITY]->(v);

MATCH (tech:Technology {name:'TensorFlow'})
MATCH (v:Vulnerability {name:'Dependency Risk'})
MERGE (tech)-[:HAS_VULNERABILITY]->(v);

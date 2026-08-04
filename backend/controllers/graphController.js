// controllers/graphController.js
// Responsible for read-only graph queries using the Neo4j driver

const { runReadQuery } = require('../services/neo4jService')

// Helper to safely open a session and run a read transaction

// GET /api/skills -> return all Skill nodes
exports.getSkills = async (req, res) => {
  try {
    const cypher = 'MATCH (s:Skill) RETURN s ORDER BY s.name'
    const result = await runReadQuery(cypher)
    const skills = result.records.map(r => r.get('s').properties)
    return res.json({ count: skills.length, skills })
  } catch (err) {
    console.error('Error fetching skills', err)
    return res.status(500).json({ error: 'Failed to fetch skills' })
  }
}

// GET /api/companies -> return all Company nodes
exports.getCompanies = async (req, res) => {
  try {
    const cypher = 'MATCH (c:Company) RETURN c ORDER BY c.name'
    const result = await runReadQuery(cypher)
    const companies = result.records.map(r => r.get('c').properties)
    return res.json({ count: companies.length, companies })
  } catch (err) {
    console.error('Error fetching companies', err)
    return res.status(500).json({ error: 'Failed to fetch companies' })
  }
}

// GET /api/roles -> return all Role nodes
exports.getRoles = async (req, res) => {
  try {
    const cypher = 'MATCH (r:Role) RETURN r ORDER BY r.name'
    const result = await runReadQuery(cypher)
    const roles = result.records.map(r => r.get('r').properties)
    return res.json({ count: roles.length, roles })
  } catch (err) {
    console.error('Error fetching roles', err)
    return res.status(500).json({ error: 'Failed to fetch roles' })
  }
}

// GET /api/person/Sailu -> return Sailu and all connected skills
exports.getPersonWithSkills = async (req, res) => {
  try {
    const name = req.params.name || 'Sailu'
    const cypher = `
      MATCH (p:Person {name: $name})
      OPTIONAL MATCH (p)-[:HAS_SKILL]->(sk:Skill)
      RETURN p, collect(sk) AS skills
    `
    const result = await runReadQuery(cypher, { name })
    if (result.records.length === 0) {
      return res.status(404).json({ error: `Person with name ${name} not found` })
    }
    const record = result.records[0]
    const person = record.get('p').properties
    const skills = (record.get('skills') || []).map(s => (s ? s.properties : null)).filter(Boolean)
    return res.json({ person, skills })
  } catch (err) {
    console.error('Error fetching person with skills', err)
    return res.status(500).json({ error: 'Failed to fetch person data' })
  }
}

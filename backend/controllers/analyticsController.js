// controllers/analyticsController.js
// Analytics endpoints using Neo4j

const { runReadQuery } = require('../services/neo4jService')

// Neo4j returns integers as driver Integer objects; unwrap them to plain numbers.
const toCount = value => (value && typeof value.toNumber === 'function' ? value.toNumber() : value)

// Counting each label in its own query keeps a missing or empty label at 0.
// Chaining the counts into a single MATCH pipeline drops every row as soon as
// one label has no nodes, which returned no records at all and crashed here.
async function countQuery(cypher) {
  const result = await runReadQuery(cypher)
  const record = result.records[0]

  return record ? toCount(record.get('total')) : 0
}

exports.getOverview = async (req, res) => {
  try {
    const [
      persons,
      skills,
      roles,
      companies,
      technologies,
      vulnerabilities,
      relationships,
    ] = await Promise.all([
      countQuery('MATCH (p:Person) RETURN count(p) AS total'),
      countQuery('MATCH (s:Skill) RETURN count(s) AS total'),
      countQuery('MATCH (r:Role) RETURN count(r) AS total'),
      countQuery('MATCH (c:Company) RETURN count(c) AS total'),
      countQuery('MATCH (t:Technology) RETURN count(t) AS total'),
      countQuery('MATCH (v:Vulnerability) RETURN count(v) AS total'),
      countQuery('MATCH ()-[rel]->() RETURN count(rel) AS total'),
    ])

    return res.json({
      persons,
      skills,
      roles,
      companies,
      technologies,
      vulnerabilities,
      relationships,
    })
  } catch (err) {
    console.error('Error fetching analytics overview', err)
    return res.status(500).json({ error: 'Failed to fetch overview' })
  }
}

exports.getSkills = async (req, res) => {
  try {
    const cypher = `
      MATCH (sk:Skill)
      OPTIONAL MATCH (r:Role)-[:REQUIRES]->(sk)
      RETURN sk.name AS skill, count(DISTINCT r) AS rolesCount
      ORDER BY rolesCount DESC, skill
    `
    const result = await runReadQuery(cypher)
    const rows = result.records.map(r => ({
      skill: r.get('skill'),
      rolesCount: r.get('rolesCount').toNumber ? r.get('rolesCount').toNumber() : r.get('rolesCount')
    }))
    return res.json({ skills: rows })
  } catch (err) {
    console.error('Error fetching skills analytics', err)
    return res.status(500).json({ error: 'Failed to fetch skills analytics' })
  }
}

exports.getCompanies = async (req, res) => {
  try {
    const cypher = `
      MATCH (c:Company)
      OPTIONAL MATCH (c)-[:USES]->(t:Technology)
      OPTIONAL MATCH (c)-[:HIRING_FOR]->(r:Role)
      RETURN c.name AS company, count(DISTINCT t) AS techCount, count(DISTINCT r) AS hiringCount
      ORDER BY techCount DESC, company
    `
    const result = await runReadQuery(cypher)
    const rows = result.records.map(r => ({
      company: r.get('company'),
      techCount: r.get('techCount').toNumber ? r.get('techCount').toNumber() : r.get('techCount'),
      hiringCount: r.get('hiringCount').toNumber ? r.get('hiringCount').toNumber() : r.get('hiringCount')
    }))
    return res.json({ companies: rows })
  } catch (err) {
    console.error('Error fetching companies analytics', err)
    return res.status(500).json({ error: 'Failed to fetch companies analytics' })
  }
}

exports.getRoles = async (req, res) => {
  try {
    const cypher = `
      MATCH (r:Role)
      OPTIONAL MATCH (r)-[:REQUIRES]->(sk:Skill)
      RETURN r.name AS role, count(DISTINCT sk) AS requiredSkillsCount
      ORDER BY requiredSkillsCount DESC, role
    `
    const result = await runReadQuery(cypher)
    const rows = result.records.map(r => ({
      role: r.get('role'),
      requiredSkillsCount: r.get('requiredSkillsCount').toNumber ? r.get('requiredSkillsCount').toNumber() : r.get('requiredSkillsCount')
    }))
    return res.json({ roles: rows })
  } catch (err) {
    console.error('Error fetching roles analytics', err)
    return res.status(500).json({ error: 'Failed to fetch roles analytics' })
  }
}

exports.getTechnologies = async (req, res) => {
  try {
    const cypher = `
      MATCH (t:Technology)
      OPTIONAL MATCH (c:Company)-[:USES]->(t)
      OPTIONAL MATCH (t)-[:HAS_VULNERABILITY]->(v:Vulnerability)
      RETURN t.name AS technology, count(DISTINCT c) AS usedByCount, count(DISTINCT v) AS vulnerabilitiesCount
      ORDER BY usedByCount DESC, technology
    `
    const result = await runReadQuery(cypher)
    const rows = result.records.map(r => ({
      technology: r.get('technology'),
      usedByCount: r.get('usedByCount').toNumber ? r.get('usedByCount').toNumber() : r.get('usedByCount'),
      vulnerabilitiesCount: r.get('vulnerabilitiesCount').toNumber ? r.get('vulnerabilitiesCount').toNumber() : r.get('vulnerabilitiesCount')
    }))
    return res.json({ technologies: rows })
  } catch (err) {
    console.error('Error fetching technologies analytics', err)
    return res.status(500).json({ error: 'Failed to fetch technologies analytics' })
  }
}

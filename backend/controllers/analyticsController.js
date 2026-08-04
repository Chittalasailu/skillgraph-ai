// controllers/analyticsController.js
// Analytics endpoints using Neo4j

const { runReadQuery } = require('../services/neo4jService')

exports.getOverview = async (req, res) => {
  try {
    const cypher = `
      MATCH (n)
      WITH count(n) AS totalNodes
      MATCH (p:Person) WITH totalNodes, count(p) AS persons
      MATCH (s:Skill) WITH totalNodes, persons, count(s) AS skills
      MATCH (r:Role) WITH totalNodes, persons, skills, count(r) AS roles
      MATCH (c:Company) WITH totalNodes, persons, skills, roles, count(c) AS companies
      MATCH (t:Technology) WITH totalNodes, persons, skills, roles, companies, count(t) AS technologies
      MATCH (v:Vulnerability) WITH totalNodes, persons, skills, roles, companies, technologies, count(v) AS vulnerabilities
      MATCH ()-[rel]->() WITH totalNodes, persons, skills, roles, companies, technologies, vulnerabilities, count(rel) AS relationships
      RETURN persons, skills, roles, companies, technologies, vulnerabilities, relationships
    `
    const result = await runReadQuery(cypher)
    const rec = result.records[0]
    return res.json({
      persons: rec.get('persons').toNumber ? rec.get('persons').toNumber() : rec.get('persons'),
      skills: rec.get('skills').toNumber ? rec.get('skills').toNumber() : rec.get('skills'),
      roles: rec.get('roles').toNumber ? rec.get('roles').toNumber() : rec.get('roles'),
      companies: rec.get('companies').toNumber ? rec.get('companies').toNumber() : rec.get('companies'),
      technologies: rec.get('technologies').toNumber ? rec.get('technologies').toNumber() : rec.get('technologies'),
      vulnerabilities: rec.get('vulnerabilities').toNumber ? rec.get('vulnerabilities').toNumber() : rec.get('vulnerabilities'),
      relationships: rec.get('relationships').toNumber ? rec.get('relationships').toNumber() : rec.get('relationships'),
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

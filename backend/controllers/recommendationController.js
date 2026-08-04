// controllers/recommendationController.js
// Computes role recommendations for a given person using Neo4j

const { runReadQuery } = require('../services/neo4jService')

// GET /api/recommendations/:personName
exports.getRecommendationsForPerson = async (req, res) => {
  const name = req.params.personName
  if (!name) return res.status(400).json({ error: 'personName is required' })

  try {
    // 1) Fetch person's skills
    const personSkillsQ = `
      MATCH (p:Person {name: $name})
      OPTIONAL MATCH (p)-[:HAS_SKILL]->(s:Skill)
      RETURN p, collect(distinct s.name) AS personSkills
    `
    const personRes = await runReadQuery(personSkillsQ, { name })
    if (!personRes || personRes.records.length === 0) {
      return res.status(404).json({ error: `Person with name ${name} not found` })
    }

    const personRecord = personRes.records[0]
    const personNode = personRecord.get('p')
    const personSkills = (personRecord.get('personSkills') || []).map(x => String(x))
    const personSkillsSet = new Set(personSkills)

    // 2) Fetch all roles and their required skills
    const rolesQ = `
      MATCH (r:Role)
      OPTIONAL MATCH (r)-[:REQUIRES]->(sk:Skill)
      RETURN r.name AS roleName, collect(distinct sk.name) AS requiredSkills
    `
    const rolesRes = await runReadQuery(rolesQ)
    const recommendations = []

    for (const rec of rolesRes.records) {
      const roleName = rec.get('roleName')
      const requiredSkills = (rec.get('requiredSkills') || []).map(x => String(x)).filter(Boolean)
      const totalRequired = requiredSkills.length

      let matchedSkills = []
      let missingSkills = []

      if (totalRequired > 0) {
        matchedSkills = requiredSkills.filter(s => personSkillsSet.has(s))
        missingSkills = requiredSkills.filter(s => !personSkillsSet.has(s))
      } else {
        // If role has no required skills, treat match as 0 and no missing
        matchedSkills = []
        missingSkills = []
      }

      const matchPercentage = totalRequired > 0 ? Math.round((matchedSkills.length / totalRequired) * 100) : 0

      recommendations.push({
        role: roleName,
        matchPercentage,
        matchedSkills,
        missingSkills,
        recommendedSkills: missingSkills, // simple recommendation equals missing skills
      })
    }

    // sort by highest matchPercentage
    recommendations.sort((a, b) => b.matchPercentage - a.matchPercentage)

    return res.json({ person: personNode.properties, skills: personSkills, recommendations })
  } catch (err) {
    console.error('Error computing recommendations', err)
    return res.status(500).json({ error: 'Failed to compute recommendations' })
  }
}

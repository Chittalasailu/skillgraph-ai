// controllers/careerController.js
// Provides career advice based on person's skills and graph data

const { runReadQuery } = require('../services/neo4jService')

exports.getCareerAdvice = async (req, res) => {
  const personName = req.params.personName
  try {
    // 1. Get person's current skills
    const personSkillsQ = `
      MATCH (p:Person {name:$name})-[:HAS_SKILL]->(s:Skill)
      RETURN collect(DISTINCT s.name) AS skills
    `
    const psRes = await runReadQuery(personSkillsQ, { name: personName })
    const personSkills = psRes.records.length ? psRes.records[0].get('skills') || [] : []

    // 2. Get all roles with their required skills
    const rolesQ = `
      MATCH (r:Role)
      OPTIONAL MATCH (r)-[:REQUIRES]->(sk:Skill)
      RETURN r.name AS role, collect(DISTINCT sk.name) AS requiredSkills
    `
    const rolesRes = await runReadQuery(rolesQ)
    const roles = rolesRes.records.map(rec => ({
      role: rec.get('role'),
      requiredSkills: rec.get('requiredSkills') || []
    }))

    // 3. Compute match percentages
    let bestRole = null
    for (const r of roles) {
      const req = Array.isArray(r.requiredSkills) ? r.requiredSkills : []
      const matched = req.filter(s => personSkills.includes(s))
      const matchPercentage = req.length ? Math.round((matched.length / req.length) * 100) : 0
      r.matchedSkills = matched
      r.matchPercentage = matchPercentage
      r.missingSkills = req.filter(s => !personSkills.includes(s))
      if (!bestRole || r.matchPercentage > bestRole.matchPercentage) {
        bestRole = r
      }
    }

    if (!bestRole) {
      return res.json({
        currentSkills: personSkills,
        targetRoles: [],
        bestRole: '',
        matchPercentage: 0,
        missingSkills: [],
        recommendedLearningPath: [],
        hiringCompanies: [],
        technologiesToLearn: [],
        estimatedLearningWeeks: 0
      })
    }

    // 4. Find companies hiring for the best role
    const companiesQ = `
      MATCH (c:Company)-[:HIRING_FOR]->(r:Role {name:$role})
      OPTIONAL MATCH (c)-[:USES]->(t:Technology)
      RETURN c.name AS company, collect(DISTINCT t.name) AS technologies
    `
    const compRes = await runReadQuery(companiesQ, { role: bestRole.role })
    const hiringCompanies = compRes.records.map(rec => rec.get('company'))
    // collect technologies used by those companies
    const technologiesToLearnSet = new Set()
    compRes.records.forEach(rec => {
      const techs = rec.get('technologies') || []
      for (const t of techs) if (t) technologiesToLearnSet.add(t)
    })
    const technologiesToLearn = Array.from(technologiesToLearnSet)

    // 5. Build recommended learning path (missingSkills as-is) and estimate time
    const recommendedLearningPath = bestRole.missingSkills
    const estimatedLearningWeeks = recommendedLearningPath.length // 1 skill = 1 week

    // targetRoles: include top 5 roles sorted by match
    const targetRoles = roles
      .map(r => ({ role: r.role, matchPercentage: r.matchPercentage }))
      .sort((a,b)=>b.matchPercentage - a.matchPercentage)
      .slice(0,5)

    return res.json({
      currentSkills: personSkills,
      targetRoles,
      bestRole: bestRole.role,
      matchPercentage: bestRole.matchPercentage,
      missingSkills: bestRole.missingSkills,
      recommendedLearningPath,
      hiringCompanies,
      technologiesToLearn,
      estimatedLearningWeeks
    })
  } catch (err) {
    console.error('Error in getCareerAdvice', err)
    return res.status(500).json({ error: 'Failed to compute career advice' })
  }
}

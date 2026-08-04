// controllers/graphViewController.js
// Returns Neo4j graph data formatted for React Flow.

const { runReadQuery } = require('../services/neo4jService')

exports.getGraphData = async (req, res) => {
  const person = req.params.person || req.query.person || null

  // If a person is provided, return the subgraph centered on that person (one-hop neighbors)
  const cypherPerson = `
    MATCH (p:Person {name: $name})
    OPTIONAL MATCH (p)-[r]-(n)
    RETURN
      elementId(p) AS sourceId,
      labels(p)[0] AS sourceType,
      p.name AS sourceName,
      type(r) AS relation,
      elementId(n) AS targetId,
      labels(n)[0] AS targetType,
      n.name AS targetName
  `

  const cypherAll = `
    MATCH (a)-[r]->(b)
    RETURN
      elementId(a) AS sourceId,
      labels(a)[0] AS sourceType,
      a.name AS sourceName,
      type(r) AS relation,
      elementId(b) AS targetId,
      labels(b)[0] AS targetType,
      b.name AS targetName
  `

  try {
    const result = person ? await runReadQuery(cypherPerson, { name: person }) : await runReadQuery(cypherAll)
    const nodeMap = new Map()
    const edges = []

    result.records.forEach((record, index) => {
      const sourceId = String(record.get('sourceId'))
      const targetId = record.get('targetId') ? String(record.get('targetId')) : null
      const sourceType = record.get('sourceType') || 'Unknown'
      const targetType = record.get('targetType') || 'Unknown'
      const sourceName = record.get('sourceName') || `${sourceType} ${sourceId}`
      const targetName = record.get('targetName') || (targetId ? `${targetType} ${targetId}` : null)
      const relation = record.get('relation') || ''

      if (!nodeMap.has(sourceId)) {
        nodeMap.set(sourceId, {
          id: sourceId,
          type: sourceType,
          label: sourceName,
        })
      }

      if (targetId && !nodeMap.has(targetId)) {
        nodeMap.set(targetId, {
          id: targetId,
          type: targetType,
          label: targetName,
        })
      }

      if (targetId) {
        edges.push({
          id: `e${index + 1}`,
          source: sourceId,
          target: targetId,
          label: relation,
        })
      }
    })

    const nodes = Array.from(nodeMap.values())
    return res.json({ nodes, edges })
  } catch (err) {
    console.error('Error fetching graph data:', err)
    return res.status(500).json({ error: 'Failed to fetch graph data' })
  }
}

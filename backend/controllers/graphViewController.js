// controllers/graphViewController.js
// Returns Neo4j graph data formatted for React Flow.

const { runReadQuery } = require('../services/neo4jService')

exports.getGraphData = async (req, res) => {
  const cypher = `
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
    const result = await runReadQuery(cypher)
    const nodeMap = new Map()
    const edges = []

    result.records.forEach((record, index) => {
      const sourceId = String(record.get('sourceId'))
      const targetId = String(record.get('targetId'))
      const sourceType = record.get('sourceType') || 'Unknown'
      const targetType = record.get('targetType') || 'Unknown'
      const sourceName = record.get('sourceName') || `${sourceType} ${sourceId}`
      const targetName = record.get('targetName') || `${targetType} ${targetId}`
      const relation = record.get('relation') || ''

      if (!nodeMap.has(sourceId)) {
        nodeMap.set(sourceId, {
          id: sourceId,
          type: sourceType,
          label: sourceName,
        })
      }

      if (!nodeMap.has(targetId)) {
        nodeMap.set(targetId, {
          id: targetId,
          type: targetType,
          label: targetName,
        })
      }

      edges.push({
        id: `e${index + 1}`,
        source: sourceId,
        target: targetId,
        label: relation,
      })
    })

    const nodes = Array.from(nodeMap.values())
    return res.json({ nodes, edges })
  } catch (err) {
    console.error('Error fetching graph data:', err)
    return res.status(500).json({ error: 'Failed to fetch graph data' })
  }
}

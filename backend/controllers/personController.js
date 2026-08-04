// controllers/personController.js
// Responsible for handling Person-related API requests.

const { runReadQuery } = require('../services/neo4jService')

exports.getPersons = async (req, res) => {
  try {
    const cypher = 'MATCH (p:Person) RETURN p.name AS name ORDER BY p.name'
    const result = await runReadQuery(cypher)
    const persons = result.records.map(record => ({ name: record.get('name') }))
    return res.json(persons)
  } catch (err) {
    console.error('Error fetching persons', err)
    return res.status(500).json({ error: 'Failed to fetch persons' })
  }
}

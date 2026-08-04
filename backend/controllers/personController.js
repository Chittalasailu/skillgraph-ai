const { runReadQuery } = require('../services/neo4jService');

exports.getPersons = async (req, res) => {
  try {
    const cypher = 'MATCH (p:Person) RETURN p.name AS name ORDER BY p.name';
    const result = await runReadQuery(cypher);

    const data = result.records.map(r => ({ name: r.get('name') }));

    return res.json({ records: data.length, data });
  } catch (err) {
    console.error('Error fetching persons', err);
    return res.status(500).json({ error: 'Failed to fetch persons' });
  }
};
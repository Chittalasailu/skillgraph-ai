const driver = require('../config/neo4j')

async function runReadQuery(cypher, params = {}) {
  if (!driver || typeof driver.session !== 'function') {
    throw new Error('Neo4j driver is not configured. Please set NEO4J_URI, NEO4J_USERNAME and NEO4J_PASSWORD in environment.')
  }

  const session = driver.session({ defaultAccessMode: 'READ' })
  try {
    return await session.run(cypher, params)
  } finally {
    await session.close()
  }
}

module.exports = {
  driver,
  runReadQuery,
}

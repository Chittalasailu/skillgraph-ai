// One-off seeder for CognoDB: loads the schema and seed data from
// database/schema-cognodb.cypher, one statement per request.
// Usage: from backend/ run `node seed-cognodb.js` with NEO4J env vars set.
//
// CognoDB accepts a single statement per request, so the file is split on
// semicolons rather than sent as one script. Every statement uses MERGE or
// CREATE ... IF NOT EXISTS, so re-running is safe.

const fs = require('fs').promises
const path = require('path')

const driver = require('./config/neo4j')

function splitStatements(cypher) {
  return cypher
    .split('\n')
    .filter(line => !line.trim().startsWith('//'))
    .join('\n')
    .split(';')
    .map(statement => statement.trim())
    .filter(Boolean)
}

async function run() {
  const filePath = path.join(__dirname, 'database', 'schema-cognodb.cypher')
  const cypher = await fs.readFile(filePath, 'utf8')
  const statements = splitStatements(cypher)

  if (!statements.length) {
    console.error('No statements found in', filePath)
    process.exit(1)
  }

  console.log(`Executing ${statements.length} statements from ${filePath}`)

  let index = 0
  for (const statement of statements) {
    index += 1
    const session = driver.session()
    try {
      await session.run(statement)
      const preview = statement.replace(/\s+/g, ' ').slice(0, 70)
      console.log(`  ${index}/${statements.length} ok  ${preview}`)
    } catch (err) {
      console.error(`  ${index}/${statements.length} FAILED: ${err.message}`)
      console.error(statement)
      await session.close()
      await driver.close()
      process.exit(1)
    } finally {
      await session.close().catch(() => {})
    }
  }

  console.log('Seed complete.')
  await driver.close()
}

run().catch(async err => {
  console.error('Seeding failed:', err.message)
  try {
    await driver.close()
  } catch (closeErr) {
    // driver may already be closed
  }
  process.exit(1)
})

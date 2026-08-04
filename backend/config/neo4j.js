// Neo4j driver configuration
// Reads connection info from environment variables and exports an initialized driver

const neo4j = require('neo4j-driver')

const uri = process.env.NEO4J_URI || ''
const username = process.env.NEO4J_USERNAME || ''
const password = process.env.NEO4J_PASSWORD || ''

// Validate that when provided the URI looks like a CognoDB Cloud URI
// Expected forms: bolt+s://<instance>.databases.cognodb.cloud or neo4j+s://<instance>.databases.cognodb.cloud
function isCognoDbUri(u) {
  if (!u) return false
  return /^(bolt\+s:|neo4j\+s:)\/\/[^\s\/]+\.databases\.cognodb\.cloud(:\d+)?$/i.test(u)
}

// Create driver instance. Keep driver creation here so it can be reused across the app.
// No sensitive values are committed — use environment variables in production.
let driver = null
if (uri && username && password) {
  // Enforce CognoDB Cloud usage for assignments that require it.
  if (!isCognoDbUri(uri)) {
    // Fail fast with a clear error message so the deployer knows to set the correct URI.
    throw new Error('NEO4J_URI must be a CognoDB Cloud URI (bolt+s://<instance>.databases.cognodb.cloud or neo4j+s://<instance>.databases.cognodb.cloud)')
  }

  driver = neo4j.driver(uri, neo4j.auth.basic(username, password), {
    // Optional driver settings can be placed here
    // e.g., maxConnectionPoolSize, connectionAcquisitionTimeout, etc.
  })
} else {
  // Create a "noop" driver-like object to avoid app crashes during development
  // when environment variables are not set. This prevents accidental calls.
  driver = {
    verifyConnectivity: async () => { throw new Error('Neo4j env vars not set') },
    close: async () => {},
  }
}

module.exports = driver

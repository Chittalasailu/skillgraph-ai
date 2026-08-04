// Neo4j / CognoDB driver configuration
// Reads connection info from environment variables and exports an initialized driver

const neo4j = require("neo4j-driver");

const uri = process.env.NEO4J_URI || "";
const username = process.env.NEO4J_USERNAME || "";
const password = process.env.NEO4J_PASSWORD || "";

// Accept both CognoDB .com and .cloud domains
function isCognoDbUri(u) {
  if (!u) return false;

  return /^(bolt\+s:|neo4j\+s:)\/\/[^\s/]+\.databases\.cognodb\.(com|cloud)(:\d+)?$/i.test(
    u
  );
}

let driver = null;

if (uri && username && password) {
  if (!isCognoDbUri(uri)) {
    throw new Error(
      "NEO4J_URI must be a CognoDB URI (bolt+s://<instance>.databases.cognodb.com or bolt+s://<instance>.databases.cognodb.cloud)"
    );
  }

  driver = neo4j.driver(
    uri,
    neo4j.auth.basic(username, password),
    {
      maxConnectionPoolSize: 50,
      connectionAcquisitionTimeout: 30000,
    }
  );
} else {
  driver = {
    verifyConnectivity: async () => {
      throw new Error(
        "Neo4j/CognoDB environment variables are missing."
      );
    },
    close: async () => {},
  };
}

module.exports = driver;
// One-off runner for CognoDB: executes one Cypher statement per request
// Usage: from backend/ directory run `node run-cognodb.js` with NEO4J env vars set

const fs = require('fs').promises;
const path = require('path');

// Import the existing driver configuration (reads env vars in backend/config/neo4j.js)
const driver = require('./config/neo4j');

async function extractQueries(md) {
  // Capture fenced code blocks: ```...``` and return inner contents
  const re = /```(?:[^\n]*)\n([\s\S]*?)```/g;
  const queries = [];
  let m;
  while ((m = re.exec(md)) !== null) {
    const q = m[1].trim();
    if (q) queries.push(q);
  }
  return queries;
}

async function run() {
  try {
    const filePath = path.join(__dirname, 'database', 'relationship-queries.md');
    console.log('Reading queries from', filePath);
    const md = await fs.readFile(filePath, 'utf8');

    const queries = await extractQueries(md);
    if (!queries.length) {
      console.error('No queries found in', filePath);
      process.exit(1);
    }

    console.log(`Found ${queries.length} queries. Executing sequentially...`);

    let idx = 0;
    for (const q of queries) {
      idx += 1;
      console.log(`\n=== Executing query ${idx} / ${queries.length} ===`);
      // Optionally print a short preview
      console.log(q.length > 200 ? q.slice(0, 200) + '...': q);

      const session = driver.session();
      try {
        const res = await session.run(q);
        console.log(`Query ${idx} succeeded. Summary:`, {
          records: res.records ? res.records.length : 0
        });
      } catch (err) {
        console.error(`Query ${idx} failed with error:`);
        console.error(err && err.message ? err.message : err);
        await session.close();
        // attempt to close driver if possible
        try { if (driver && driver.close) await driver.close(); } catch(e){/*ignore*/}
        process.exit(1);
      } finally {
        try { await session.close(); } catch(e){/*ignore*/}
      }
    }

    console.log('\nAll queries executed successfully.');

    try { if (driver && driver.close) await driver.close(); } catch(e){/*ignore*/}

    process.exit(0);
  } catch (err) {
    console.error('Runner failed:', err && err.message ? err.message : err);
    try { if (driver && driver.close) await driver.close(); } catch(e){/*ignore*/}
    process.exit(1);
  }
}

run();

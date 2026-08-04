const driver = require("../config/neo4j");

exports.getPersons = async (req, res) => {
  const session = driver.session();

  try {
    const result = await session.run(
      "MATCH (p:Person) RETURN p.name AS name"
    );

    console.log("Records:", result.records.length);

    res.json({
      records: result.records.length,
      data: result.records.map(r => ({
        name: r.get("name")
      }))
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message,
      stack: err.stack
    });

  } finally {
    await session.close();
  }
};
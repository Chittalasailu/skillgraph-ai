// controllers/personController.js

const { runReadQuery } = require("../services/neo4jService");

exports.getPersons = async (req, res) => {
  try {
    const result = await runReadQuery(
      "MATCH (p:Person) RETURN p.name AS name"
    );

    console.log("Records found:", result.records.length);

    const persons = result.records.map((record) => ({
      name: record.get("name"),
    }));

    res.json({
      count: persons.length,
      persons,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message,
    });
  }
};
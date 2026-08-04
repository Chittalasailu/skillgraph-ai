// Simple health controller
exports.ping = (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() })
}

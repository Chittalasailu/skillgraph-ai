const express = require('express')
const router = express.Router()
const healthController = require('../controllers/healthController')

// Example API route: GET /api/ping
router.get('/ping', healthController.ping)

module.exports = router

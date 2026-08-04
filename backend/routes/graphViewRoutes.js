// routes/graphViewRoutes.js
// Provides graph view data for React Flow.

const express = require('express')
const router = express.Router()
const graphViewController = require('../controllers/graphViewController')

// GET /api/graph
router.get('/graph', graphViewController.getGraphData)

module.exports = router

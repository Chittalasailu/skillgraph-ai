// routes/recommendationRoutes.js
const express = require('express')
const router = express.Router()
const recommendationController = require('../controllers/recommendationController')

// GET /api/recommendations/:personName
router.get('/recommendations/:personName', recommendationController.getRecommendationsForPerson)

// Alias: GET /api/recommendations/:person
router.get('/recommendations/:person', recommendationController.getRecommendationsForPerson)

module.exports = router

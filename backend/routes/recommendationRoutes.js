// routes/recommendationRoutes.js
const express = require('express')
const router = express.Router()
const recommendationController = require('../controllers/recommendationController')

// GET /api/recommendations/:personName
router.get('/recommendations/:personName', recommendationController.getRecommendationsForPerson)

module.exports = router

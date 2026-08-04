// routes/analyticsRoutes.js
const express = require('express')
const router = express.Router()
const analyticsController = require('../controllers/analyticsController')

router.get('/analytics/overview', analyticsController.getOverview)
router.get('/analytics/skills', analyticsController.getSkills)
router.get('/analytics/companies', analyticsController.getCompanies)
router.get('/analytics/roles', analyticsController.getRoles)
router.get('/analytics/technologies', analyticsController.getTechnologies)

module.exports = router

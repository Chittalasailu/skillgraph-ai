// routes/graphRoutes.js
// Routes exposing read-only graph endpoints

const express = require('express')
const router = express.Router()
const graphController = require('../controllers/graphController')

// GET /api/skills
router.get('/skills', graphController.getSkills)

// GET /api/companies
router.get('/companies', graphController.getCompanies)

// GET /api/roles
router.get('/roles', graphController.getRoles)

// GET /api/person/:name  (e.g. /api/person/Sailu)
router.get('/person/:name', graphController.getPersonWithSkills)

module.exports = router

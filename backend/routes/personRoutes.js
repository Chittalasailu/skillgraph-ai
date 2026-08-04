// routes/personRoutes.js
// Routes exposing Person-related endpoints.

const express = require('express')
const router = express.Router()
const personController = require('../controllers/personController')

// GET /api/persons
router.get('/persons', personController.getPersons)

module.exports = router

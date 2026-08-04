// routes/careerRoutes.js
const express = require('express')
const router = express.Router()
const careerController = require('../controllers/careerController')

router.get('/career-advice/:personName', careerController.getCareerAdvice)

module.exports = router

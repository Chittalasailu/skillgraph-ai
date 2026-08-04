// Entry point for the Express backend
const express = require('express')
const cors = require('cors')
const config = require('./config')
const apiRoutes = require('./routes')
const graphRoutes = require('./routes/graphRoutes')
const graphViewRoutes = require('./routes/graphViewRoutes')
const recommendationRoutes = require('./routes/recommendationRoutes')
const analyticsRoutes = require('./routes/analyticsRoutes')
const careerRoutes = require('./routes/careerRoutes')
const personRoutes = require('./routes/personRoutes')

const app = express()

// Trust proxy headers in production environments like Render
app.set('trust proxy', true)

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }))
app.use(express.json())

// Basic health routes for deployment and uptime checks
app.get('/', (req, res) => {
  res.json({ message: 'SkillGraph AI backend is running' })
})

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// API routes under /api
app.use('/api', apiRoutes)
// Person routes
app.use('/api', personRoutes)
// Graph routes (Neo4j-backed)
app.use('/api', graphRoutes)
app.use('/api', graphViewRoutes)
app.use('/api', recommendationRoutes)
app.use('/api', analyticsRoutes)
app.use('/api', careerRoutes)

// Catch unmatched API routes and return a JSON 404 response.
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' })
})

// Global error handler for unexpected exceptions.
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err)
  res.status(500).json({ error: 'Internal server error' })
})

const neo4jDriver = require('./config/neo4j')

const PORT = config.port || process.env.PORT || 5000
app.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT} in ${config.env} mode`)

  // Verify Neo4j connectivity when the server starts
  try {
    await neo4jDriver.verifyConnectivity()
    console.log('✅ Connected to Neo4j AuraDB')
  } catch (err) {
    console.error('❌ Neo4j Connection Failed', err.message)
  }
})

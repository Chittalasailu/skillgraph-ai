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

const neo4jDriver = require('./config/neo4j')

const app = express()

app.set('trust proxy', true)

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }))
app.use(express.json())

// =========================
// Health Routes
// =========================

app.get('/', (req, res) => {
  res.json({ message: 'SkillGraph AI backend is running' })
})

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// =========================
// DEBUG ROUTE
// =========================

app.get('/test', (req, res) => {
  res.json({
    NEO4J_URI: process.env.NEO4J_URI,
    NEO4J_USERNAME: process.env.NEO4J_USERNAME
  })
})

// =========================
// API Routes
// =========================

app.use('/api', apiRoutes)
app.use('/api', personRoutes)
app.use('/api', graphRoutes)
app.use('/api', graphViewRoutes)
app.use('/api', recommendationRoutes)
app.use('/api', analyticsRoutes)
app.use('/api', careerRoutes)

// =========================
// 404 Handler
// =========================

app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found'
  })
})

// =========================
// Error Handler
// =========================

app.use((err, req, res, next) => {
  console.error(err)

  res.status(500).json({
    error: 'Internal server error'
  })
})

// =========================
// Start Server
// =========================

const PORT = config.port || process.env.PORT || 5000

app.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT} in ${config.env} mode`)

  try {
    await neo4jDriver.verifyConnectivity()
    console.log('✅ Connected to Neo4j')
  } catch (err) {
    console.error('❌ Neo4j Connection Failed:', err.message)
  }
})
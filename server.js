const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')

const app = express()

dotenv.config()

// Middleware
app.use(cors())
app.use(express.json())

// ✅ ROUTES
app.use('/api/auth', require('./routes/auth'))
app.use('/api/reports', require('./routes/reports')) // ← Protected with auth
app.use('/api/admin', require('./routes/admin'))    // ← Protected with adminAuth

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'API Working' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 API Ready: http://localhost:${PORT}`)
})
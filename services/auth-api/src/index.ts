// Load environment variables first
import { config } from 'dotenv'
import path from 'path'
config({ path: path.resolve(__dirname, '../../..', '.env') })

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { authRoutes } from './routes/auth'
import { userRoutes } from './routes/users'
import { accessRoutes } from './routes/access'

const app = express()
const port = process.env.PORT || 3004

// Security middleware
app.use(helmet())
app.use(cors({
  origin: [
    'http://localhost:3000', // Hub
    'http://localhost:3001', // Editorial
    'http://localhost:3002', // Academy
    'http://localhost:3003', // Learn
    'https://cenie.org',
    'https://editorial.cenie.org',
    'https://academy.cenie.org',
    'https://learn.cenie.org'
  ],
  credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/access', accessRoutes)

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('API Error:', err)
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

app.listen(port, () => {
  console.log(`🚀 Auth API Server running on port ${port}`)
  console.log(`📖 Health check: http://localhost:${port}/health`)
})
/**
 * @fileoverview Main Express application configuration.
 * Sets up global middleware (CORS, JSON parsing, cookies) and mounts API routes.
 * @module app
 */

import 'module-alias/register.js'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import fs from 'fs'
import path from 'path'

import userRoutes from './users/user.routes.js'
import establishmentRoutes from './establishments/establishments.routes.js'
import reviewRoutes from './reviews/reviews.routes.js'

/**
 * The configured Express application instance.
 * @type {express.Express}
 */
const app = express()

app.use(cookieParser())
app.use(express.json())

// Ensure uploads folder exists
const uploadsDir = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

app.use('/uploads', express.static('uploads'))

app.use(
  cors({
    origin: ['http://152.42.227.161', 'http://localhost:5173'],
    credentials: true,
  }),
)

/**
 * Mounts user-related routes under the /api/users/ path.
 * @name use/api/users
 * @function
 * @memberof module:app
 * @inner
 * @param {string} path - The base path for the routes.
 * @param {express.Router} router - The router handling user endpoints.
 */
app.use('/api/users/', userRoutes)

app.use('/api/establishments/', establishmentRoutes)
app.use('/api/reviews/', reviewRoutes)

export default app

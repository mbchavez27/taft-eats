/**
 * @fileoverview Main Express application configuration.
 * Sets up global middleware (CORS, JSON parsing, cookies) and mounts API routes.
 * @module app
 */

import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

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
app.use('/uploads', express.static('uploads'))

app.use(
  cors({
    origin: 'http://localhost:5173',
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

import express from 'express'
import cors from 'cors'

import userRoutes from './users/user.routes.js'

const app = express()

app.use(express.json())

app.use(
  cors({
    origin: 'http://localhost:5173/',
  }),
)

app.use('/api/users/', userRoutes)

export default app

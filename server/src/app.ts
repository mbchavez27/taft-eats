import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import userRoutes from './users/user.routes.js'

const app = express()

app.use(cookieParser())
app.use(express.json())

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
)

app.use('/api/users/', userRoutes)

export default app

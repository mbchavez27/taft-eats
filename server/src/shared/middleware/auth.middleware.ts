import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-this'

export interface AuthRequest extends Request {
  user?: { userId: number; role: 'user' | 'owner' | 'admin' }
}

export const requireAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies['auth-token']

    if (!token) {
      return res.status(401).json({ error: 'Not logged in' })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number
      role: 'user' | 'owner' | 'admin'
    }

    req.user = decoded

    next()
  } catch (error: any) {
    res.clearCookie('auth-token')
    res.status(401).json({ error: 'Invalid or expired session' })
  }
}

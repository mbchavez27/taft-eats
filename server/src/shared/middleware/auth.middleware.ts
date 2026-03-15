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
    if (!token) return res.status(401).json({ error: 'Not logged in' })

    const decoded = jwt.verify(token, JWT_SECRET) as any

    // Supports both camelCase and snake_case from JWT payload
    const finalId = decoded.user_id || decoded.userId

    if (!finalId) {
      return res.status(401).json({ error: 'Invalid token payload' })
    }

    req.user = {
      userId: finalId,
      role: decoded.role,
    }

    next()
  } catch (error: any) {
    res.clearCookie('auth-token')
    res.status(401).json({ error: 'Invalid or expired session' })
  }
}

/**
 * Allows the request to proceed whether logged in or not.
 * If logged in, populates req.user so we can check for bookmarks/likes.
 */
export const optionalAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies['auth-token']

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET) as any
      const finalId = decoded.user_id || decoded.userId

      if (finalId) {
        req.user = {
          userId: finalId,
          role: decoded.role,
        }
      }
    }
  } catch (error: any) {
    // If token is invalid, we don't throw an error or clear cookies.
    // We just let them proceed as a guest (req.user remains undefined).
  }
  next()
}

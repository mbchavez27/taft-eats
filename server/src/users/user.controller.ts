import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { UserService } from './user.service.js'
import { CreateUserDTO, LoginDTO, UpdateUserDTO } from './dto/user-dto.js'
import { AuthRequest } from 'shared/middleware/auth.middleware.js'
import { UserModel } from './user.model.js'

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-this'

/**
 * Default cookie configuration for authentication tokens.
 * @type {object}
 * @property {boolean} httpOnly - Prevents client-side scripts from accessing the cookie.
 * @property {boolean} secure - Ensures cookie is sent over HTTPS only (enabled in production).
 * @property {string} sameSite - CSRF protection setting.
 * @property {number} maxAge - Cookie expiration set to 14 days in milliseconds.
 */
const cookies = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
}

/**
 * Controller handling user-related HTTP requests including registration,
 * authentication, and session management.
 */
export const UserController = {
  /**
   * Registers a new user in the system.
   * * @route POST /api/users/register
   * @param {Request} req - Express request object containing CreateUserDTO in body.
   * @param {Response} res - Express response object.
   * @returns {Promise<void>} Returns 201 with user data and auth cookie on success, or error status on failure.
   */
  register: async (req: Request, res: Response) => {
    try {
      const userData: CreateUserDTO = req.body

      const newUser = await UserService.register(userData)

      const token = jwt.sign(
        { user_id: newUser.user_id, role: newUser.role },
        JWT_SECRET,
        { expiresIn: '14d' },
      )

      res.cookie('auth-token', token, cookies)

      res.status(201).json({
        message: 'User registered successfully',
        user: newUser,
      })
    } catch (error: any) {
      if (
        error.message === 'Email already registered' ||
        error.message === 'Username already taken'
      ) {
        res.status(409).json({ error: error.message })
      } else {
        console.error('[Register Error]:', error)
        res.status(500).json({ error: 'Internal server error' })
      }
    }
  },

  /**
   * Authenticates a user and establishes a session via JWT and cookies.
   * * @route POST /api/users/login
   * @param {Request} req - Express request object containing LoginDTO in body.
   * @param {Response} res - Express response object.
   * @returns {Promise<void>} Returns 200 with JWT and user data on success, or 401/500 on failure.
   */
  login: async (req: Request, res: Response) => {
    try {
      const credentials: LoginDTO = req.body

      const user = await UserService.login(credentials)

      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' })
      }

      const token = jwt.sign(
        {
          user_id: user.user_id,
          role: user.role,
        },
        JWT_SECRET,
        { expiresIn: '14d' },
      )

      res.cookie('auth-token', token, cookies)

      res.status(200).json({
        message: 'Login successful',
        token,
        user,
      })
    } catch (error) {
      console.error('Login Error: ', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  },

  /**
   * Logs out the current user by clearing the authentication cookie.
   * * @route POST /api/users/logout
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   * @returns {Promise<void>} Returns 200 message on success.
   */
  logout: async (req: Request, res: Response) => {
    res.cookie('auth-token', '', { ...cookies, maxAge: 0 })

    res.status(200).json({ message: 'Logged out successfully' })
  },

  /**
   * Verifies the current user's session and returns their profile data.
   * Requires authentication middleware to have previously populated req.user.
   * * @route GET /api/user/verify
   * @param {AuthRequest} req - Express request extended with user session data.
   * @param {Response} res - Express response object.
   * @returns {Promise<void>} Returns 200 with user profile, 401 if unauthorized, or 404 if not found.
   */
  verify: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.userId
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      const user = await UserModel.findByID(userId)

      if (!user) {
        return res.status(404).json({ error: "User not found'" })
      }

      res.status(200).json({ user })
    } catch (error: any) {
      console.error('Verify Error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  },

  //TODO: Add update user controller
}

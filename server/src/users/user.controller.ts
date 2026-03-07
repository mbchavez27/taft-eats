import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { UserService } from './user.service.js'
import { CreateUserDTO, LoginDTO, UpdateUserDTO } from './dto/user-dto.js'
import { AuthRequest } from 'shared/middleware/auth.middleware.js'
import { UserModel } from './user.model.js'

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-this'

const cookies = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
}

export const UserController = {
  //Register POST /api/users/register
  register: async (req: Request, res: Response) => {
    try {
      const userData: CreateUserDTO = req.body

      const newUser = await UserService.register(userData)

      const token = jwt.sign(
        { userId: newUser.user_id, role: newUser.role },
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

  //Login POST /api/users/login
  login: async (req: Request, res: Response) => {
    try {
      const credentials: LoginDTO = req.body

      const user = await UserService.login(credentials)

      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' })
      }

      const token = jwt.sign(
        {
          userId: user.user_id,
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

  //Login POST /api/users/logout
  logout: async (req: Request, res: Response) => {
    res.cookie('auth-token', '', { ...cookies, maxAge: 0 })

    res.status(200).json({ message: 'Logged out successfully' })
  },

  //Verify GET /api/user/verify
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

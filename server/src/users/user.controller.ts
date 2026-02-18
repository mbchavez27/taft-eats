import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { UserService } from './user.service.js'
import { CreateUserDTO, LoginDTO, UpdateUserDTO } from './dto/user-dto.js'
import { error } from 'node:console'

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-this'

export const UserController = {
  //Register POST /api/users/register
  regiser: async (req: Request, res: Response) => {
    try {
      const userData: CreateUserDTO = req.body

      const newUser = await UserService.register(userData)

      const token = jwt.sign(
        { userId: newUser.user_id, role: newUser.role },
        JWT_SECRET,
        { expiresIn: '14d' },
      )

      res.status(201).json({
        message: 'User registered successfully',
        token,
        data: newUser,
      })
    } catch (error: any) {
      if (
        error.message === 'Email already registered' ||
        error.message === 'Username already taken'
      ) {
        res.status(409).json({ error: error.message })
      } else {
        console.error('Register Error: ', error)
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

  //TODO: Add update user controller
}

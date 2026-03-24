import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { UserService } from './user.service.js'
import { CreateUserDTO, LoginDTO, UpdateUserDTO } from './dto/user-dto.js'
import { AuthRequest } from '#shared/middleware/auth.middleware.js'
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
      // Data comes in via req.body (parsed by multer from FormData)
      const userData: any = req.body

      // FormData sends everything as strings, so we must parse tags back to an array
      if (userData.tags && typeof userData.tags === 'string') {
        try {
          userData.tags = JSON.parse(userData.tags)
        } catch (e) {
          userData.tags = []
        }
      }

      // Multer puts files inside req.files when using upload.fields()
      const files = req.files as
        | { [fieldname: string]: Express.Multer.File[] }
        | undefined

      // If an avatar was uploaded, create a URL path to it
      if (files?.avatar?.[0]) {
        // Assuming your backend serves the uploads folder statically
        userData.profile_picture_url = `/uploads/${files.avatar[0].filename}`
      }

      // If a banner was uploaded, create a URL path to it
      if (files?.restaurantBanner?.[0]) {
        userData.restaurantBanner = `/uploads/${files.restaurantBanner[0].filename}`
      }

      const newUser = await UserService.register(userData as CreateUserDTO)

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

  /**
   * Handles updating the authenticated user's profile.
   * @route PATCH /api/users/profile
   */
  updateProfile: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.userId
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      // req.body will now contain the text fields (name, username, bio) parsed by Multer
      const updateData: UpdateUserDTO = req.body

      // If Multer processed an 'avatar' file, attach the URL to updateData
      if (req.file) {
        updateData.profile_picture_url = `/uploads/${req.file.filename}`
      }

      const updatedUser = await UserService.updateProfile(userId, updateData)

      res.status(200).json({
        message: 'Profile updated successfully',
        user: updatedUser,
      })
    } catch (error: any) {
      if (error.message === 'Username already taken') {
        res.status(409).json({ error: error.message })
      } else {
        console.error('Update Profile Error:', error)
        res
          .status(500)
          .json({ error: 'Internal server error while updating profile' })
      }
    }
  },

  /**
   * Checks if a username is available.
   * @route GET /api/users/check-username
   */
  checkUsername: async (req: Request, res: Response) => {
    try {
      const { username } = req.query

      if (!username || typeof username !== 'string') {
        return res
          .status(400)
          .json({ error: 'Username query parameter is required' })
      }

      // Check the database
      const existingUser = await UserModel.findByUsername(username)

      // If no user is found, the username is available (true)
      res.status(200).json({ available: !existingUser })
    } catch (error) {
      console.error('Check Username Error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  },

  /**
   * Handles GET requests to fetch all users (Admin).
   */
  getAllUsers: async (req: Request, res: Response) => {
    try {
      // NOTE: Add your admin role check here!
      let limitRaw = req.query.limit
      let lastIdRaw = req.query.lastId
      if (Array.isArray(limitRaw)) limitRaw = limitRaw[0]
      if (Array.isArray(lastIdRaw)) lastIdRaw = lastIdRaw[0]

      const limit = typeof limitRaw === 'string' ? parseInt(limitRaw, 10) : 20
      const lastId =
        typeof lastIdRaw === 'string' ? parseInt(lastIdRaw, 10) : undefined

      const users = await UserModel.getAllUsers(limit, lastId)

      res.status(200).json({
        success: true,
        data: users,
        count: users.length,
      })
    } catch (error) {
      console.error('Error fetching all users:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  },

  /**
   * Handles DELETE requests to remove a user (Admin).
   */
  deleteUserAsAdmin: async (req: Request, res: Response) => {
    try {
      // NOTE: Add your admin role check here!
      const userId = parseInt(req.params.id as string, 10)
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' })
      }

      const success = await UserModel.adminDeleteUser(userId)
      if (!success) {
        return res.status(404).json({ error: 'User not found' })
      }

      res
        .status(200)
        .json({ success: true, message: 'User deleted successfully' })
    } catch (error) {
      console.error('Error deleting user:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  },
}

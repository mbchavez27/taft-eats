import { Router } from 'express'
import { UserController } from './user.controller.js'
import { requireAuth } from 'shared/middleware/auth.middleware.js'

const router = Router()

router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.post('/logout', UserController.logout)
router.get('/verify', requireAuth, UserController.verify)

export default router

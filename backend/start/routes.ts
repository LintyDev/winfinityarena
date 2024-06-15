/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const RegisterController = () => import('#controllers/auth/register_controller')
const LogoutController = () => import('#controllers/auth/logout_controller')
const LoginController = () => import('#controllers/auth/login_controller')
const UserController = () => import('#controllers/user_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

router
  .group(() => {
    router.post('register', [RegisterController, 'store']).as('register')
    router.post('login', [LoginController, 'store']).as('login')
    router.post('logout', [LogoutController, 'handle']).as('logout').use(middleware.auth())
  })
  .as('auth')
  .prefix('/auth')

router.get('/me', [UserController, 'me']).as('me').use(middleware.auth())
router
  .get('/admin', [UserController, 'admin'])
  .as('check.admin')
  .use([middleware.auth(), middleware.admin()])

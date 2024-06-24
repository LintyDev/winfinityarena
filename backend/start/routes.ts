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
const RoomsController = () => import('#controllers/rooms_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

// Auth route
router
  .group(() => {
    router.post('register', [RegisterController, 'store']).as('register')
    router.post('login', [LoginController, 'store']).as('login')
    router.post('logout', [LogoutController, 'handle']).as('logout').use(middleware.auth())
  })
  .as('auth')
  .prefix('/auth')
// Me (user) route
router
  .group(() => {
    router.get('/me', [UserController, 'me']).as('check')
    router.post('/me', [UserController, 'edit']).as('edit')
  })
  .as('me')
  .use(middleware.auth())
// Session (game) route
router
  .group(() => {
    router.get('/create', [RoomsController, 'create']).as('create')
    router.post('/join', [RoomsController, 'join']).as('join')
    router.post('/ragequit', [RoomsController, 'forceQuit']).as('ragequit')
  })
  .as('session')
  .prefix('/session')
  .use(middleware.auth())

router
  .get('/admin', [UserController, 'admin'])
  .as('check.admin')
  .use([middleware.auth(), middleware.admin()])

import User from '#models/user'
import { editUserValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'

export default class UserController {
  async me({ auth, response }: HttpContext) {
    await auth.check()
    return response.json(auth.user)
  }

  async edit({ auth, response, request }: HttpContext) {
    await auth.check()
    const data = await request.validateUsing(editUserValidator)

    if (data.id !== auth.user?.id) {
      return response.status(401).json({ message: 'Cannot perform this action' })
    }

    let user = await User.findOrFail(data.id)

    if (data.oldPassword || data.password) {
      user = await User.verifyCredentials(user.username, data.oldPassword ?? data.password ?? '')
    }

    user.merge({ username: data.username, avatar: data.avatar, password: data.password })

    await user.save()
    return response.json({ success: true, user })
  }

  async admin({ auth, response }: HttpContext) {
    return response.json({
      user: auth.user,
      admin: true,
    })
  }
}

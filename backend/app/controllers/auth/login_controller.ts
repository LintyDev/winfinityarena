import User from '#models/user'
import { loginValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'

export default class LoginController {
  async store({ request, response, auth }: HttpContext) {
    const { username, password } = await request.validateUsing(loginValidator)
    const user = await User.verifyCredentials(username, password)

    await auth.use('web').login(user)
    return response.ok({
      user,
    })
  }
}

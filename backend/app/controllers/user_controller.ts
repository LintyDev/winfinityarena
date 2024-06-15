import type { HttpContext } from '@adonisjs/core/http'

export default class UserController {
  async me({ auth, response }: HttpContext) {
    await auth.check()
    return response.json({
      user: auth.user,
    })
  }
}

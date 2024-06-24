import User from '#models/user'
import { editUserValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import RoomStatus from '../Enums/room.js'

export default class UserController {
  async me({ auth, response }: HttpContext) {
    await auth.check()
    const user = auth.getUserOrFail()

    const gamePlayed = await user.related('rooms').query().count('* as total')
    user.$extras.gamePlayed = gamePlayed[0].$extras

    const gameWin = await user.related('rooms').query().wherePivot('win', true).count('* as total')
    user.$extras.gameWin = gameWin[0].$extras

    const inGame = await user.related('rooms').query().where('status', RoomStatus.IN_PROGRESS)
    user.$extras.inGame = inGame

    return response.json(user)
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

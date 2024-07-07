import Room from '#models/room'
import User from '#models/user'
import w_service from '#services/w_service'
import type { HttpContext } from '@adonisjs/core/http'
import RoomStatus from '../Enums/room.js'

export default class GamesController {
  async eventCanStartSession({ auth, request, response }: HttpContext) {
    await auth.check()
    const { sessionId } = request.only(['sessionId'])
    w_service.io.to(sessionId).emit('canIStartSession')

    response.json({ success: true })
  }

  async setGame({ auth, request, response }: HttpContext) {
    await auth.check()
    const { game, sessionId }: { game: {}; sessionId: string } = request.only(['sessionId', 'game'])
    const room = await Room.findByOrFail('sessionId', sessionId)
    room.gameState = game
    await room.save()

    return response.json({ success: true })
  }

  async getGame({ auth, request, response }: HttpContext) {
    auth.check()
    const { sessionId } = request.only(['sessionId'])
    const room = await Room.findByOrFail('sessionId', sessionId)

    return response.json({ success: true, gameState: room.gameState })
  }

  async setWinner({ auth, request, response }: HttpContext) {
    await auth.check()
    const { sessionId, username } = request.only(['sessionId', 'username'])
    const room = await Room.findByOrFail('sessionId', sessionId)
    const user = await User.findByOrFail('username', username)
    room.status = RoomStatus.COMPLETED
    await user.related('rooms').pivotQuery().wherePivot('room_id', room.id).update('win', true)
    await room.save()

    console.log('setWinner')

    return response.json({ success: true })
  }
}

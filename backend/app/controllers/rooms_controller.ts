import Room from '#models/room'
import { randomAccessKey } from '#services/random_access_key'
import type { HttpContext } from '@adonisjs/core/http'
import { randomUUID } from 'node:crypto'
import RoomStatus from '../Enums/room.js'
import w_service from '#services/w_service'
import db from '@adonisjs/lucid/services/db'

export default class RoomsController {
  async create({ auth, response }: HttpContext) {
    await auth.check()
    const user = auth.getUserOrFail()
    const room = new Room()
    room.sessionId = randomUUID()
    room.accessKey = randomAccessKey()
    await room.save()
    await room.related('users').attach({ [user.id]: { host: true } })

    return response.json({ success: true })
  }

  async join({ auth, request, response }: HttpContext) {
    await auth.check()
    const user = auth.getUserOrFail()
    const data = request.only(['accessKey'])
    console.log(data)
    const room = await Room.findByOrFail('access_key', +data.accessKey)
    await room.load('users')

    if (room.users.length < 6) {
      await room.related('users').attach([user.id])
      return response.json({ success: true })
    }

    return response.json({ success: false })
  }

  async forceQuit({ auth, request, response }: HttpContext) {
    await auth.check()
    const data = request.only(['sessionId'])
    const room = await Room.findByOrFail('sessionId', data.sessionId)
    room.status = RoomStatus.COMPLETED
    room.save()

    w_service.io.to(data.sessionId).emit('hostDisconnected', { session: true })

    return response.json({ success: true })
  }

  async king({ auth, response }: HttpContext) {
    await auth.check()
    const user = auth.getUserOrFail()
    const king = await user
      .related('rooms')
      .query()
      .wherePivot('host', true)
      .whereNot('status', RoomStatus.COMPLETED)
      .as('king')

    return response.json({ king: king.length ? true : false })
  }

  async start({ auth, request, response }: HttpContext) {
    await auth.check()
    const data = request.only(['sessionId'])
    const room = await Room.findByOrFail('sessionId', data.sessionId)
    room.status = RoomStatus.CHOOSE_GAME
    room.save()

    return response.json({ success: true, status: room.status })
  }

  async chooseGame({ auth, request, response }: HttpContext) {
    await auth.check()
    const data = request.only(['sessionId', 'game'])
    const room = await Room.findByOrFail('sessionId', data.sessionId)
    room.status = RoomStatus.IN_GAME
    // room.game = data.game
    const currGame = 'uno_pokemon'
    room.game = currGame
    room.save()

    w_service.io.to(data.sessionId).emit('changeView', { view: RoomStatus.IN_GAME, game: currGame })
    w_service.io.to(data.sessionId).emit('changeMobileView', { status: RoomStatus.IN_GAME })

    return response.json({ success: true })
  }

  async room({ auth, request, response }: HttpContext) {
    await auth.check()
    const data = request.only(['sessionId'])
    const room = await Room.findByOrFail('sessionId', data.sessionId)
    await room.load('users')

    return response.json({ success: true, session: room })
  }

  async getGameHistory({ auth, response }: HttpContext) {
    await auth.check()
    const rooms = await db.from('room').paginate(1, 10)
    return response.json({ success: true, session: rooms.toJSON() })
  }
}

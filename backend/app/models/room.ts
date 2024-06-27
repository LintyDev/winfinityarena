import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import RoomStatus from '../Enums/room.js'
import User from './user.js'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'

export default class Room extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare sessionId: string

  @column()
  declare status: RoomStatus

  @column()
  declare accessKey: number

  @manyToMany(() => User, {
    pivotTable: 'users_rooms',
    localKey: 'id',
    relatedKey: 'id',
    pivotForeignKey: 'room_id',
    pivotRelatedForeignKey: 'user_id',
    pivotColumns: ['win'],
  })
  declare users: ManyToMany<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}

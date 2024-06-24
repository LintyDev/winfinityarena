import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import Roles from '../Enums/roles.js'
import Room from './room.js'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['username'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare avatar: string

  @column()
  declare username: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare role: Roles

  @manyToMany(() => Room, {
    serializeAs: null,
    pivotTable: 'users_rooms',
    localKey: 'id',
    relatedKey: 'id',
    pivotForeignKey: 'user_id',
    pivotRelatedForeignKey: 'room_id',
  })
  declare rooms: ManyToMany<typeof Room>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  serializeExtras = true
}

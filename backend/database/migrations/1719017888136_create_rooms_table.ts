import { BaseSchema } from '@adonisjs/lucid/schema'
import RoomStatus from '../../app/Enums/room.js'

export default class extends BaseSchema {
  protected tableName = 'rooms'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('session_id').unique().notNullable()
      table.string('status').notNullable().defaultTo(RoomStatus.IN_PROGRESS)
      table.integer('access_key').unique()
      table.string('game').nullable().defaultTo(null)
      table.json('game_state').nullable().defaultTo(null)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

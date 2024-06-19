import { BaseSchema } from '@adonisjs/lucid/schema'
import Roles from '../../app/Enums/roles.js'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('avatar').notNullable().defaultTo('avatar1')
      table.string('username').notNullable().unique()
      table.string('password').notNullable()
      table.integer('game_win').notNullable().defaultTo(0)
      table.integer('game_played').notNullable().defaultTo(0)
      table.string('role').notNullable().defaultTo(Roles.USER)
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

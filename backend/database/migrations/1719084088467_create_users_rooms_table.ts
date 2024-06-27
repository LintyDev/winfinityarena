import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users_rooms'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('room_id').unsigned().references('rooms.id').notNullable()
      table.integer('user_id').unsigned().references('users.id').notNullable()
      table.boolean('win').defaultTo(false)
      table.boolean('host').defaultTo(false)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

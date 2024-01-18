/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('lessons', table => {
    table.increments('id').primary(),
      table.string('name'),
      table.string('content'),
      table.string('image_url'),
      table
        .integer('chapter_id')
        .references('id')
        .inTable('chapters')
        .onDelete('cascade'),
      table.timestamps(true, true)
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('lessons')
}

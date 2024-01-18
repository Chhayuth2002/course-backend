/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("courses", table => {
    table.increments("id").primary(),
      table.string("name"),
      table.string("summary"),
      table.string("image_url"),
      table.integer("category_id")
        .references("id")
        .inTable("categories")
        .onDelete("cascade")
        .nullable()
    table.timestamps(true, true)
  })


};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("courses")
};

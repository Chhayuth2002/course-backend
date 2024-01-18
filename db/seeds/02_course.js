/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('courses').del()
  await knex('courses').insert([
    { id: 1, name: 'course1', summary: "lorem ipsum balalfadfadf", categoryId: 1 },
    { id: 2, name: 'course2', summary: "lorem ipsum balalfadfadf", categoryId: 2 },
    { id: 3, name: 'course3', summary: "lorem ipsum balalfadfadf", categoryId: 3 }
  ]);
};

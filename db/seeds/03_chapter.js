/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('chapters').del()
  await knex('chapters').insert([
    { id: 1, name: 'chapter1', summary: "lorem ipsum balalfadfadf", courseId: 1 },
    { id: 2, name: 'chapter2', summary: "lorem ipsum balalfadfadf", courseId: 1 },
    { id: 3, name: 'chapter1', summary: "lorem ipsum balalfadfadf", courseId: 2 }
  ]);
};

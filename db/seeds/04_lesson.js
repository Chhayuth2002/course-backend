/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('lessons').del()
  await knex('lessons').insert([
    { id: 1, name: 'lesson1', content: "lorem ipsum balalfadfadf", chapterId: 1 },
    { id: 2, name: 'lesson2', content: "lorem ipsum balalfadfadf", chapterId: 1 },
    { id: 3, name: 'lesson1', content: "lorem ipsum balalfadfadf", chapterId: 2 },
    { id: 4, name: 'lesson1', content: "lorem ipsum balalfadfadf", chapterId: 3 },
    { id: 5, name: 'lesson2', content: "lorem ipsum balalfadfadf", chapterId: 3 },
    { id: 6, name: 'lesson3', content: "lorem ipsum balalfadfadf", chapterId: 3 }

  ]);
};

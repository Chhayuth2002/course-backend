/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {

  // Deletes ALL existing entries
  await knex('categories').del()
  await knex('categories').insert([
    {
      id: 1,
      name: "category 1",
      code: "category 1"
    },
    {
      id: 2,
      name: "category 2",
      code: "category 2"
    },
    {
      id: 3,
      name: "category 3",
      code: "category 3"
    },
    {
      id: 4,
      name: "category 4",
      code: "category 4"
    },
  ]);
};

const { Model } = require("objection")
const db = require("../db/knex")

Model.knex(db)

class Category extends Model {
  static get tableName() {
    return "categories"
  }

  static get relationMappings() {
    return {
      courses: {
        relation: Model.HasManyRelation,
        modelClass: require("../models/Course"),
        join: {
          from: "categories.id",
          to: "courses.category_id"
        }
      }
    }
  }
}

module.exports = Category
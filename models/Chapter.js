const { Model } = require("objection")
const db = require("../db/knex")

Model.knex(db)

class Chapter extends Model {
  static get tableName() {
    return "chapters"
  }

  static get relationMappings() {
    return {
      lessons: {
        relation: Model.HasManyRelation,
        modelClass: require("../models/Lesson"),
        join: {
          from: "chapters.id",
          to: "lessons.chapter_id"
        }
      }
    }
  }
}

module.exports = Chapter
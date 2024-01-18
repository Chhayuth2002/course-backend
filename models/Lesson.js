const { Model } = require("objection")
const db = require("../db/knex")

Model.knex(db)

class Lesson extends Model {
  static get tableName() {
    return "lessons"
  }

  static get relationMappings() {
    return {
      chapter: {
        relation: Model.BelongsToOneRelation,
        modelClass: require("../models/Chapter"),
        join: {
          from: "lessons.chatper_id",
          to: "chapters.id."
        }
      }
    }
  }
}

module.exports = Lesson
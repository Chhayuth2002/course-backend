const { Model } = require("objection")
const db = require("../db/knex")

Model.knex(db)

class Course extends Model {
  static get tableName() {
    return "courses"
  }

  static get relationMappings() {
    return {
      chapters: {
        relation: Model.HasManyRelation,
        modelClass: require("./Chapter"),
        join: {
          from: "courses.id",
          to: "chapters.course_id"
        }
      },
      tags: {
        relation: Model.ManyToManyRelation,
        modelClass: require("./Tag"),
        join: {
          from: "courses.id",
          through: {
            from: "course_tags.course_id",
            to: "course_tags.tag_id"
          },
          to: "tags.id"
        }
      }
    }
  }
}

module.exports = Course
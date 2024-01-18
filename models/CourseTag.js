const { Model } = require("objection")
const db = require("../db/knex")

Model.knex(db)

class CourseTag extends Model {
  static get tableName() {
    return "course_tags"
  }

  static get relationMappings() {
    return {
      course: {
        relation: Model.BelongsToOneRelation,
        classModel: require("./Course"),
        join: {
          from: "course_tags.course_id",
          to: "courses.id"
        }
      },
      tag: {
        relation: Model.BelongsToOneRelation,
        classModel: require("./Tag"),
        join: {
          from: "course_tags.tag_id",
          to: "tags.id"
        }
      }
    }
  }
}

module.exports = CourseTag


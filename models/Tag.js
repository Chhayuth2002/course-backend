const { Model } = require("objection")
const db = require("../db/knex")

Model.knex(db)

class Tag extends Model {
  static get tableName() {
    return "tags"
  }

  static get relationMappings() {
    return {
      courses: {
        relation: Model.ManyToManyRelation,
        classModel: require("./Course"),
        join: {
          from: "tags.id",
          through: {
            from: "course_tag.tag_id",
            to: "course_tag.course_id"
          },
          to: "courses.id"
        }
      }
    }
  }
}

module.exports = Tag

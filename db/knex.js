const knex = require("knex")
const { Model } = require('objection')
const config = require('../knexfile.js')
const NODE_ENV = process.env.NODE_ENV || "development"
const db = knex(config[NODE_ENV])

Model.knex(db)

module.exports = db

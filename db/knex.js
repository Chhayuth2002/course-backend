const knex = require("knex")
const { Model } = require('objection')
const config = require('../knexfile.js')

const db = knex(config.development)

Model.knex(db)

module.exports = db

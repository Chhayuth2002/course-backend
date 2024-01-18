const knex = require("knex")
const { Model } = require('objection')
const config = require('../knexfile.js')

const db = knex(config.production)

Model.knex(db)

module.exports = db

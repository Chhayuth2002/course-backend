const Category = require('../models/Category')

const list = (req, res) => {
  try {
    Category.query().then(result => res.json(result))
  } catch (error) {
    res.json({ error: error.message })
  }
}

const show = (req, res) => {
  try {
    const { id } = req.params

    Category.query()
      .findById(id)
      .then(result => res.json(result))
  } catch (error) {
    res.json({ error: error.message })
  }
}

const create = (req, res) => {
  try {
    const { name, code } = req.body

    Category.query()
      .insert({
        name: name,
        code: code
      })
      .then(result => res.json(result))
  } catch (error) {
    res.json({ error: error.message })
  }
}

const update = (req, res) => {
  try {
    const { id } = req.params
    const { name, code } = req.body

    Category.query()
      .patchAndFetchById(id, {
        name: name,
        code: code
      })
      .then(result => res.json(result))
  } catch (error) {
    res.json({ error: error.message })
  }
}

const destroy = (req, res) => {
  try {
    const { id } = req.params

    Category.query()
      .deleteById(id)
      .then(result => res.json(result))
  } catch (error) {
    res.json({ error: error.message })
  }
}

module.exports = {
  list,
  show,
  create,
  update,
  destroy
}

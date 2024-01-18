const Category = require('../models/Category')

const getAllCategory = (req, res) => {
  try {
    Category.query().then(result => res.json(result))
  } catch (error) {
    res.json({ error: error.message })
  }
}

const getOneCategory = (req, res) => {
  try {
    const { id } = req.params

    Category.query()
      .findById(id)
      .then(result => res.json(result))
  } catch (error) {
    res.json({ error: error.message })
  }
}

const createCategory = (req, res) => {
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

const updateCategory = (req, res) => {
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

const deleteCategory = (req, res) => {
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
  getAllCategory,
  getOneCategory,
  createCategory,
  updateCategory,
  deleteCategory
}

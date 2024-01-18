const express = require("express")
const router = express.Router()

const {
  getAllCategory,
  getOneCategory,
  createCategory,
  updateCategory,
  deleteCategory
} = require("../controllers/category")

router.route("/").get(getAllCategory).post(createCategory)
router.route("/:id").get(getOneCategory).put(updateCategory).delete(deleteCategory)

module.exports = router
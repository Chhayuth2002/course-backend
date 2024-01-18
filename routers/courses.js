const express = require("express")
const router = express.Router()

const {
  getAllCourse,
  getOneCourse,
  createCourse,
  updateCourse,
  deleteCourse
} = require("../controllers/courses")


router.route("/").get(getAllCourse).post(createCourse)
router.route("/:id").get(getOneCourse).put(updateCourse).delete(deleteCourse)

module.exports = router
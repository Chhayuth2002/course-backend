const express = require("express")
const router = express.Router()
const upload = require("../multer.js")

const {
  list,
  show,
  create,
  update,
  destroy
} = require("../controllers/courses")


router.route("/").get(list).post(upload.any() ,create)
router.route("/:id").get(show).put(upload.any() ,update).delete(destroy)

module.exports = router
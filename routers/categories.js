const express = require("express")
const router = express.Router()

const {
  list,
  show,
  create,
  update,
  destroy
} = require("../controllers/categories")

router.route("/").get(list).post(create)
router.route("/:id").get(show).put(update).delete(destroy)

module.exports = router
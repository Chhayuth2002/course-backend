const express = require("express")
const router = express.Router()

const {
  getAllTags
} = require("../controllers/tags")

router.route("/").get(getAllTags)

module.exports = router
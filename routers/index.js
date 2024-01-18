const express = require("express")

const router = express.Router()

const categoriesRoute = require("./categories")
const coursesRoute = require("./courses")
const tagsRoute = require("./tags")
const uploadRoute = require("./upload")

router.use("/categories", categoriesRoute)
router.use("/courses", coursesRoute)
router.use("/tags", tagsRoute)
router.use("/upload", uploadRoute )

module.exports = router
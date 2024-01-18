const express = require("express")
const router = express.Router()
const upload = require("../multer.js")

const uploadFile = require("../controllers/upload")

router.route("/").post(upload.single("url"), uploadFile)

module.exports = router
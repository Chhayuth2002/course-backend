const express = require("express")
const app = express()
require("dotenv/config")
const cors = require("cors")
const port = process.env.PORT || 3000
const path = require('path')
const upload = require("./multer.js")

const categoryRoute = require("./routers/category")
const courseRoute = require("./routers/courses")
const getAllTag = require("./controllers/tags")
const uploadRoute = require("./controllers/upload")

const api = process.env.API_URI

app.use(express.json())

app.use(cors())
app.use('/public/uploads', express.static(path.join(__dirname, 'public/uploads/')));


//ROUTE
app.use(`${api}/category`, categoryRoute)
app.use(`${api}/course`, courseRoute)
app.get(`${api}/tag`, getAllTag)
app.post(`${api}/upload`,upload.single("url"), uploadRoute )


app.listen(port, console.log(`Running on the http://localhost:${port}`))


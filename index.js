const express = require("express")
require("dotenv/config")
const cors = require("cors")
const path = require('path')
const routes = require("./routers")
const port = process.env.PORT || 5000

const app = express()

// MIDDLEWARE
app.use(express.json())
app.use(cors())
app.use('/public/uploads', express.static(path.join(__dirname, 'public/uploads/')));


// ROUTE
app.use("/api/v1", routes)


app.listen(port, console.log(`Running on the http://localhost:${port}`))

